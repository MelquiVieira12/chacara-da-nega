"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CategoryToggle({ id, isActive, name }: { id: string; isActive: boolean; name: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function alternar() {
    setSaving(true);
    await supabase.from("categories").update({ is_active: !isActive }).eq("id", id);
    setSaving(false);
    router.refresh();
  }

  async function renomear() {
    const novoNome = window.prompt("Novo nome da categoria:", name);
    if (!novoNome || !novoNome.trim() || novoNome.trim() === name) return;
    setSaving(true);
    await supabase.from("categories").update({ name: novoNome.trim() }).eq("id", id);
    setSaving(false);
    router.refresh();
  }

  async function excluir() {
    const confirmar = window.confirm(`Excluir a categoria "${name}"? Produtos dentro dela ficam sem categoria, mas não são apagados.`);
    if (!confirmar) return;
    setSaving(true);
    await supabase.from("categories").delete().eq("id", id);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button disabled={saving} onClick={renomear} className="text-sm text-brand-700 underline">Renomear</button>
      <button disabled={saving} onClick={alternar} className={`rounded-full px-3 py-1 text-xs font-medium ${isActive ? "border border-red-400 text-red-600" : "bg-brand-600 text-white"}`}>
        {isActive ? "Desativar" : "Ativar"}
      </button>
      <button disabled={saving} onClick={excluir} className="text-sm text-red-600 underline">Excluir</button>
    </div>
  );
}
