import type { ChatMessage } from '@/types';
import LegalResponse from './LegalResponse';

type Props = {
  message: ChatMessage;
};

export default function ChatMessageView({
  message,
}: Props) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end px-6 py-5">
        <div className="max-w-2xl">
          <div className="bg-ink-700 border border-ink-600 px-5 py-3.5">
            <p className="text-sm text-ivory leading-relaxed">
              {message.content}
            </p>
          </div>

          <p className="text-[10px] text-ivory-muted mt-1.5 text-right uppercase tracking-label">
            {message.timestamp}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-5">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 border border-bronze-500/50 flex items-center justify-center">
            <span className="text-[9px] text-bronze-300 font-serif">
              AI
            </span>
          </div>

          <span className="text-[11px] uppercase tracking-label text-ivory-muted">
            Legal Advisor
          </span>

          <span className="text-[10px] text-ivory-muted/60">
            {message.timestamp}
          </span>
        </div>

        {message.response && (
          <LegalResponse
            response={message.response}
          />
        )}
      </div>
    </div>
  );
}