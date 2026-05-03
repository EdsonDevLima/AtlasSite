"use client";

import { AppShell } from "@/components/app-shell";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/hooks/use-cart";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const { addItem } = useCart();

  useEffect(() => {
    void fetchProducts().then(setProducts);
  }, []);

  const categories = useMemo(
    () => ["todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory = category === "todos" || product.category === category;
        return matchesQuery && matchesCategory;
      }),
    [products, query, category],
  );

  return (
    <AppShell>
      <section className="catalog-header">
        <div>
          <p className="eyebrow">Catalogo completo</p>
          <h1>Todos os produtos da loja</h1>
          <p>Filtre por categoria, pesquise por nome e compre mercadorias do estoque.</p>
        </div>

        <div className="catalog-tools">
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, categoria ou descricao"
          />

          <select
            className="select-input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "todos" ? "Todas as categorias" : item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="market-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={addItem} />
        ))}
      </section>
    </AppShell>
  );
}
