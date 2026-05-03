import { mockCustomers, mockOrders, mockProducts } from "@/lib/mock-data";
import {
  AuthUser,
  Customer,
  Order,
  Product,
  RegisterCustomerPayload,
} from "@/lib/types";
import { storage } from "@/lib/storage";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const apiKey = process.env.NEXT_PUBLIC_SERVER_API_KEY ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (apiKey) headers.set("api-key", apiKey);

  const token = typeof window !== "undefined" ? storage.getToken() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${baseURL}/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Falha na requisicao");
  }

  return (await response.json()) as T;
}

async function requestForm<T>(path: string, formData: FormData): Promise<T> {
  const headers = new Headers();
  if (apiKey) headers.set("api-key", apiKey);

  const token = typeof window !== "undefined" ? storage.getToken() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${baseURL}/${path}`, {
    method: "PUT",
    body: formData,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Falha na requisicao");
  }

  return (await response.json()) as T;
}

function parseJwt(token: string): Partial<AuthUser> & { sub?: number; role?: string } {
  try {
    const base64 = token.split(".")[1];
    const json = JSON.parse(atob(base64));
    return json;
  } catch {
    return {};
  }
}

export async function login(email: string, password: string) {
  try {
    const result = await request<{ token: string }>("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const payload = parseJwt(result.token);
    const user: AuthUser = {
      id: payload.sub ?? 1,
      name: email.split("@")[0],
      email,
      role: payload.role,
    };

    return { token: result.token, user, mode: "api" as const };
  } catch {
    if (email && password) {
      return {
        token: "demo-token",
        user: { id: 1, name: "Demo Atlas", email, role: "admin" },
        mode: "demo" as const,
      };
    }
    throw new Error("Nao foi possivel autenticar");
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const result = await request<{ items: Product[] }>("products/all");
    return result.items ?? [];
  } catch {
    return mockProducts;
  }
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    return await request<Order[]>("sales/all");
  } catch {
    return mockOrders;
  }
}

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const result = await request<{ items: Customer[] }>("user/customers");
    return result.items ?? [];
  } catch {
    return mockCustomers;
  }
}

export async function registerCustomer(payload: RegisterCustomerPayload) {
  return await request<{ message: string; userId: number; existing: boolean }>("user/create", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      role: "customer",
    }),
  });
}

export async function createOrder(payload: {
  userId: number;
  productIds: number[];
  total: number;
  status?: string;
  trackingCode?: string;
}) {
  try {
    return await request<Order>("sales/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      id: Date.now(),
      created_at: new Date().toISOString(),
      total: payload.total,
      status: "pending",
      trackingCode: payload.trackingCode ?? "DEMO",
      user: mockCustomers[0],
      products: mockProducts.filter((item) => payload.productIds.includes(item.id)),
    } satisfies Order;
  }
}

export async function syncProductStock(orderItems: Array<{ product: Product; quantity: number }>) {
  const requests = orderItems.map(async ({ product, quantity }) => {
    const formData = new FormData();
    formData.append("id", String(product.id));
    formData.append("name", product.name);
    formData.append("price", String(product.price));
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("status", product.status);
    formData.append("amount", String(product.amount - quantity));
    formData.append("isPromotion", String(Boolean(product.isPromotion)));

    return requestForm<{ sucess: boolean; message: string }>("products/update", formData);
  });

  return Promise.all(requests);
}

export function getProductImageUrl(image?: string | null) {
  if (!image) return null;
  return `${baseURL}/products/image/${image}`;
}

export function getAssetUrl(path: string) {
  return path;
}
