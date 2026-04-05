# Rencana Proyek Portofolio Online (Next.js + NestJS + Neon DB + Neon Auth + Drizzle ORM)

**Perubahan dari rencana sebelumnya:**
- Authentication: Menggunakan **Neon Auth** (managed auth dari Neon) menggantikan JWT manual
- Database: Menggunakan **Neon Database** (PostgreSQL) dari Neon
- ORM: Menggunakan **Drizzle ORM** menggantikan Prisma/TypeORM

---

## Tahap 1: Inisialisasi Proyek & Persiapan Lingkungan

1.  **Buat Direktori Proyek:**
    *   Pastikan direktori utama `/home/alchemista/projects/online-portofolio` ada.
    *   Buat dua sub-direktori di dalamnya: `frontend` (untuk Next.js) dan `backend` (untuk NestJS).
2.  **Inisialisasi Proyek Frontend (Next.js):**
    *   Navigasi ke direktori `frontend`.
    *   Inisialisasi proyek Next.js baru.
    *   Konfigurasi Tailwind CSS.
3.  **Inisialisasi Proyek Backend (NestJS):**
    *   Navigasi ke direktori `backend`.
    *   Inisialisasi proyek NestJS baru.
4.  **Inisialisasi Repository Git:**
    *   Inisialisasi Git di direktori `/home/alchemista/projects/online-portofolio`.
    *   Tambahkan `.gitignore` yang sesuai untuk Next.js dan NestJS.
    *   Lakukan commit awal.
5.  **Persiapan Database & Auth Neon:**
    *   Buat akun di Neon.tech dan provisi database PostgreSQL baru.
    *   Enable **Neon Auth** di Neon Console untuk authentication management.
    *   Simpan credentials:
        *   `DATABASE_URL` (pooled connection)
        *   `NEON_AUTH_BASE_URL`
        *   `NEON_AUTH_COOKIE_SECRET` (generate dengan `openssl rand -base64 32`)

---

## Tahap 2: Setup Database & Authentication (Frontend + Drizzle + Neon Auth)

### 2.1 Setup Drizzle ORM di Frontend

1.  **Install dependencies:**
    ```bash
    cd frontend
    npm install @neondatabase/serverless drizzle-orm @neondatabase/auth @neondatabase/auth/react
    npm install -D drizzle-kit dotenv
    ```

2.  **Konfigurasi environment variables:**
    Buat `.env` di folder frontend:
    ```
    DATABASE_URL="postgresql://..."
    NEON_AUTH_BASE_URL="https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth"
    NEON_AUTH_COOKIE_SECRET="your-secret-at-least-32-characters-long"
    ```

3.  **Buat Drizzle config** (`drizzle.config.ts`):
    ```typescript
    import type { Config } from 'drizzle-kit';
    export default {
      schema: './src/db/schema.ts',
      out: './drizzle',
      dialect: 'postgresql',
      schemaFilter: ['public', 'neon_auth'],
      dbCredentials: { url: process.env.DATABASE_URL! },
    } satisfies Config;
    ```

4.  **Pull schema dari Neon:**
    ```bash
    npx drizzle-kit pull
    ```
    Ini akan menghasilkan schema untuk tabel `neon_auth` (user, session, dll).

5.  **Buat application schema** (`src/db/schema.ts`):
    Tambahkan tabel-tabel berikut:
    - `Projects`: `id`, `title`, `description`, `imageUrl`, `githubUrl`, `liveUrl`, `technologiesUsed` (JSONB), `status`, `orderId`, `userId` (foreign key ke neon_auth.user)
    - `Orders`: `id`, `clientName`, `clientEmail`, `serviceType`, `description`, `status`, `orderDate`, `completionDate`, `userId`
    - `Technologies`: `id`, `name`, `iconUrl`
    - `AboutPage`: `id`, `content`, `userId`
    - `Testimonials`: `id`, `clientName`, `clientReview`, `clientAvatarUrl`, `userId`

6.  **Generate & apply migrations:**
    ```bash
    npx drizzle-kit generate
    npx drizzle-kit migrate
    ```

### 2.2 Setup Neon Auth di Frontend

1.  **Buat auth server instance** (`src/lib/auth/server.ts`):
    ```typescript
    import { createNeonAuth } from '@neondatabase/auth/next/server';
    export const auth = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    });
    ```

2.  **Buat auth client** (`src/lib/auth/client.ts`):
    ```typescript
    'use client';
    import { createAuthClient } from '@neondatabase/auth/next';
    export const authClient = createAuthClient();
    ```

3.  **Buat API route** (`src/app/api/auth/[...path]/route.ts`):
    ```typescript
    import { auth } from '@/lib/auth/server';
    export const { GET, POST } = auth.handler();
    ```

4.  **Update layout dengan Auth Provider** (`src/app/layout.tsx`):
    ```typescript
    import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth/react';
    import { authClient } from '@/lib/auth/client';
    ```

5.  **Buat auth pages:**
    - `src/app/auth/[path]/page.tsx` - Sign in/up
    - `src/app/account/[path]/page.tsx` - Account management

6.  **Buat middleware untuk protected routes** (`middleware.ts`):
    ```typescript
    import { auth } from '@/lib/auth/server';
    export default auth.middleware({ loginUrl: '/auth/sign-in' });
    export const config = { matcher: ['/admin/:path*'] };
    ```

---

## Tahap 3: Pengembangan Backend API (NestJS)

Note: Karena Neon Auth berjalan di frontend, backend bisa menggunakan API routes Next.js atau tetap menggunakan NestJS. Jika tetap NestJS:

### 3.1 Konfigurasi Koneksi Database (NestJS)

1.  **Install dependencies di backend:**
    ```bash
    cd backend
    npm install @neondatabase/serverless drizzle-orm
    npm install -D drizzle-kit
    ```

2.  **Buat database client** (`src/db/index.ts`):
    ```typescript
    import { neon } from '@neondatabase/serverless';
    import { drizzle } from 'drizzle-orm/neon-http';
    const sql = neon(process.env.DATABASE_URL!);
    export const db = drizzle(sql);
    ```

### 3.2 API Modules & Endpoints (NestJS)

- **Projects Module:**
    - `GET /projects` - Ambil semua proyek (public)
    - `GET /projects/:id` - Ambil proyek berdasarkan ID (public)
    - `POST /projects` - Tambah proyek (admin only)
    - `PUT /projects/:id` - Edit proyek (admin only)
    - `DELETE /projects/:id` - Hapus proyek (admin only)

- **Orders Module:**
    - `POST /orders` - Pengunjung pesan jasa (public)
    - `GET /orders` - Ambil semua pesanan (admin only)
    - `PUT /orders/:id/status` - Update status pesanan (admin only)

- **Technologies Module:**
    - `GET /technologies` - Ambil semua teknologi (public)
    - `POST /technologies` - Tambah teknologi (admin only)
    - `PUT /technologies/:id` - Edit teknologi (admin only)
    - `DELETE /technologies/:id` - Hapus teknologi (admin only)

- **AboutPage Module:**
    - `GET /about` - Ambil konten halaman tentang saya (public)
    - `PUT /about` - Edit konten (admin only)

- **Testimonials Module:**
    - `GET /testimonials` - Ambil semua testimoni (public)
    - `POST /testimonials` - Tambah testimoni (admin only)

### 3.3 Validasi Data & Error Handling

- Gunakan `class-validator` untuk validasi input
- Tangani error dengan respons yang informatif

---

## Tahap 4: Pengembangan Frontend (Next.js)

### 4.1 Struktur Proyek

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── about/page.tsx       # About page
│   ├── order/page.tsx       # Order form
│   ├── projects/[id]/page.tsx  # Project detail
│   ├── admin/               # Protected admin routes
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── technologies/
│   │   ├── orders/
│   │   └── about/
│   └── api/auth/             # Neon Auth API
├── components/               # UI components
├── lib/auth/                 # Auth setup
├── db/                       # Drizzle schema
└── actions.ts                # Server actions
```

### 4.2 Halaman Utama

1.  **Homepage (`/`):**
    - Hero Section dengan nama dan deskripsi
    - Stack teknologi (dari `/technologies`)
    - Completed projects (dari `/projects?status=completed`)
    - Testimonials (dari `/testimonials`)

2.  **Halaman Detail Proyek (`/projects/[id]`)**
3.  **Halaman Order Jasa (`/order`)**
4.  **Halaman Tentang Saya (`/about`)**

### 4.3 Halaman Admin (Protected)

- **Dashboard** (`/admin/dashboard`)
- **Kelola Proyek** (`/admin/projects`)
- **Kelola Teknologi** (`/admin/technologies`)
- **Daftar Pesanan** (`/admin/orders`)
- **Edit About** (`/admin/about`)

### 4.4 Server Actions

Gunakan Server Actions untuk operasi CRUD yang aman:
- `getProjects()`, `addProject()`, `updateProject()`, `deleteProject()`
- `getOrders()`, `updateOrderStatus()`
- `getTechnologies()`, `addTechnology()`, `updateTechnology()`, `deleteTechnology()`
- `getAbout()`, `updateAbout()`
- `getTestimonials()`, `addTestimonial()`

---

## Tahap 5: Deployment

1.  **Deploy Frontend (Next.js) ke Vercel:**
    - Konfigurasi environment variables:
      - `DATABASE_URL`
      - `NEON_AUTH_BASE_URL`
      - `NEON_AUTH_COOKIE_SECRET`
    - Tambahkan domain production ke **trusted domains** di Neon Auth settings

2.  **Deploy Backend (Opsional - Jika pakai NestJS):**
    - Jika backend terpisah, deploy ke Vercel dengan environment variables yang sama

---

## Tahap 6: Pengujian & Penyempurnaan

1.  **Pengujian Fungsional:**
    - Test semua fitur (CRUD projects, orders, technologies, dll)
    - Verify endpoint admin hanya bisa diakses user terautentikasi

2.  **Pengujian Responsivitas:**
    - Test tampilan di desktop, tablet, mobile

3.  **Pengujian Keamanan:**
    - Pastikan route admin dilindungi middleware
    - Validasi input untuk prevent SQL injection (Drizzle ORM sudah handle ini)

4.  **Optimisasi Kinerja:**
    - Optimasi gambar dan aset
    - Check performa load halaman

5.  **Dokumentasi:**
    - Cara menjalankan lokal
    - Cara deployment

---

## Environment Variables Summary

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `DATABASE_URL` | Neon pooled connection string | `postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/db?sslmode=require` |
| `NEON_AUTH_BASE_URL` | Auth base URL dari Neon Console | `https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth` |
| `NEON_AUTH_COOKIE_SECRET` | Secret untuk cookie (32+ chars) | `openssl rand -base64 32` |
