import { createClient } from "@/lib/supabase/server";
import ProductToggle from "./ProductToggle";

const CHARGE_LABELS: Record<string, string> = {
  fixed: "valor fixo",
  per_unit: "por unidade",
  per_quantity: "por quantidade",
  per_day: "por diária",
};

export default async function AdminProdutos() {
  const supabase = createClient();

  const { data: categorias } = await supabase
    .from("categories")
    .select("id, name, products(*)")
    .order("sort_order");

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-700">Produtos</h1>
        <a href="/admin/produtos/novo" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white">+ Novo produto</a>
      </div>

      {categorias?.map((categoria: any) => (
        <div key={categoria.id} className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-700">{categoria.name}</h2>
          <div className="space-y-2">
            {categoria.products.length === 0 && <p className="text-sm text-gray-400">Nenhum produto nesta categoria.</p>}
            {categoria.products.map((produto: any) => (
              <div key={produto.id} className={`flex items-center justify-between rounded-lg border p-3 ${produto.is_active ? "" : "opacity-50"}`}>
                <div>
                  <p className="font-medium">{produto.name}</p>
                  <p className="text-sm text-gray-500">
                    R$ {Number(produto.price).toFixed(2)} ({CHARGE_LABELS[produto.charge_type] ?? produto.charge_type})
                    {produto.stock_quantity != null && ` · estoque: ${produto.stock_quantity}`}
                    {produto.is_area && " · área exclusiva"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/admin/produtos/${produto.id}`} className="text-sm text-brand-700 underline">Editar</a>
                  <ProductToggle id={produto.id} isActive={produto.is_active} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
