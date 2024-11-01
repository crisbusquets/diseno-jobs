import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DisñoJobs - Trabajos para Diseñadores de Producto",
  description: "Plataforma de empleos para diseñadores de producto en español",
  keywords: ["diseño", "producto", "empleos", "trabajo"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
