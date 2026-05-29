import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { generateSlug, calculateReadTime } from '@/lib/utils';

// GET /api/posts — public list (published only) or all for admin
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = await getAdminFromRequest(req);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const db = await getDb();
    const filter: Record<string, unknown> = {};

    if (!admin) filter.published = true;
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await db.collection('posts').countDocuments(filter);
    const posts = await db
      .collection('posts')
      .find(filter, {
        projection: {
          content: 0, // exclude content from list for performance
        },
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      posts: posts.map((p) => ({ ...p, _id: p._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('GET /api/posts error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/posts — create new post (admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      title, excerpt, content, contentType = 'html',
      category, tags = [], author, coverImage = '',
      published = false, featured = false,
      seo = {},
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category required' }, { status: 400 });
    }

    const db = await getDb();

    // Generate unique slug
    let slug = generateSlug(title);
    const existing = await db.collection('posts').findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const readTime = calculateReadTime(content);
    const now = new Date();

    const post = {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || '',
      content,
      contentType,
      category,
      tags: Array.isArray(tags) ? tags : [],
      author: author?.trim() || admin.name,
      coverImage,
      published,
      featured,
      views: 0,
      readTime,
      seo: {
        metaTitle: seo.metaTitle || title,
        metaDescription: seo.metaDescription || excerpt || '',
        ogImage: seo.ogImage || coverImage || '',
      },
      createdAt: now,
      updatedAt: now,
      publishedAt: published ? now : null,
    };

    const result = await db.collection('posts').insertOne(post);

    return NextResponse.json({ success: true, id: result.insertedId.toString(), slug }, { status: 201 });
  } catch (err) {
    console.error('POST /api/posts error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
