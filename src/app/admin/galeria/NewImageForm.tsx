"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewImageForm() {
  const supabase = createClient();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function selecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    const nomeArquivo = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: uploadError } = await supabase.storage.from("gallery").upload(nomeArquivo, file);

            if (uploadError) {
      setUploading(false);
      setErrorMsg("Não foi possível enviar a foto. Tente novamente.");
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(nomeArquivo);
    await supabase.from("gallery_images").insert({ url: urlData.publicUrl });

    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-dashed p-6 text-center">
      {errorMsg && <p className="mb-2 text-sm text-red-600">{errorMsg}</p>}
      <label className="inline-block cursor-pointer rounded-full bg-brand-600 px-6 py-3 font-medium text-white">
        {uploading ? "Enviando..." : "Escolher foto"}
        <input type="file" accept="image/*" onChange={selecionarArquivo} disabled={uploading} className="hidden" />
      </label>
      <p className="mt-2 text-xs text-gray-500">No celular, isso abre a câmera ou a galeria de fotos.</p>
    </div>
  );
}
