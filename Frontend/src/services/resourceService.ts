import type { LegalResource } from '@/types';
import { LEGAL_RESOURCES, RESOURCE_CATEGORIES } from '@/data/legalData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function isApiConfigured(): boolean {
  return Boolean(API_BASE_URL);
}

export const resourceService = {
  async getResources(category?: string, search?: string): Promise<LegalResource[]> {
    if (isApiConfigured()) {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('q', search);
      const res = await fetch(`${API_BASE_URL}/resources?${params}`);
      if (!res.ok) throw new Error('Failed to load resources');
      return res.json();
    }

    let results = [...LEGAL_RESOURCES];
    if (category && category !== 'all') {
      results = results.filter((r) => r.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return Promise.resolve(results);
  },

  async getResourceById(id: string): Promise<LegalResource | undefined> {
    if (isApiConfigured()) {
      const res = await fetch(`${API_BASE_URL}/resources/${id}`);
      if (!res.ok) throw new Error('Failed to load resource');
      return res.json();
    }
    return Promise.resolve(LEGAL_RESOURCES.find((r) => r.id === id));
  },

  getCategories() {
    return RESOURCE_CATEGORIES;
  },
};
