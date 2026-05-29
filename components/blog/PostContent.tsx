'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

interface PostContentProps {
  content: string;
  contentType: 'html' | 'markdown';
}

export default function PostContent({ content, contentType }: PostContentProps) {
  if (contentType === 'markdown') {
    return (
      <div className="blog-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // HTML content
  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
