import { MetadataRoute } from 'next';
import { getDb } from '@/lib/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.paystar.com.ng';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  ];

  try {
    const db = await getDb();
    const posts = await db
      .collection('posts')
      .find({ published: true }, { projection: { slug: 1, updatedAt: 1 } })
      .toArray();

    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...postPages];
  } catch {
    return staticPages;
  }
}
