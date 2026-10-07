import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceService } from '@/services/resourceService';
import { RESOURCE_CATEGORIES } from '@/data/legalData';
import type { LegalResource } from '@/types';
import { Search, X, ArrowLeft, FileText, BookOpen } from 'lucide-react';

export default function LegalResources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [resources, setResources] = useState<LegalResource[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    resourceService
      .getResources(activeCategory, searchQuery)
      .then((data: LegalResource[]) => {
        if (!isMounted) return;
        setResources(data || []);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error('Error loading resources:', err);
        setResources([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, searchQuery]);

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  if (selectedResource) {
    return (
      <div className="pt-14 min-h-screen">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
          <button
            onClick={() => setSelectedResource(null)}
            className="text-sm text-ivory-muted hover:text-bronze-300 mb-8 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </button>

          <div className="border border-ink-600 bg-ink-800 p-8 sm:p-12">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-4 h-4 text-bronze-400" strokeWidth={1.5} />
              <span className="eyebrow">{selectedResource.type}</span>
              {selectedResource.isDemo && (
                <span className="text-[9px] uppercase tracking-label text-bronze-500/80 border border-bronze-500/30 px-1.5 py-0.5">
                  Demo Resource
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-ivory mb-8 leading-tight">
              {selectedResource.title}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 border-y border-ink-600 py-6">
              {selectedResource.metadata?.jurisdiction && (
                <div>
                  <p className="text-[10px] uppercase tracking-label text-ivory-muted mb-1">Jurisdiction</p>
                  <p className="text-sm text-ivory">{selectedResource.metadata.jurisdiction}</p>
                </div>
              )}
              {selectedResource.metadata?.year && (
                <div>
                  <p className="text-[10px] uppercase tracking-label text-ivory-muted mb-1">Year</p>
                  <p className="text-sm text-ivory">{selectedResource.metadata.year}</p>
                </div>
              )}
              {selectedResource.metadata?.authority && (
                <div>
                  <p className="text-[10px] uppercase tracking-label text-ivory-muted mb-1">Authority</p>
                  <p className="text-sm text-ivory">{selectedResource.metadata.authority}</p>
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-ivory/90 leading-relaxed text-base">
                {selectedResource.description}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-ink-600">
              <p className="text-xs text-ivory-muted leading-relaxed">
                This is a demo resource for illustration purposes. In the production
                system, this view will contain the full text of the provision,
                related sections, case references, and cross-links to the legal
                knowledge base.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
        <p className="section-label mb-6">Legal Resources</p>
        <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl mb-6 text-balance">
          Your legal reference library.
        </h1>
        <p className="text-base text-ivory-muted max-w-xl mb-12">
          Browse acts, statutes, constitutional provisions, legal procedures, and a
          plain-language glossary. All resources are clearly marked as demo data.
        </p>

        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="input-field pl-11"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-muted hover:text-bronze-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`text-[12px] uppercase tracking-label px-4 py-2 border transition-colors duration-200 ${
              activeCategory === 'all'
                ? 'border-bronze-500 text-bronze-300 bg-bronze-500/10'
                : 'border-ink-500 text-ivory-muted hover:border-bronze-500/40 hover:text-ivory'
            }`}
          >
            All
          </button>
          {RESOURCE_CATEGORIES.map((cat: { id: string; name: string }) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`text-[12px] uppercase tracking-label px-4 py-2 border transition-colors duration-200 ${
                activeCategory === cat.id
                  ? 'border-bronze-500 text-bronze-300 bg-bronze-500/10'
                  : 'border-ink-500 text-ivory-muted hover:border-bronze-500/40 hover:text-ivory'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ivory-muted">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-ink-500 mx-auto mb-4" strokeWidth={1} />
            <p className="text-sm text-ivory-muted">No resources found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource: LegalResource) => (
              <button
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="card-surface p-6 text-left hover:border-bronze-500/50 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-label text-bronze-400">
                    {resource.type}
                  </span>
                  {resource.isDemo && (
                    <span className="text-[9px] uppercase tracking-label text-ivory-muted border border-ink-500 px-1.5 py-0.5">
                      Demo
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg text-ivory mb-3 group-hover:text-bronze-300 transition-colors leading-snug">
                  {resource.title}
                </h3>
                <p className="text-xs text-ivory-muted leading-relaxed line-clamp-3">
                  {resource.description}
                </p>
                <div className="flex items-center gap-1 mt-4 text-[11px] text-bronze-400 uppercase tracking-label opacity-0 group-hover:opacity-100 transition-opacity">
                  View Resource <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}