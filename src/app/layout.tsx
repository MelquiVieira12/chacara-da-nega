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
        <nav className="flex items-center justify-between border-b px-4 py-3 text-sm font-medium text-gray-600">
          <div className="flex gap-6">
            <a href="/" className="hover:text-brand-700">Início</a>
            <a href="/servicos" className="hover:text-brand-700">Serviços</a>
            <a href="/galeria" className="hover:text-brand-700">Galeria</a>
            <a href="/regras" className="hover:text-brand-700">Regras</a>
          </div>
          <a href="/admin/login" className="rounded-full bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Painel administrativo</a>
        </nav>
                      {children}
      </body>
    </html>
  );
}
