import { createClient } from "@/lib/supabase/server";

const CHARGE_LABELS: Record<string, string> = {
  fixed: "valor fixo",
  per_unit: "por unidade",
  per_quantity: "por quantidade",
  per_day: "por diária",
};

export default async function Servicos() {
  const supabase = createClient();

  const { data: categorias } = await supabase
    .from("categories")
    .select("id, name, products(*)")
    .eq("is_active", true)
    .order("sort_order");

  const temDados = categorias && categorias.length > 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Serviços e produtos</h1>

      {!temDados && (
        <p className="text-gray-500">
          Nenhum produto cadastrado ainda. (Cadastre categorias e produtos no painel administrativo.)
        </p>
      )}

      {categorias
  ?.filter((categoria: any) => categoria.products?.some((p: any) => p.is_active))
  .map((categoria: any) => (
        <div key={categoria.id} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">{categoria.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {categoria.products
              ?.filter((p: any) => p.is_active)
              .map((produto: any) => (
                <div key={produto.id} className="rounded-xl border p-4">
                  <p className="font-medium">{produto.name}</p>
                  {produto.description && (
                    <p className="text-sm text-gray-500">{produto.description}</p>
                  )}
                  <p className="mt-2 text-brand-700">
                    R$ {Number(produto.price).toFixed(2)}{" "}
                    <span className="text-xs text-gray-400">
                      ({CHARGE_LABELS[produto.charge_type] ?? produto.charge_type})
                    </span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </main>
  );
}
