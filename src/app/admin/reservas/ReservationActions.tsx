"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReservationActions({ id, status }: { id: string; status: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function alterarStatus(novoStatus: string) {
    setLoading(true);
    await supabase.from("reservations").update({ status: novoStatus }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {status === "pending" && (
        <button disabled={loading} onClick={() => alterarStatus("confirmed")} className="rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">Confirmar</button>
      )}
      {status !== "cancelled" && status !== "completed" && (
        <button disabled={loading} onClick={() => alterarStatus("cancelled")} className="rounded-full border border-red-400 px-3 py-1 text-xs font-medium text-red-600">Cancelar</button>
      )}
      {status === "confirmed" && (
        <button disabled={loading} onClick={() => alterarStatus("completed")} className="rounded-full border px-3 py-1 text-xs font-medium">Concluir</button>
      )}
    </div>
  );
}
