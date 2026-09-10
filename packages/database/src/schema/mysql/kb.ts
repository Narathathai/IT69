import { mysqlTable, varchar, text, timestamp, boolean, int, json } from 'drizzle-orm/mysql-core';

export const articles = mysqlTable('kb_articles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  viewCount: int('view_count').default(0).notNull(),
  helpfulVotes: int('helpful_votes').default(0).notNull(),
  unhelpfulVotes: int('unhelpful_votes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const embeddings = mysqlTable('kb_embeddings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  articleId: varchar('article_id', { length: 36 }).references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  chunkIndex: int('chunk_index').notNull(),
  chunkContent: text('chunk_content').notNull(),
  embedding: json('embedding').notNull(), // Stores float array as JSON in MySQL
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ArticleRecord = typeof articles.$inferSelect;
export type NewArticleRecord = typeof articles.$inferInsert;
export type EmbeddingRecord = typeof embeddings.$inferSelect;
export type NewEmbeddingRecord = typeof embeddings.$inferInsert;
