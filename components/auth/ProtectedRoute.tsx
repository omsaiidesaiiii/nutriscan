"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push(`/login?next=${pathname}`);
    }
  }, [user, loading, router, pathname, mounted]);

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent shadow-emerald-200 shadow-lg" />
          <p className="text-sm font-medium text-zinc-500 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Always return the fragment tree without conditional branching that returns null
  // We rely on the router push to actually migrate user off the page if invalid.
  // Next.js client router requires layout hooks to be mounted consistently.
  return <>{children}</>;
}
