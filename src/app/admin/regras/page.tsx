import { createClient } from "@/lib/supabase/server";
import NewRuleForm from "./NewRuleForm";
import RemoveRule from "./RemoveRule";

export default async function AdminRegras() {
  const supabase = createClient();
  const { data: regras } = await supabase.from("business_rules").select("*").order("sort_order");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Regras da Chácara</h1>
      <NewRuleForm />

      <div className="mt-8 space-y-2">
        {regras?.map((regra) => (
          <div key={regra.id} className="flex items-start justify-between rounded-lg border p-3">
            <div>
              <span className="text-xs uppercase tracking-wide text-brand-600">{regra.category}</span>
              <p>{regra.description}</p>
            </div>
            <RemoveRule id={regra.id} />
          </div>
        ))}
      </div>
    </main>
  );
}
