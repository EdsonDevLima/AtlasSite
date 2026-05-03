"use client";

import { AppShell } from "@/components/app-shell";
import { OrderTable } from "@/components/order-table";
import { StatCard } from "@/components/stat-card";
import { fetchOrders, fetchProducts } from "@/lib/api";
import { Product, Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      const [nextProducts, nextOrders] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
      ]);
      setProducts(nextProducts);
      setOrders(nextOrders);
    }

    void load();
  }, []);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <AppShell>
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Resumo da loja</p>
          <h2>E-commerce conectado na API do CRM</h2>
          <p>
            Acompanhe pedidos, faturamento e estoque usando o mesmo backend do
            Atlas CRM.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Faturamento"
          value={formatCurrency(totalSales)}
          detail="Soma dos pedidos ja registrados"
        />
        <StatCard
          label="Pedidos"
          value={String(orders.length)}
          detail="Pedidos acompanhados pela equipe"
        />
        <StatCard
          label="Produtos"
          value={String(products.length)}
          detail="Itens disponiveis para venda"
        />
      </section>

      <OrderTable orders={orders.slice(0, 5)} />
    </AppShell>
  );
}
