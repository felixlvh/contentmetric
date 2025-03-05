'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { common, createLowlight } from 'lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github-dark.css';
import BubbleMenu from './BubbleMenu';
import { createSlashCommandsExtension, suggestion } from './SlashCommands';

// Create a custom lowlight instance with our languages
const customLowlight = createLowlight(common);
customLowlight.register('html', html);
customLowlight.register('css', css);
customLowlight.register('js', js);
customLowlight.register('ts', ts);

interface DocumentEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export default function DocumentEditor({ 
  content, 
  onChange,
  editable = true 
}: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight: customLowlight,
        HTMLAttributes: {
          class: 'rounded-md bg-gray-900 p-4 my-2 overflow-x-auto',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      createSlashCommandsExtension().configure({
        suggestion: suggestion,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleChange(html);
    },
  });

  // Debounced save function
  const handleChange = useCallback(
    debounce((newContent: string) => {
      onChange?.(newContent);
    }, 750),
    [onChange]
  );

  // Update editor content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="prose max-w-none">
      <BubbleMenu editor={editor} />
      <div className="min-h-[200px] [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:text-gray-400 [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:pointer-events-none">
        <EditorContent 
          editor={editor} 
          className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:focus:outline-none [&_.hljs]:!bg-transparent [&_.hljs]:!p-0 [&_pre]:!m-0 [&_code]:text-sm [&_code]:font-mono [&_code]:text-white [&_ul]:list-disc [&_ol]:list-decimal"
        />
      </div>
    </div>
  );
} 