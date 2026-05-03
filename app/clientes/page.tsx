"use client";

import { AppShell } from "@/components/app-shell";
import { fetchCustomers } from "@/lib/api";
import { Customer } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    void fetchCustomers().then(setCustomers);
  }, []);

  return (
    <AppShell>
      <section className="panel table-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Relacionamento</p>
            <h2>Base de clientes</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.role ?? "customer"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
