"use client";

import { getAssetUrl, getProductImageUrl } from "@/lib/api";
import { useEffect, useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
  fallback?: string;
  className?: string;
  category: string;
};

export function ProductImage({
  src,
  alt,
  fallback = "/placeholder-product.svg",
  className = "product-image",
  category,
}: ProductImageProps) {
  const fallbackSrc = getAssetUrl(fallback);
  const [imageSrc, setImageSrc] = useState(fallbackSrc);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadImage = async () => {
      if (!src) {
        setImageSrc(fallbackSrc);
        return;
      }

      try {
        const response = await fetch(getProductImageUrl(src) ?? "", {
          headers: {
            "api-key": process.env.NEXT_PUBLIC_SERVER_API_KEY ?? "",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar imagem protegida");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (error) {
        console.error("Erro ao carregar imagem protegida", error);
        setImageSrc(fallbackSrc);
      }
    };

    void loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fallbackSrc, src]);

  if (imageSrc === fallbackSrc) {
    return (
      <div className={`${className} fallback-image`} aria-label={`Imagem padrao de ${alt}`}>
        <span>{category}</span>
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
}
