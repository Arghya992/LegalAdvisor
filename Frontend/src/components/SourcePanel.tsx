import type { LegalSource } from '@/types';
import { FileText, Tag, Calendar, Building } from 'lucide-react';

type Props = {
  sources: LegalSource[];
  visible: boolean;
};

export default function SourcePanel({ sources, visible }: Props) {
  return (
    <aside className="hidden xl:flex w-80 flex-shrink-0 border-l border-ink-600 bg-ink-800/50 flex-col h-full">
      <div className="p-5 border-b border-ink-600">
        <p className="eyebrow">Context & Sources</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!visible || sources.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-8 h-8 text-ink-500 mx-auto mb-4" strokeWidth={1} />
            <p className="text-sm text-ivory-muted leading-relaxed">
              Sources and legal references will appear here after you ask a question.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.id} className="border border-ink-600 p-4 hover:border-bronze-500/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-bronze-400" strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-label text-ivory-muted">Reference</span>
                  </div>
                  {source.isDemo && (
                    <span className="text-[9px] uppercase tracking-label text-bronze-500/80 border border-bronze-500/30 px-1.5 py-0.5">
                      Demo
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-base text-ivory mb-3">{source.act}</h4>

                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <Tag className="w-3 h-3 text-ivory-muted mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <span className="text-ivory-muted">Section: </span>
                      <span className="text-ivory/90">{source.section}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <FileText className="w-3 h-3 text-ivory-muted mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <span className="text-ivory-muted">Provision: </span>
                      <span className="text-ivory/90">{source.provision}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Building className="w-3 h-3 text-ivory-muted mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <span className="text-ivory-muted">Source: </span>
                      <span className="text-ivory/90">{source.reference}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-ink-600">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3 h-3 text-ivory-muted" strokeWidth={1.5} />
                <span className="text-[11px] uppercase tracking-label text-ivory-muted">Metadata</span>
              </div>
              <p className="text-xs text-ivory-muted leading-relaxed">
                Retrieved from demo knowledge base. In production, sources will be
                traced to verified legal databases with full citation metadata.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
