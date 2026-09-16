import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";

export default async function NovoProduto() {
  const supabase = createClient();
  const { data: categorias } = await supabase.from("categories").select("id, name").order("sort_order");

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Novo produto</h1>
      <ProductForm categorias={categorias ?? []} />
    </main>
  );
}
