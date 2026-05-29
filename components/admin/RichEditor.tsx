'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import MDEditor from '@uiw/react-md-editor';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code, Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Highlighter,
  Undo, Redo, Code2,
} from 'lucide-react';
import { useState, useCallback } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  contentType: 'html' | 'markdown';
  onContentTypeChange: (type: 'html' | 'markdown') => void;
}

function ToolbarBtn({
  onClick, active = false, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
        active
          ? 'bg-orange/20 text-orange'
          : 'text-text-muted hover:bg-dark-border hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, contentType, onContentTypeChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: false }),
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true, inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-orange underline' } }),
      Placeholder.configure({ placeholder: 'Start writing your post...' }),
      CharacterCount,
    ],
    content: contentType === 'html' ? value : '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="overflow-hidden rounded-xl border border-dark-border2">
      {/* Editor Type Toggle */}
      <div className="flex items-center justify-between border-b border-dark-border bg-dark-card2 px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onContentTypeChange('html')}
            className={`rounded-lg px-3 py-1.5 text-xs font-600 transition-colors ${
              contentType === 'html'
                ? 'bg-orange text-white'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Rich Text
          </button>
          <button
            type="button"
            onClick={() => onContentTypeChange('markdown')}
            className={`rounded-lg px-3 py-1.5 text-xs font-600 transition-colors ${
              contentType === 'markdown'
                ? 'bg-orange text-white'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Markdown
          </button>
        </div>
        {editor && contentType === 'html' && (
          <span className="text-xs text-text-dim">
            {editor.storage.characterCount.words()} words
          </span>
        )}
      </div>

      {/* TipTap Toolbar */}
      {contentType === 'html' && editor && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-dark-border bg-dark-card px-2 py-1.5">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
            <Bold size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
            <Italic size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
            <UnderlineIcon size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
            <Highlighter size={14} />
          </ToolbarBtn>

          <div className="mx-1 h-5 w-px bg-dark-border" />

          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
            <Heading1 size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
            <Heading2 size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
            <Heading3 size={14} />
          </ToolbarBtn>

          <div className="mx-1 h-5 w-px bg-dark-border" />

          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
            <List size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
            <ListOrdered size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
            <Quote size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
            <Code size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
            <Code2 size={14} />
          </ToolbarBtn>

          <div className="mx-1 h-5 w-px bg-dark-border" />

          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <AlignRight size={14} />
          </ToolbarBtn>

          <div className="mx-1 h-5 w-px bg-dark-border" />

          <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Add Link">
            <LinkIcon size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={addImage} active={false} title="Add Image">
            <ImageIcon size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Divider">
            <Minus size={14} />
          </ToolbarBtn>

          <div className="mx-1 h-5 w-px bg-dark-border" />

          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
            <Undo size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
            <Redo size={14} />
          </ToolbarBtn>
        </div>
      )}

      {/* Editor content */}
      {contentType === 'html' ? (
        <div className="min-h-[420px] bg-dark-card p-5">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div data-color-mode="dark">
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || '')}
            height={420}
            preview="edit"
          />
        </div>
      )}
    </div>
  );
}
