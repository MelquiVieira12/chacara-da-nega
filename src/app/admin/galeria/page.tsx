import { createClient } from "@/lib/supabase/server";
import NewImageForm from "./NewImageForm";
import ImageActions from "./ImageActions";

export default async function AdminGaleria() {
  const supabase = createClient();
  const { data: fotos } = await supabase.from("gallery_images").select("*").order("sort_order");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Galeria</h1>
      <NewImageForm />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {fotos?.map((foto) => (
          <div key={foto.id} className={foto.is_active ? "" : "opacity-40"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
            <ImageActions id={foto.id} isActive={foto.is_active} />
          </div>
        ))}
      </div>
    </main>
  );
}
