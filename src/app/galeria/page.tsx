import { createClient } from "@/lib/supabase/server";

export default async function Galeria() {
  const supabase = createClient();

  const { data: fotos } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Galeria</h1>

      {(!fotos || fotos.length === 0) && (
        <p className="text-gray-500">
          Nenhuma foto cadastrada ainda. (Adicione fotos no painel administrativo.)
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fotos?.map((foto) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={foto.id}
            src={foto.url}
            alt="Foto da Chácara da Nega"
            className="aspect-square w-full rounded-lg object-cover"
          />
        ))}
      </div>
    </main>
  );
}
