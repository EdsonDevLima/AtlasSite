"use client";

import { storage } from "@/lib/storage";
import { CartItem, Product } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(storage.getCart());
  }, []);

  function persist(nextItems: CartItem[]) {
    setItems(nextItems);
    storage.setCart(nextItems);
  }

  function addItem(product: Product) {
    const exists = items.find((item) => item.id === product.id);
    if (exists) {
      persist(
        items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
      return;
    }

    persist([...items, { ...product, quantity: 1 }]);
  }

  function removeItem(productId: number) {
    persist(items.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    persist(
      items.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function clearCart() {
    persist([]);
  }

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      ),
    [items],
  );

  return { items, total, addItem, removeItem, updateQuantity, clearCart };
}
