// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DisñoJobs - Trabajos para Diseñadores de Producto",
  description: "Plataforma de empleos para diseñadores de producto en español",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center px-2 text-xl font-bold text-gray-900">
                  DisñoJobs
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  href="/jobs"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 
                           hover:text-gray-900 hover:bg-gray-50"
                >
                  Ver Empleos
                </Link>
                <Link
                  href="/jobs/create"
                  className="ml-4 px-4 py-2 border border-transparent rounded-md 
                           text-sm font-medium text-white bg-blue-600 
                           hover:bg-blue-700"
                >
                  Publicar Empleo
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
