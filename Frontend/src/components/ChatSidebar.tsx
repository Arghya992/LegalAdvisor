import { Plus, MessageSquare } from 'lucide-react';
import type { Consultation } from '@/types';
import { LEGAL_CATEGORIES } from '@/data/legalData';
import { getIcon } from '@/utils/icons';

type Props = {
  consultations: Consultation[];
  activeId: string | null;
  selectedCategory: string | null;
  onSelectConsultation: (id: string) => void;
  onSelectCategory: (id: string) => void;
  onNewConsultation: () => void;
};

export default function ChatSidebar({
  consultations,
  activeId,
  selectedCategory,
  onSelectConsultation,
  onSelectCategory,
  onNewConsultation,
}: Props) {
  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 border-r border-ink-600 bg-ink-800/50 flex flex-col h-full">
      <div className="p-5 border-b border-ink-600">
        <p className="eyebrow mb-4">Legal Advisor</p>
        <button
          onClick={onNewConsultation}
          className="w-full flex items-center gap-2 px-4 py-3 border border-ink-500 text-ivory text-sm hover:border-bronze-500 hover:text-bronze-300 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {consultations.length > 0 && (
          <div className="p-5 border-b border-ink-600">
            <p className="section-label mb-4">Recent Consultations</p>
            <div className="space-y-1">
              {consultations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectConsultation(c.id)}
                  className={`w-full text-left px-3 py-2.5 group transition-colors duration-200 ${
                    activeId === c.id
                      ? 'bg-ink-700 border-l-2 border-bronze-400'
                      : 'hover:bg-ink-700/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <MessageSquare className="w-3.5 h-3.5 text-ivory-muted mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-ivory truncate group-hover:text-bronze-300 transition-colors">
                        {c.title}
                      </p>
                      <p className="text-[11px] text-ivory-muted mt-0.5">{c.date}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-5">
          <p className="section-label mb-4">Categories</p>
          <div className="space-y-1">
            {LEGAL_CATEGORIES.map((cat) => {
              const Icon = getIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 ${
                    selectedCategory === cat.id
                      ? 'text-bronze-300'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-[13px]">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
