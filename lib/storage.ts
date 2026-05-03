import { AuthUser, CartItem } from "@/lib/types";

const AUTH_KEY = "atlas-crm-auth";
const CART_KEY = "atlas-crm-cart";
const TOKEN_KEY = "token";

function getSafeStorage(): Storage | null {
  try {
    if (typeof globalThis === "undefined" || !("localStorage" in globalThis)) {
      return null;
    }

    const candidate = globalThis.localStorage as Partial<Storage> | undefined;

    if (
      !candidate ||
      typeof candidate.getItem !== "function" ||
      typeof candidate.setItem !== "function" ||
      typeof candidate.removeItem !== "function"
    ) {
      return null;
    }

    return candidate as Storage;
  } catch {
    return null;
  }
}

export const storage = {
  getToken() {
    return getSafeStorage()?.getItem(TOKEN_KEY) ?? null;
  },
  setToken(token: string) {
    getSafeStorage()?.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    getSafeStorage()?.removeItem(TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    const raw = getSafeStorage()?.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
  setUser(user: AuthUser) {
    getSafeStorage()?.setItem(AUTH_KEY, JSON.stringify(user));
  },
  clearUser() {
    getSafeStorage()?.removeItem(AUTH_KEY);
  },
  getCart(): CartItem[] {
    const raw = getSafeStorage()?.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  },
  setCart(items: CartItem[]) {
    getSafeStorage()?.setItem(CART_KEY, JSON.stringify(items));
  },
  clearCart() {
    getSafeStorage()?.removeItem(CART_KEY);
  },
};
