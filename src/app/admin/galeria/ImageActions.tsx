"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ImageActions({ id, isActive }: { id: string; isActive: boolean }) {
  const supabase = createClient();
  const router = useRouter();

  async function alternar() {
    await supabase.from("gallery_images").update({ is_active: !isActive }).eq("id", id);
    router.refresh();
  }

  async function excluir() {
    await supabase.from("gallery_images").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="mt-1 flex justify-center gap-2 text-xs">
      <button onClick={alternar} className="text-brand-700 underline">{isActive ? "Ocultar" : "Mostrar"}</button>
      <button onClick={excluir} className="text-red-600 underline">Excluir</button>
    </div>
  );
}
