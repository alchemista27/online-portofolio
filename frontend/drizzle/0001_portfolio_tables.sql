-- Migration for portfolio tables
-- Run this manually against the Neon database

-- Projects table
CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "description" text,
  "image_url" text,
  "github_url" text,
  "live_url" text,
  "technologies_used" jsonb,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "order_id" serial,
  "user_id" uuid REFERENCES neon_auth."user"(id),
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" serial PRIMARY KEY,
  "client_name" text NOT NULL,
  "client_email" text NOT NULL,
  "service_type" varchar(20) NOT NULL,
  "description" text,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "order_date" timestamp DEFAULT NOW(),
  "completion_date" timestamp,
  "user_id" uuid REFERENCES neon_auth."user"(id)
);

-- Technologies table
CREATE TABLE IF NOT EXISTS "technologies" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "icon_url" text
);

-- About page table
CREATE TABLE IF NOT EXISTS "about_page" (
  "id" serial PRIMARY KEY,
  "content" text,
  "user_id" uuid REFERENCES neon_auth."user"(id),
  "updated_at" timestamp DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" serial PRIMARY KEY,
  "client_name" text NOT NULL,
  "client_review" text NOT NULL,
  "client_avatar_url" text,
  "user_id" uuid REFERENCES neon_auth."user"(id),
  "created_at" timestamp DEFAULT NOW()
);
