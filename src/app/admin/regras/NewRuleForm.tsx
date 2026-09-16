"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewRuleForm() {
  const supabase = createClient();
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function adicionar() {
    if (!category.trim() || !description.trim()) return;
    setSaving(true);
    await supabase.from("business_rules").insert({ category: category.trim(), description: description.trim() });
    setSaving(false);
    setCategory("");
    setDescription("");
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria (ex: Piscina, Som, Animais)" className="w-full rounded-lg border p-3" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição da regra" className="w-full rounded-lg border p-3" />
      <button disabled={saving} onClick={adicionar} className="w-full rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">Adicionar regra</button>
    </div>
  );
}
