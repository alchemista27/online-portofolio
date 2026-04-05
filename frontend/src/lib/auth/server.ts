import { createNeonAuth } from '@neondatabase/auth/next/server';

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const auth = createNeonAuth({
  baseUrl: getEnv('NEON_AUTH_BASE_URL'),
  cookies: {
    secret: getEnv('NEON_AUTH_COOKIE_SECRET'),
  },
});
