"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SettingsForm({ settings }: { settings: any }) {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState(settings?.name ?? "");
  const [description, setDescription] = useState(settings?.description ?? "");
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp_number ?? "");
  const [address, setAddress] = useState(settings?.address ?? "");
  const [instagram, setInstagram] = useState(settings?.instagram ?? "");
  const [hours, setHours] = useState(settings?.hours ?? "");
  const [capacity, setCapacity] = useState(settings?.capacity?.toString() ?? "");
  const [cancellationPolicy, setCancellationPolicy] = useState(settings?.cancellation_policy ?? "");
  const [additionalInfo, setAdditionalInfo] = useState(settings?.additional_info ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function salvar() {
    setSaving(true);
    setSaved(false);
    await supabase.from("business_settings").update({
      name, description, whatsapp_number: whatsapp, address, instagram, hours,
      capacity: capacity ? Number(capacity) : null,
      cancellation_policy: cancellationPolicy,
      additional_info: additionalInfo,
    }).eq("id", 1);
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {saved && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Configurações salvas.</p>}

      <div><label className="mb-1 block text-sm font-medium">Nome do negócio</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Descrição</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Número do WhatsApp (com DDI e DDD, só números — ex: 5588999999999)</label><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Endereço</label><input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Instagram</label><input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Horário de funcionamento</label><input value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Capacidade máxima (pessoas)</label><input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Política de cancelamento</label><textarea value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Informações adicionais</label><textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="w-full rounded-lg border p-3" /></div>

      <button disabled={saving} onClick={salvar} className="w-full rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">{saving ? "Salvando..." : "Salvar configurações"}</button>
    </div>
  );
}
