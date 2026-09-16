import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chácara da Nega",
  description: "Seu momento especial começa aqui.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Chácara da Nega" },
};

export const viewport = {
  themeColor: "#2f9e5c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900 antialiased">
        <nav className="flex items-center justify-center gap-6 border-b px-4 py-3 text-sm font-medium text-gray-600">
          <a href="/" className="hover:text-brand-700">Início</a>
          <a href="/servicos" className="hover:text-brand-700">Serviços</a>
          <a href="/galeria" className="hover:text-brand-700">Galeria</a>
          <a href="/regras" className="hover:text-brand-700">Regras</a>
        </nav>
              {children}
        <footer className="mt-10 border-t px-4 py-6 text-center text-xs text-gray-400">
          <a href="/admin/login" className="hover:text-gray-600">Área administrativa</a>
        </footer>
      </body>
    </html>
  );
}
