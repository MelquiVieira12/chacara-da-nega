"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewImageForm() {
  const supabase = createClient();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function adicionar() {
    if (!url.trim()) return;
    setSaving(true);
    await supabase.from("gallery_images").insert({ url: url.trim() });
    setSaving(false);
    setUrl("");
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link da imagem (https://...)" className="flex-1 rounded-lg border p-3" />
      <button disabled={saving} onClick={adicionar} className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">Adicionar</button>
    </div>
  );
}
