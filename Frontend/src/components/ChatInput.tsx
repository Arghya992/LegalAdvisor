import { useRef, useEffect, useState } from 'react';
import { Paperclip, Mic, Send } from 'lucide-react';
import { SAMPLE_QUESTIONS } from '@/data/chatData';

type Props = {
  onSend: (content: string) => void;
  disabled: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-ink-600 bg-ink-800/80 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 border border-ink-500 bg-ink-900 focus-within:border-bronze-500 transition-colors">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your legal question..."
              rows={1}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-ivory placeholder:text-ivory-muted focus:outline-none resize-none"
            />
            <div className="flex items-center gap-1 px-2 py-2">
              <button
                className="p-2 text-ivory-muted hover:text-bronze-300 transition-colors"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-ivory-muted hover:text-bronze-300 transition-colors"
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={disabled || !text.trim()}
                className="p-2 text-ivory-muted hover:text-bronze-300 disabled:opacity-30 disabled:hover:text-ivory-muted transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {SAMPLE_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => setText(q)}
                disabled={disabled}
                className="text-[11px] text-ivory-muted border border-ink-500 px-3 py-1.5 hover:border-bronze-500/50 hover:text-bronze-300 transition-colors disabled:opacity-50"
              >
                {q.length > 50 ? q.slice(0, 50) + '...' : q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
