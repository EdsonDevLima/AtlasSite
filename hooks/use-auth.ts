"use client";

import { login as loginRequest } from "@/lib/api";
import { storage } from "@/lib/storage";
import { AuthUser } from "@/lib/types";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(storage.getUser());
    setReady(true);
  }, []);

  async function signIn(email: string, password: string) {
    const result = await loginRequest(email, password);
    storage.setToken(result.token);
    storage.setUser(result.user);
    setUser(result.user);
    return result;
  }
  async function register(pemail: string, password: string) {
    
  }
  function logout() {
    storage.clearToken();
    storage.clearUser();
    storage.clearCart();
    setUser(null);
  }

  return {
    user,
    ready,
    isAuthenticated: !!user,
    signIn,
    logout,
  };
}
