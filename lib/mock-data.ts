import { Customer, Order, Product } from "@/lib/types";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Fone Bluetooth Redmi AirDots 2 Preto",
    description: "Fone sem fio com estojo, bluetooth 5.0 e som limpo para uso diario.",
    category: "Eletronicos",
    price: "249.90",
    amount: 18,
    status: "active",
    isPromotion: true,
  },
  {
    id: 2,
    name: "Tablet Samsung Tab A9 64GB",
    description: "Tablet com tela grande para estudo, video e navegacao.",
    category: "Tablets",
    price: "991.00",
    amount: 50,
    status: "active",
  },
  {
    id: 3,
    name: "Luminaria Cristal Lua Saturno LED",
    description: "Luminaria decorativa com base de madeira para quarto e sala.",
    category: "Casa",
    price: "20.00",
    amount: 12,
    status: "active",
  },
  {
    id: 4,
    name: "Notebook VAIO FE16 Ryzen 7",
    description: "Notebook com tela grande, desempenho rapido e visual elegante.",
    category: "Informatica",
    price: "3000.00",
    amount: 12,
    status: "active",
  },
];

export const mockCustomers: Customer[] = [
  { id: 1, name: "Marina Costa", email: "marina@empresa.com", role: "customer" },
  { id: 2, name: "Carlos Nunes", email: "carlos@empresa.com", role: "customer" },
  { id: 3, name: "Equipe Atlas", email: "atlas@crm.com", role: "admin" },
];

export const mockOrders: Order[] = [
  {
    id: 101,
    created_at: "2026-05-02T10:30:00.000Z",
    total: "379.80",
    status: "pending",
    trackingCode: "ATL-9021",
    user: mockCustomers[0],
    products: [mockProducts[0], mockProducts[1]],
  },
  {
    id: 102,
    created_at: "2026-05-01T14:00:00.000Z",
    total: "899.00",
    status: "completed",
    trackingCode: "ATL-8840",
    user: mockCustomers[1],
    products: [mockProducts[2]],
  },
];
