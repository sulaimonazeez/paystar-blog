import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { calculateReadTime } from '@/lib/utils';

type Params = { params: Promise<{ id: string }> };

// GET /api/posts/[id] — get by id or slug (increments views if slug)
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const db = await getDb();
    const admin = await getAdminFromRequest(req);

    let post;
    // Try ObjectId first, then slug
    if (ObjectId.isValid(id) && id.length === 24) {
      post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    } else {
      post = await db.collection('posts').findOne({ slug: id });
      // Increment views for public slug access
      if (post && (!admin)) {
        await db.collection('posts').updateOne(
          { _id: post._id },
          { $inc: { views: 1 } }
        );
        post.views = (post.views || 0) + 1;
      }
    }

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (!post.published && !admin) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    return NextResponse.json({ ...post, _id: post._id.toString() });
  } catch (err) {
    console.error('GET /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/posts/[id] — update post (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const db = await getDb();
    const body = await req.json();
    const existing = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const now = new Date();
    const updates: Record<string, unknown> = {
      updatedAt: now,
    };

    const fields = ['title', 'excerpt', 'content', 'contentType', 'category', 'tags', 'author', 'coverImage', 'featured'];
    for (const field of fields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    if (body.content) {
      updates.readTime = calculateReadTime(body.content);
    }

    if (body.published !== undefined) {
      updates.published = body.published;
      if (body.published && !existing.publishedAt) {
        updates.publishedAt = now;
      } else if (!body.published) {
        updates.publishedAt = null;
      }
    }

    if (body.seo) {
      updates.seo = {
        metaTitle: body.seo.metaTitle || body.title || existing.title,
        metaDescription: body.seo.metaDescription || body.excerpt || existing.excerpt || '',
        ogImage: body.seo.ogImage || body.coverImage || existing.coverImage || '',
      };
    }

    await db.collection('posts').updateOne({ _id: new ObjectId(id) }, { $set: updates });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] — delete post (admin only)
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const db = await getDb();
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
