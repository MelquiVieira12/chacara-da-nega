"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewCategoryForm() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function salvar() {
    if (!name.trim()) return;
    setSaving(true);
    await supabase.from("categories").insert({ name: name.trim() });
    setSaving(false);
    setName("");
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da categoria" className="flex-1 rounded-lg border p-3" />
      <button disabled={saving} onClick={salvar} className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">Adicionar</button>
    </div>
  );
}
