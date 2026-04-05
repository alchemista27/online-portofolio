import { pgTable, serial, text, timestamp, jsonb, varchar, uuid, integer } from 'drizzle-orm/pg-core';
import { neonAuth, userInNeonAuth } from '../../drizzle/schema';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  technologiesUsed: jsonb('technologies_used'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  orderId: serial('order_id'),
  userId: uuid('user_id').references(() => userInNeonAuth.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),
  serviceType: varchar('service_type', { length: 20 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  orderDate: timestamp('order_date').defaultNow(),
  completionDate: timestamp('completion_date'),
  userId: uuid('user_id').references(() => userInNeonAuth.id),
});

export const technologies = pgTable('technologies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  iconUrl: text('icon_url'),
});

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content'),
  excerpt: text('excerpt'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  template: varchar('template', { length: 50 }),
  userId: uuid('user_id').references(() => userInNeonAuth.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: varchar('location', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').references(() => menus.id).notNull(),
  title: text('title').notNull(),
  url: text('url'),
  pageId: integer('page_id').references(() => pages.id),
  parentId: integer('parent_id'),
  order: integer('order').notNull().default(0),
  target: varchar('target', { length: 10 }).default('_self'),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientReview: text('client_review').notNull(),
  clientAvatarUrl: text('client_avatar_url'),
  userId: uuid('user_id').references(() => userInNeonAuth.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Technology = typeof technologies.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Menu = typeof menus.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
