import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProductCard } from "@/components/product-card";
import { fetchProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import SliderCompany from "@/components/slide-company";

export default async function Home() {
  const products = await fetchProducts();
  const featured = products.slice(0, 8);
  const categories = Array.from(new Set(products.map((item) => item.category))).slice(0, 6);
  const lowestPrice = products.length
    ? Math.min(...products.map((product) => Number(product.price)))
    : 0;

  return (
    <AppShell>
      <section className="section-head "><SliderCompany/></section>
      <section className="section-head">
        <div>
          <p className="eyebrow">Mais procurados</p>
          <h2>Produtos em destaque</h2>
        </div>
        <Link href="/produtos" className="inline-link">
          Ver todo o catalogo
        </Link>
      </section>

      <section className="market-grid">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} showButton={false} />
        ))}
      </section>
    </AppShell>
  );
}
