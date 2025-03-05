import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
} from 'lucide-react';

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor) {
    return null;
  }

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex overflow-hidden rounded border border-gray-200 bg-white shadow-lg"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 text-gray-600 hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-100 text-blue-600' : ''
        }`}
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 text-gray-600 hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-100 text-blue-600' : ''
        }`}
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 text-gray-600 hover:bg-gray-100 ${
          editor.isActive('strike') ? 'bg-gray-100 text-blue-600' : ''
        }`}
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 text-gray-600 hover:bg-gray-100 ${
          editor.isActive('code') ? 'bg-gray-100 text-blue-600' : ''
        }`}
      >
        <Code className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 text-gray-600 hover:bg-gray-100 ${
          editor.isActive('link') ? 'bg-gray-100 text-blue-600' : ''
        }`}
      >
        <LinkIcon className="h-4 w-4" />
      </button>
    </TiptapBubbleMenu>
  );
} 