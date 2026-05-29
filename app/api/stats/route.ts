import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const collection = db.collection('posts');

    const [totalPosts, publishedPosts, draftPosts, featuredPosts, viewsAgg, categoriesAgg] =
      await Promise.all([
        collection.countDocuments({}),
        collection.countDocuments({ published: true }),
        collection.countDocuments({ published: false }),
        collection.countDocuments({ featured: true }),
        collection.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]).toArray(),
        collection.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]).toArray(),
      ]);

    const recentPosts = await collection
      .find({}, { projection: { title: 1, slug: 1, published: 1, views: 1, createdAt: 1, category: 1 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalViews: viewsAgg[0]?.total || 0,
      categories: categoriesAgg.map((c) => ({ name: c._id, count: c.count })),
      recentPosts: recentPosts.map((p) => ({ ...p, _id: p._id.toString() })),
    });
  } catch (err) {
    console.error('GET /api/stats error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
