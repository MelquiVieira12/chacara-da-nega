"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CategoryToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const supabase = createClient();
  const router = useRouter();

  async function alternar() {
    await supabase.from("categories").update({ is_active: !isActive }).eq("id", id);
    router.refresh();
  }

  return (
    <button onClick={alternar} className={`rounded-full px-3 py-1 text-xs font-medium ${isActive ? "border border-red-400 text-red-600" : "bg-brand-600 text-white"}`}>
      {isActive ? "Desativar" : "Ativar"}
    </button>
  );
}
