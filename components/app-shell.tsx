"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";

const links = [
  { href: "/", label: "Ofertas" },
  { href: "/produtos", label: "Produtos" },
  { href: "/carrinho", label: "Carrinho" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

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
              >
                {link.label}
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
