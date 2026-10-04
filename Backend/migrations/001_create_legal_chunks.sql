-- Migration: Create legal_chunks table with Full-Text Search
-- Run this against the Supabase PostgreSQL database.

-- 1. Create the legal_chunks table

CREATE TABLE IF NOT EXISTS legal_chunks (
    id          BIGSERIAL PRIMARY KEY,
    act         TEXT NOT NULL,
    section     TEXT NOT NULL DEFAULT '',
    title       TEXT NOT NULL DEFAULT '',
    content     TEXT NOT NULL,
    category    TEXT NOT NULL DEFAULT 'General Law',
    tsv         TSVECTOR GENERATED ALWAYS AS (
                    to_tsvector(
                        'english',
                        coalesce(act, '') || ' ' ||
                        coalesce(section, '') || ' ' ||
                        coalesce(title, '') || ' ' ||
                        coalesce(content, '')
                    )
                ) STORED
);

-- 2. Create GIN index for fast full-text search

CREATE INDEX IF NOT EXISTS idx_legal_chunks_tsv
ON legal_chunks USING GIN (tsv);

-- 3. Create index on category for filtered queries

CREATE INDEX IF NOT EXISTS idx_legal_chunks_category
ON legal_chunks (category);

-- 4. Create RPC function for natural-language legal search

CREATE OR REPLACE FUNCTION public.match_legal_chunks(
    search_query TEXT,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id          BIGINT,
    act         TEXT,
    section     TEXT,
    title       TEXT,
    content     TEXT,
    category    TEXT,
    rank        REAL
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        lc.id,
        lc.act,
        lc.section,
        lc.title,
        lc.content,
        lc.category,
        ts_rank(
            lc.tsv,
            websearch_to_tsquery(
                'english',
                search_query
            )
        )::REAL AS rank
    FROM public.legal_chunks lc
    WHERE
        lc.tsv @@ websearch_to_tsquery(
            'english',
            search_query
        )

    ORDER BY rank DESC
    LIMIT match_count;
$$;