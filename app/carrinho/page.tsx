"use client";

import { AppShell } from "@/components/app-shell";
import { useCart } from "@/hooks/use-cart";
import { createOrder, registerCustomer, syncProductStock } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

type Tab = "cart" | "orders";
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Aguardando",
  processing: "Em preparo",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

interface Order {
  id: string;
  trackingCode: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items?: { name: string; quantity: number; price: number }[];
}

export default function CarrinhoPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>("cart");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Order lookup
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);

  async function finishOrder() {
    if (items.length === 0) return;
    setLoading(true);
    setMessage("");

    try {
      if (!name || !email || !street || !number || !city || !stateField || !zipCode) {
        throw new Error("Preencha todos os campos para concluir a compra.");
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
        addresses: [{ street, number, city, state: stateField, zipCode }],
      });

      await createOrder({
        userId: customer.userId,
        productIds: items.flatMap((item) => Array(item.quantity).fill(item.id)),
        total,
        trackingCode: `ATL-${Date.now().toString().slice(-6)}`,
      });

      await syncProductStock(
        items.map((item) => ({ product: item, quantity: item.quantity }))
      );

      clearCart();
      setName(""); setEmail(""); setStreet(""); setNumber("");
      setCity(""); setStateField(""); setZipCode("");
      setMessage("✓ Pedido criado com sucesso! Guarde seu e-mail para acompanhar.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao criar pedido.");
    } finally {
      setLoading(false);
    }
  }

  async function lookupOrders() {
    if (!lookupEmail) return;
    setLookupLoading(true);
    setLookupError("");
    setOrders(null);

    try {
      // Replace with your real API call, e.g.: const res = await getOrdersByEmail(lookupEmail)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/user/order?email=${encodeURIComponent(lookupEmail)}`,{headers:{"api-key":process.env.NEXT_PUBLIC_SERVER_API_KEY || "","content-type":"json/application"}});
      
      if (!res.ok) throw new Error("Nenhum pedido encontrado para este e-mail.");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "Erro ao buscar pedidos.");
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <AppShell>
      <style>{`
        .cart-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid var(--border, #e5e7eb);
          margin-bottom: 1.5rem;
        }
        .cart-tab-btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          color: var(--text-muted, #6b7280);
          transition: color 0.15s, border-color 0.15s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cart-tab-btn.active {
          color: var(--primary, #111);
          border-bottom-color: var(--primary, #111);
        }
        .cart-tab-btn .badge {
          background: var(--primary, #111);
          color: #fff;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.1em 0.5em;
          line-height: 1.4;
        }

        /* Guest notice */
        .guest-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: #0369a1;
        }
        .guest-notice .icon { font-size: 1.25rem; flex-shrink: 0; margin-top: 0.05rem; }
        .guest-notice strong { display: block; margin-bottom: 0.2rem; color: #0c4a6e; }

        /* Customer form */
        .customer-form {
          background: var(--surface, #f9fafb);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-top: 1.5rem;
        }
        .customer-form h3 {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted, #6b7280);
          margin: 0 0 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .form-grid .full { grid-column: 1 / -1; }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .form-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted, #6b7280);
        }
        .form-field input {
          padding: 0.55rem 0.75rem;
          border: 1px solid var(--border, #d1d5db);
          border-radius: 8px;
          font-size: 0.9rem;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
        }
        .form-field input:focus { border-color: var(--primary, #111); }

        /* Order lookup */
        .lookup-box {
          background: var(--surface, #f9fafb);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .lookup-box h3 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 0.35rem;
        }
        .lookup-box p {
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
          margin: 0 0 1rem;
        }
        .lookup-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .lookup-row input {
          flex: 1;
          padding: 0.6rem 0.9rem;
          border: 1px solid var(--border, #d1d5db);
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .lookup-row input:focus { border-color: var(--primary, #111); }
        .lookup-row button {
          white-space: nowrap;
        }

        /* Orders list */
        .orders-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted, #6b7280);
        }
        .orders-empty .icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .order-card {
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 0.75rem;
          background: #fff;
        }
        .order-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .order-code {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .order-status {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.25em 0.75em;
          border-radius: 99px;
          letter-spacing: 0.03em;
        }
        .order-meta {
          font-size: 0.83rem;
          color: var(--text-muted, #6b7280);
          display: flex;
          gap: 1rem;
        }
        .order-total { font-weight: 700; color: var(--primary, #111); }
        .error-msg {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        .success-msg {
          color: #059669;
          font-size: 0.875rem;
          margin-top: 0.75rem;
        }

        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-grid .full { grid-column: 1; }
          .lookup-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <section className="section-head">
        <div>
          <p className="eyebrow">Loja</p>
          <h2>Carrinho de compras</h2>
        </div>
      </section>

      <section className="panel">
        {/* Tabs */}
        <div className="cart-tabs">
          <button
            className={`cart-tab-btn${activeTab === "cart" ? " active" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
            🛒 Meu carrinho
            {items.length > 0 && <span className="badge">{items.length}</span>}
          </button>
          <button
            className={`cart-tab-btn${activeTab === "orders" ? " active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 Meus pedidos
          </button>
        </div>

        {/* ── TAB: CART ── */}
        {activeTab === "cart" && (
          <>
            <div className="guest-notice">
              <span className="icon">ℹ️</span>
              <div>
                <strong>Compra como convidado</strong>
                Preencha seus dados abaixo para finalizar. Não é necessário criar uma conta —
                use o e-mail informado para consultar seus pedidos depois.
              </div>
            </div>

            {items.length === 0 ? (
              <div className="orders-empty">
                <div className="icon">🛍️</div>
                <p>Seu carrinho está vazio.<br />Adicione produtos na listagem para começar.</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div className="cart-row" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.category} • {item.amount} em estoque
                      </p>
                    </div>
                    <div className="cart-actions">
                      <input
                        type="number"
                        min={1}
                        max={item.amount}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                      />
                      <span>{formatCurrency(Number(item.price) * item.quantity)}</span>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => removeItem(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

                {/* Customer form */}
                <div className="customer-form">
                  <h3>Seus dados para entrega</h3>
                  <div className="form-grid">
                    <div className="form-field full">
                      <label>Nome completo</label>
                      <input
                        placeholder="Maria Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-field full">
                      <label>E-mail</label>
                      <input
                        type="email"
                        placeholder="maria@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-field full">
                      <label>Rua / Avenida</label>
                      <input
                        placeholder="Rua das Flores"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Número</label>
                      <input
                        placeholder="123"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>CEP</label>
                      <input
                        placeholder="00000-000"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Cidade</label>
                      <input
                        placeholder="São Paulo"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Estado (UF)</label>
                      <input
                        placeholder="SP"
                        maxLength={2}
                        value={stateField}
                        onChange={(e) => setStateField(e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-bar" style={{ marginTop: "1.25rem" }}>
                  <strong>Total: {formatCurrency(total)}</strong>
                  <button
                    type="button"
                    onClick={finishOrder}
                    disabled={!items.length || loading}
                  >
                    {loading ? "Enviando..." : "Finalizar pedido"}
                  </button>
                </div>

                {message && (
                  <p className={message.startsWith("✓") ? "success-msg" : "error-msg"}>
                    {message}
                  </p>
                )}
              </>
            )}
          </>
        )}

        {/* ── TAB: ORDERS ── */}
        {activeTab === "orders" && (
          <>
            <div className="lookup-box">
              <h3>Consultar pedidos</h3>
              <p>
                Informe o e-mail usado na compra para ver seus pedidos e acompanhar o status
                de entrega.
              </p>
              <div className="lookup-row">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && lookupOrders()}
                />
                <button type="button" onClick={lookupOrders} disabled={!lookupEmail || lookupLoading}>
                  {lookupLoading ? "Buscando..." : "Buscar pedidos"}
                </button>
              </div>
              {lookupError && <p className="error-msg">{lookupError}</p>}
            </div>

            {orders === null && !lookupError && (
              <div className="orders-empty">
                <div className="icon">📬</div>
                <p>Digite seu e-mail acima para ver seus pedidos.</p>
              </div>
            )}

            {orders !== null && orders.length === 0 && (
              <div className="orders-empty">
                <div className="icon">🤷</div>
                <p>Nenhum pedido encontrado para este e-mail.</p>
              </div>
            )}

            {orders && orders.length > 0 && (
              <>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted, #6b7280)", marginBottom: "1rem" }}>
                  {orders.length} pedido{orders.length > 1 ? "s" : ""} encontrado
                  {orders.length > 1 ? "s" : ""} para <strong>{lookupEmail}</strong>
                </p>
                {orders.map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <span className="order-code">#{order.trackingCode}</span>
                      <span
                        className="order-status"
                        style={{
                          background: STATUS_COLOR[order.status] + "22",
                          color: STATUS_COLOR[order.status],
                        }}
                      >
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>
                    <div className="order-meta">
                      <span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
                      <span className="order-total">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </section>
    </AppShell>
  );
}