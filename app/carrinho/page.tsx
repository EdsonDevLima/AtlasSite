"use client";

import { AppShell } from "@/components/app-shell";
import { useCart } from "@/hooks/use-cart";
import { createOrder, registerCustomer, syncProductStock } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export default function CarrinhoPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  async function finishOrder() {
    if (items.length === 0) return;
    setLoading(true);
    setMessage("");

    try {
      if (!name || !email || !street || !number || !city || !state || !zipCode) {
        throw new Error("Preencha os dados do cliente para concluir a compra.");
      }

      const insufficient = items.find((item) => item.quantity > item.amount);
      if (insufficient) {
        throw new Error(`Estoque insuficiente para ${insufficient.name}.`);
      }

      const customer = await registerCustomer({
        name,
        email,
        password: `atlas-${email}`,
        confirmPassword: `atlas-${email}`,
        addresses: [{ street, number, city, state, zipCode }],
      });

      await createOrder({
        userId: customer.userId,
        productIds: items.flatMap((item) => Array(item.quantity).fill(item.id)),
        total,
        trackingCode: `ATL-${Date.now().toString().slice(-6)}`,
      });

      await syncProductStock(
        items.map((item) => ({
          product: item,
          quantity: item.quantity,
        })),
      );

      clearCart();
      setName("");
      setEmail("");
      setStreet("");
      setNumber("");
      setCity("");
      setState("");
      setZipCode("");
      setMessage("Pedido criado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao criar pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="section-head">
        <div>
          <p className="eyebrow">Carrinho</p>
          <h2>Revise seus produtos e finalize a compra</h2>
        </div>
      </section>
      <section className="panel cart-panel">
        {items.length === 0 ? (
          <p>Nenhum item no carrinho ainda. Adicione produtos na listagem.</p>
        ) : (
          items.map((item) => (
            <div className="cart-row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.category} • Estoque disponivel: {item.amount}
                </p>
              </div>
              <div className="cart-actions">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                />
                <span>{formatCurrency(Number(item.price) * item.quantity)}</span>
                <button type="button" className="secondary-button" onClick={() => removeItem(item.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))
        )}

        <div className="checkout-bar">
          <strong>Total: {formatCurrency(total)}</strong>
          <button type="button" onClick={finishOrder} disabled={!items.length || loading}>
            {loading ? "Enviando..." : "Finalizar pedido"}
          </button>
        </div>

        {message ? <p className="helper-text">{message}</p> : null}
      </section>
    </AppShell>
  );
}
