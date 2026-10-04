import { PROCESSING_STAGES } from '@/data/chatData';
import { useEffect, useState } from 'react';

type Props = {
  stageIndex: number;
};

export default function ProcessingState({ stageIndex }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(stageIndex + 1);
  }, [stageIndex]);

  return (
    <div className="px-6 py-8">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 border border-bronze-500/50 flex items-center justify-center">
            <span className="text-[9px] text-bronze-300 font-serif">AI</span>
          </div>
          <span className="text-[11px] uppercase tracking-label text-ivory-muted">Processing</span>
        </div>

        <div className="space-y-4 pl-1">
          {PROCESSING_STAGES.map((stage, i) => {
            const isActive = i === stageIndex;
            const isDone = i < stageIndex;
            return (
              <div
                key={stage.id}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  i < visibleCount ? 'opacity-100' : 'opacity-20'
                }`}
              >
                <div className="relative w-4 h-4 flex-shrink-0">
                  {isDone ? (
                    <div className="w-4 h-4 border border-bronze-500/60 bg-bronze-500/20" />
                  ) : isActive ? (
                    <>
                      <div className="w-4 h-4 border border-bronze-400" />
                      <div className="absolute inset-0.5 bg-bronze-400/40 animate-pulse" />
                    </>
                  ) : (
                    <div className="w-4 h-4 border border-ink-500" />
                  )}
                </div>
                <span
                  className={`text-[13px] uppercase tracking-label transition-colors duration-300 ${
                    isActive
                      ? 'text-bronze-300'
                      : isDone
                      ? 'text-ivory/70'
                      : 'text-ivory-muted'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
