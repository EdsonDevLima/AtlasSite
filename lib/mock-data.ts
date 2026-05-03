import type { Customer, Order, Product } from "@/lib/types";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Fone Bluetooth Redmi AirDots 2 Preto",
    description: "Fone sem fio com estojo e bluetooth 5.0 para uso diario.",
    category: "Eletronicos",
    price: "296.00",
    amount: 18,
    status: "active",
    isPromotion: true,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Tablet Samsung Tab A9 64GB 4GB RAM",
    description: "Tablet com tela ampla para estudo, video e navegacao.",
    category: "Tablets",
    price: "991.00",
    amount: 9,
    status: "active",
    image: "https://images.unsplash.com/photo-1589739900243-4b52cd9d1047?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Luminaria Cristal de Mesa Saturno Lua",
    description: "Luminaria decorativa em cristal com base de madeira.",
    category: "Casa",
    price: "20.00",
    amount: 31,
    status: "active",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Notebook VAIO FE 16 AMD Ryzen 7",
    description: "Notebook de alta performance para produtividade e estudo.",
    category: "Informatica",
    price: "3000.00",
    amount: 4,
    status: "active",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Impressora Epson EcoTank Multifuncional",
    description: "Impressora com tanque de tinta para casa e escritorio.",
    category: "Escritorio",
    price: "1249.00",
    amount: 7,
    status: "active",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Monitor Gamer 27 Polegadas Full HD",
    description: "Monitor com painel amplo e imagem nitida para jogos e trabalho.",
    category: "Monitores",
    price: "1399.00",
    amount: 6,
    status: "active",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
  },
];

export const mockCustomers: Customer[] = [
  { id: 1, name: "Marina Costa", email: "marina@empresa.com", role: "customer" },
  { id: 2, name: "Carlos Nunes", email: "carlos@empresa.com", role: "customer" },
];

export const mockOrders: Order[] = [
  {
    id: 101,
    created_at: "2026-05-02T10:30:00.000Z",
    total: "1287.00",
    status: "pending",
    trackingCode: "ATL-9021",
    user: mockCustomers[0],
    products: [mockProducts[0], mockProducts[1]],
  },
];
