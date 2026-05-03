"use client";

import { AppShell } from "@/components/app-shell";
import { OrderTable } from "@/components/order-table";
import { fetchOrders } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    void fetchOrders().then(setOrders);
  }, []);

  return (
    <AppShell>
      <OrderTable orders={orders} />
    </AppShell>
  );
}
