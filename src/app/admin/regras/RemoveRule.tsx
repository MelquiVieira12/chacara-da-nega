"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RemoveRule({ id }: { id: string }) {
  const supabase = createClient();
  const router = useRouter();

  async function excluir() {
    await supabase.from("business_rules").delete().eq("id", id);
    router.refresh();
  }

  return <button onClick={excluir} className="text-sm text-red-600 underline">Excluir</button>;
}
