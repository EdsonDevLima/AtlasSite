import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Atlas CRM Site",
  description: "Site em Next.js para operacao comercial do CRM Atlas",
  icons: {
    icon: "/logoo.png",
    shortcut: "/logoo.png",
    apple: "/logoo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
