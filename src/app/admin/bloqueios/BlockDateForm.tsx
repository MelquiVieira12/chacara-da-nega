"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BlockDateForm() {
  const supabase = createClient();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function bloquear() {
    if (!date) return;
    setSaving(true);
    setErrorMsg(null);
    const { error } = await supabase.from("blocked_dates").insert({ date, reason: reason || null });
    setSaving(false);
    if (error) {
      setErrorMsg("Essa data já está bloqueada ou ocorreu um erro.");
      return;
    }
    setDate("");
    setReason("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end">
      {errorMsg && <p className="text-sm text-red-600 sm:w-full">{errorMsg}</p>}
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium">Data</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border p-3" />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium">Motivo (opcional)</label>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex: manutenção" className="w-full rounded-lg border p-3" />
      </div>
      <button disabled={saving} onClick={bloquear} className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">Bloquear</button>
    </div>
  );
}
