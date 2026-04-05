"use client";

import { AuthView, NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { authClient } from "@/lib/auth/client";

export function AuthViewClient({ path }: { path: string }) {
  return (
    <NeonAuthUIProvider authClient={authClient as any}>
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-sm p-6">
        <AuthView path={path} />
      </div>
    </NeonAuthUIProvider>
  );
}