import { pgSchema, uuid, varchar, text, timestamp, boolean, integer, customType } from 'drizzle-orm/pg-core';

export const kbSchema = pgSchema('kb');

export const vector1536 = customType<{ data: number[] }>({
  dataType() {
    return 'vector(1536)';
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`;
  },
  fromDriver(value: unknown): number[] {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as number[];
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? (value as number[]) : [];
  },
});

export const articles = kbSchema.table('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  helpfulVotes: integer('helpful_votes').default(0).notNull(),
  unhelpfulVotes: integer('unhelpful_votes').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const embeddings = kbSchema.table('embeddings', {
  id: uuid('id').defaultRandom().primaryKey(),
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  chunkContent: text('chunk_content').notNull(),
  embedding: vector1536('embedding').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ArticleRecord = typeof articles.$inferSelect;
export type NewArticleRecord = typeof articles.$inferInsert;
export type EmbeddingRecord = typeof embeddings.$inferSelect;
export type NewEmbeddingRecord = typeof embeddings.$inferInsert;
