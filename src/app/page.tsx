import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  const { data: settings } = await supabase
    .from("business_settings")
    .select("*")
    .single();

  const nome = settings?.name ?? "Chácara da Nega";
  const descricao =
    settings?.description ??
    "Um espaço de lazer para você aproveitar seus momentos especiais com família e amigos. (dado de demonstração)";
  const whatsapp = settings?.whatsapp_number;

  return (
    <main className="flex min-h-screen flex-col">
      <section className="flex flex-col items-center justify-center gap-4 bg-brand-50 px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-brand-700">{nome}</h1>
        <p className="text-lg text-brand-600">Seu momento especial começa aqui.</p>
        <p className="max-w-md text-gray-600">{descricao}</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          
            href="/reservar"
            className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700"
          >
            Consultar disponibilidade
          </a>
          {whatsapp && (
            
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              className="rounded-full border border-brand-600 px-6 py-3 font-medium text-brand-700 hover:bg-brand-50"
            >
              Falar no WhatsApp
            </a>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 px-6 py-10 sm:grid-cols-4">
        {["Piscina", "Churrasqueira", "Espaço para festas", "Mesas e cadeiras"].map(
          (item) => (
            <div
              key={item}
              className="flex h-24 items-center justify-center rounded-xl bg-gray-100 text-center text-sm font-medium text-gray-700"
            >
              {item}
            </div>
          )
        )}
      </section>
    </main>
  );
}
