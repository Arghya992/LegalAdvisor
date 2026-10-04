import type { LegalResponseData } from '@/types';
import {
  BookOpen,
  FileText,
  ListChecks,
  Lightbulb,
  Quote,
} from 'lucide-react';

type Props = {
  response: LegalResponseData;
};

const SECTIONS = [
  {
    key: 'understanding',
    label: 'Understanding',
    icon: Lightbulb,
  },
  {
    key: 'relevantLaw',
    label: 'Relevant Law',
    icon: BookOpen,
  },
  {
    key: 'explanation',
    label: 'Explanation',
    icon: FileText,
  },
] as const;

export default function LegalResponse({
  response,
}: Props) {
  if (!response) {
    return (
      <p className="text-sm text-ivory/60 italic">
        No response data available.
      </p>
    );
  }

  const nextSteps = Array.isArray(
    response.nextSteps
  )
    ? response.nextSteps
    : [];

  const sources = Array.isArray(
    response.sources
  )
    ? response.sources
    : [];

  return (
    <div className="space-y-6">

      {/* Main response sections */}
      {SECTIONS.map(
        ({ key, label, icon: Icon }) => {
          const value =
            response[key];

          const content =
            typeof value === 'string'
              ? value
              : '';

          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  className="w-3.5 h-3.5 text-bronze-400"
                  strokeWidth={1.5}
                />

                <p className="eyebrow">
                  {label}
                </p>
              </div>

              <p className="text-sm text-ivory/90 leading-relaxed pl-5 whitespace-pre-wrap">
                {content || 'N/A'}
              </p>
            </div>
          );
        }
      )}

      {/* Next steps */}
      {nextSteps.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ListChecks
              className="w-3.5 h-3.5 text-bronze-400"
              strokeWidth={1.5}
            />

            <p className="eyebrow">
              Possible Next Steps
            </p>
          </div>

          <ul className="pl-5 space-y-2">
            {nextSteps.map((step, index) => (
              <li
                key={index}
                className="text-sm text-ivory/90 leading-relaxed flex gap-2"
              >
                <span className="text-bronze-500 text-xs mt-1">
                  {String(index + 1).padStart(
                    2,
                    '0'
                  )}
                </span>

                <span>
                  {typeof step === 'string'
                    ? step
                    : JSON.stringify(step)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Quote
              className="w-3.5 h-3.5 text-bronze-400"
              strokeWidth={1.5}
            />

            <p className="eyebrow">
              Sources
            </p>
          </div>

          <div className="pl-5 space-y-3">
            {sources.map((source, index) => (
              <div
                key={source.id || index}
                className="border-l border-ink-500 pl-3"
              >
                <p className="text-sm text-ivory/90">
                  {source.act ||
                    'Reference Document'}
                  {' — '}
                  {source.section ||
                    'General'}
                </p>

                {source.provision && (
                  <p className="text-xs text-ivory-muted mt-1 leading-relaxed">
                    {source.provision}
                  </p>
                )}

                {source.isDemo && (
                  <span className="inline-block mt-1 text-[9px] uppercase tracking-label text-bronze-500/80 border border-bronze-500/30 px-1.5 py-0.5">
                    Demo Source
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}