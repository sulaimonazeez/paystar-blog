import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.paystar.com.ng';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
