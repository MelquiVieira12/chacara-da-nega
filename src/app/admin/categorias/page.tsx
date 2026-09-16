import { createClient } from "@/lib/supabase/server";
import NewCategoryForm from "./NewCategoryForm";
import CategoryToggle from "./CategoryToggle";

export default async function AdminCategorias() {
  const supabase = createClient();

  const { data: categorias } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Categorias</h1>
      <NewCategoryForm />

      <div className="mt-8 space-y-2">
        {(categorias ?? []).map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
            <p className={c.is_active ? "" : "text-gray-400 line-through"}>{c.name}</p>
            <CategoryToggle id={c.id} isActive={c.is_active} />
          </div>
        ))}
      </div>
    </main>
  );
}
