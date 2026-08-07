"use client";

import { useState, useEffect } from "react";

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export function useAuthSession() {
  const [session, setSession] = useState<{ authenticated: boolean; user?: AuthUser } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (active) {
            setSession(data);
          }
        } else {
          if (active) {
            setSession({ authenticated: false });
          }
        }
      } catch (err) {
        if (active) {
          setSession({ authenticated: false });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    loadSession();
    return () => {
      active = false;
    };
  }, []);

  return {
    isAuthenticated: !!session?.authenticated,
    user: session?.user,
    isLoading,
  };
}
