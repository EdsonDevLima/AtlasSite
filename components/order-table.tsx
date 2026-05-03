import { Order } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="panel table-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Pedidos</p>
          <h2>Historico de compras</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Total</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user?.name ?? "Cliente"}</td>
                <td>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </td>
                <td>{formatCurrency(order.total)}</td>
                <td>{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
