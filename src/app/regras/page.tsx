import { createClient } from "@/lib/supabase/server";

export default async function Regras() {
  const supabase = createClient();

  const { data: regras } = await supabase
    .from("business_rules")
    .select("*")
    .order("sort_order");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Regras da Chácara</h1>

      {(!regras || regras.length === 0) && (
        <p className="text-gray-500">
          Regras ainda não cadastradas. (Cadastre no painel administrativo.)
        </p>
      )}

      <ul className="space-y-3">
        {regras?.map((regra) => (
          <li key={regra.id} className="rounded-lg border p-3">
            <span className="text-xs uppercase tracking-wide text-brand-600">
              {regra.category}
            </span>
            <p>{regra.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
