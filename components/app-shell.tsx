"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";

const links = [
  { href: "/", label: "Ofertas" },
  { href: "/produtos", label: "Produtos" },
  { href: "/carrinho", label: "Carrinho" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { items } = useCart();

  return (
    <div className="market-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand-mark">
            <Image
              src="/logo.png"
              alt="Atlas Mercado"
              width={44}
              height={44}
              className="brand-logo"
              priority
            />
            <div>
              <strong>Atlas Mercado</strong>
              <span>Compre mercadorias online</span>
            </div>
          </Link>

          <nav className="topnav">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : ""}
                style={{position:"relative"}}
              >
                {link.label}
                {link.label == "Carrinho" && items.length > 0 && <span style={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  position:"absolute",
                  top:"1px"

                }} >{items.length}</span>}
              </Link>
            ))}
          </nav>

          <div className="topbar-note">Ofertas do dia • Estoque disponivel • Compra segura</div>
        </div>
      </header>

      <main className="market-main">{children}</main>
    </div>
  );
}
