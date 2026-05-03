import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProductCard } from "@/components/product-card";
import { fetchProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function Home() {
  const products = await fetchProducts();
  const featured = products.slice(0, 8);
  const categories = Array.from(new Set(products.map((item) => item.category))).slice(0, 6);
  const lowestPrice = products.length
    ? Math.min(...products.map((product) => Number(product.price)))
    : 0;

  return (
    <AppShell>
      <section className="market-hero">
        <div className="market-hero-copy">
          <p className="eyebrow">Loja online</p>
          <h1>Compre produtos, mercadorias e ofertas com entrega facil.</h1>
          <p>
            Explore a vitrine, compare precos e adicione ao carrinho os produtos
            disponiveis no estoque.
          </p>

          <div className="hero-actions">
            <Link href="/produtos" className="cta-link">
              Explorar produtos
            </Link>
            <Link href="/carrinho" className="cta-link secondary-link">
              Ver carrinho
            </Link>
          </div>
        </div>

        <div className="hero-showcase">
          <article className="hero-stat">
            <span>Produtos ativos</span>
            <strong>{products.length}</strong>
          </article>
          <article className="hero-stat">
            <span>Preco inicial</span>
            <strong>{formatCurrency(lowestPrice)}</strong>
          </article>
          <article className="hero-stat">
            <span>Tipo de loja</span>
            <strong>Mercadorias</strong>
          </article>
        </div>
      </section>

      <section className="market-strip">
        {categories.map((category) => (
          <Link key={category} href={`/produtos?categoria=${encodeURIComponent(category)}`} className="chip-link">
            {category}
          </Link>
        ))}
      </section>

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
