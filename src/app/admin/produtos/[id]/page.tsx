import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";

export default async function EditarProduto({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: produto } = await supabase.from("products").select("*").eq("id", params.id).single();
  const { data: categorias } = await supabase.from("categories").select("id, name").order("sort_order");

  if (!produto) notFound();

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Editar produto</h1>
      <ProductForm categorias={categorias ?? []} produto={produto} />
    </main>
  );
}
