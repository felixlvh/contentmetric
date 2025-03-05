import { ReactNode } from 'react';
import { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { createRoot, type Root } from 'react-dom/client';
import { toast } from 'react-hot-toast';
import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Text,
  Code,
  Quote,
  CheckSquare,
  Sparkles,
  Maximize2,
  Minimize2,
  MessageSquare,
  Pencil,
  Wand2,
} from 'lucide-react';

interface RequestBody {
  prompt: 'improve' | 'expand' | 'summarize' | 'fix_grammar' | 'change_tone' | 'generate';
  content: string;
  tone?: string;
}

interface CommandItem {
  title: string;
  description: string;
  icon: ReactNode;
  command: (editor: Editor) => void;
  category?: 'basic' | 'ai';
}

async function handleAICommand(
  editor: Editor,
  prompt: RequestBody['prompt'],
  content: string,
  tone?: string
) {
  const { from, to } = editor.state.selection;
  const loadingToast = toast.loading('Processing with AI...');
  
  try {
    const response = await fetch('/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        content,
        ...(tone && { tone }),
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to process text');
    }

    // For generate command, just insert at current position
    if (prompt === 'generate') {
      editor.chain().focus().insertContent(data.content).run();
    } else {
      // For other commands, replace the selected text
      editor.chain()
        .focus()
        .setTextSelection({ from, to })
        .deleteSelection()
        .insertContent(data.content)
        .run();
    }
    
    toast.success('Successfully processed text');
  } catch (error) {
    console.error('Error processing text:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to process text');
  } finally {
    toast.dismiss(loadingToast);
  }
}

const commands: CommandItem[] = [
  {
    title: 'Text',
    description: 'Just start writing with plain text',
    icon: <Text className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().setParagraph().run();
    },
    category: 'basic',
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().setHeading({ level: 1 }).run();
    },
    category: 'basic',
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().setHeading({ level: 2 }).run();
    },
    category: 'basic',
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    icon: <List className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
    category: 'basic',
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: <ListOrdered className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
    category: 'basic',
  },
  {
    title: 'Code Block',
    description: 'Add code with syntax highlighting',
    icon: <Code className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
    category: 'basic',
  },
  {
    title: 'Quote',
    description: 'Add a quote or citation',
    icon: <Quote className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
    category: 'basic',
  },
  {
    title: 'Task List',
    description: 'Track tasks with a to-do list',
    icon: <CheckSquare className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleTaskList().run();
    },
    category: 'basic',
  },
  {
    title: 'AI: Improve Writing',
    description: 'Enhance the selected text with AI',
    icon: <Sparkles className="w-4 h-4" />,
    command: async (editor: Editor) => {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      
      if (!selectedText) {
        toast.error('Please select some text first');
        return;
      }

      await handleAICommand(editor, 'improve', selectedText);
    },
    category: 'ai',
  },
  {
    title: 'AI: Make Longer',
    description: 'Expand the selected text with more details',
    icon: <Maximize2 className="w-4 h-4" />,
    command: async (editor: Editor) => {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      
      if (!selectedText) {
        toast.error('Please select some text first');
        return;
      }

      await handleAICommand(editor, 'expand', selectedText);
    },
    category: 'ai',
  },
  {
    title: 'AI: Make Shorter',
    description: 'Summarize the selected text',
    icon: <Minimize2 className="w-4 h-4" />,
    command: async (editor: Editor) => {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      
      if (!selectedText) {
        toast.error('Please select some text first');
        return;
      }

      await handleAICommand(editor, 'summarize', selectedText);
    },
    category: 'ai',
  },
  {
    title: 'AI: Fix Grammar',
    description: 'Correct grammar and spelling',
    icon: <Pencil className="w-4 h-4" />,
    command: async (editor: Editor) => {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      
      if (!selectedText) {
        toast.error('Please select some text first');
        return;
      }

      await handleAICommand(editor, 'fix_grammar', selectedText);
    },
    category: 'ai',
  },
  {
    title: 'AI: Change Tone',
    description: 'Adjust the writing style',
    icon: <Wand2 className="w-4 h-4" />,
    command: async (editor: Editor) => {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      
      if (!selectedText) {
        toast.error('Please select some text first');
        return;
      }

      const tone = window.prompt('Enter desired tone (e.g., professional, casual, friendly):', 'professional');
      if (!tone) return;

      await handleAICommand(editor, 'change_tone', selectedText, tone);
    },
    category: 'ai',
  },
  {
    title: 'AI: Generate Content',
    description: 'Generate new content with AI',
    icon: <MessageSquare className="w-4 h-4" />,
    command: async (editor: Editor) => {
      const prompt = window.prompt('What would you like to write about?');
      if (!prompt) return;

      await handleAICommand(editor, 'generate', prompt);
    },
    category: 'ai',
  },
];

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export function CommandList({ items, command }: CommandListProps) {
  const basicCommands = items.filter(item => item.category === 'basic');
  const aiCommands = items.filter(item => item.category === 'ai');

  return (
    <div className="p-1 max-h-[330px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
      {basicCommands.length > 0 && (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-gray-400">Basic Formatting</div>
          {basicCommands.map((item, index) => (
            <button
              key={index}
              onClick={() => command(item)}
              className="flex w-full items-center space-x-3 rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </button>
          ))}
        </>
      )}
      
      {aiCommands.length > 0 && (
        <>
          <div className="mt-2 px-4 py-2 text-xs font-semibold text-gray-400">AI Commands</div>
          {aiCommands.map((item, index) => (
            <button
              key={`ai-${index}`}
              onClick={() => command(item)}
              className="flex w-full items-center space-x-3 rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

interface CommandProps {
  editor: Editor;
  range: {
    from: number;
    to: number;
  };
  props: {
    command: (editor: Editor) => void;
    items: CommandItem[];
  };
}

export function createSlashCommandsExtension() {
  return Extension.create({
    name: 'slash-commands',
    addOptions() {
      return {
        suggestion: {
          char: '/',
          command: ({ editor, range, props }: CommandProps) => {
            // Store the current selection before deleting the slash command
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to);
            
            // Delete the slash command text
            editor.chain().focus().deleteRange({
              from: range.from - 1, // Include the '/' character
              to: range.to
            }).run();
            
            // If there was selected text, restore the selection
            if (selectedText) {
              editor.chain().focus().setTextSelection({ from, to }).run();
            }
            
            // Execute the command
            props.command(editor);
          },
        },
      };
    },
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
}

interface SuggestionProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
  clientRect: () => DOMRect;
  event?: KeyboardEvent;
}

export const suggestion = {
  items: ({ query }: { query: string }) => {
    return commands.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  },
  render: () => {
    let reactRenderer: Root | null = null;
    let popup: HTMLElement | null = null;
    let isDestroyed = false;

    const createPopup = () => {
      if (popup || isDestroyed) return;
      
      popup = document.createElement('div');
      popup.className = 'fixed z-50';
      document.body.appendChild(popup);
      reactRenderer = createRoot(popup);
    };

    const destroyPopup = () => {
      if (!popup || !reactRenderer) return;
      
      try {
        reactRenderer.unmount();
      } catch (e) {
        console.error('Error unmounting React root:', e);
      }
      
      popup.remove();
      reactRenderer = null;
      popup = null;
    };

    return {
      onStart: (props: SuggestionProps) => {
        isDestroyed = false;
        createPopup();
        
        if (!popup || !reactRenderer) return;
        
        const coordinates = props.clientRect();
        popup.style.left = `${coordinates.x}px`;
        popup.style.top = `${coordinates.y}px`;

        try {
          reactRenderer.render(<CommandList items={props.items} command={props.command} />);
        } catch (e) {
          console.error('Error rendering command list:', e);
          destroyPopup();
        }
      },
      onUpdate: (props: SuggestionProps) => {
        if (!popup || !reactRenderer || isDestroyed) return;

        const coordinates = props.clientRect();
        popup.style.left = `${coordinates.x}px`;
        popup.style.top = `${coordinates.y}px`;

        try {
          reactRenderer.render(<CommandList items={props.items} command={props.command} />);
        } catch (e) {
          console.error('Error updating command list:', e);
          destroyPopup();
        }
      },
      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === 'Escape') {
          destroyPopup();
          isDestroyed = true;
          return true;
        }
        return false;
      },
      onExit: () => {
        destroyPopup();
        isDestroyed = true;
      },
    };
  },
}; 