"use client";

import type { CartItem, Product } from "@/lib/types";
import { ProductImage } from "@/components/product-image";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  onAdd?: (product: Product) => void;
  showButton?: boolean;
  items?:CartItem[]
};

export function ProductCard({
  product,
  onAdd,
  items,
  showButton = true,
}: ProductCardProps) {

  let itemSelected = items?.filter(p => product.name == p.name)




  return (
    <article className="panel product-card">
      <ProductImage
        src={product.image ? `products/image/${product.image}` : undefined}
        alt={product.name}
        category={product.category}
      />

      <div className="product-top">
        <span className="tag">{product.category}</span>
        <span className={product.amount > 0 ? "stock ok" : "stock off"}>
          {product.amount > 0 ? `${product.amount} disponiveis` : "Sem estoque"}
        </span>
      </div>

      <h3>{product.name}</h3>
      <p>{product.description}</p>

      <div className="product-footer">
        <strong>{formatCurrency(product.price)}</strong>
        {showButton && onAdd && itemSelected?.length == 0 ? (
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={product.amount <= 0}
          >
            Comprar
          </button>
        ) : (
          <button
            type="button"
            disabled={product.amount <= 0}
          >
            Item adicionado
          </button>
        )}
      </div>
    </article>
  );
}
