export default function AdminNav() {
  const links = [
    { href: "/admin", label: "Início" },
    { href: "/admin/reservas", label: "Reservas" },
    { href: "/admin/bloqueios", label: "Bloqueio de datas" },
    { href: "/admin/categorias", label: "Categorias" },
    { href: "/admin/produtos", label: "Produtos" },
    { href: "/admin/galeria", label: "Galeria" },
    { href: "/admin/regras", label: "Regras" },
    { href: "/admin/configuracoes", label: "Configurações" },
  ];

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b pb-4">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="rounded-full border px-3 py-1 text-sm text-gray-600 hover:border-brand-600 hover:text-brand-700">
          {link.label}
        </a>
      ))}
    </nav>
  );
}
