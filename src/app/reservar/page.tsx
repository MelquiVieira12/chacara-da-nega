import { createClient } from "@/lib/supabase/server";
import ReservationWizard from "./ReservationWizard";

export default async function Reservar() {
  const supabase = createClient();

  const { data: categorias } = await supabase
    .from("categories")
    .select("id, name, products(*)")
    .eq("is_active", true)
    .order("sort_order");

  const { data: settings } = await supabase
    .from("business_settings")
    .select("whatsapp_number")
    .single();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Solicitar reserva</h1>
      <ReservationWizard categorias={categorias ?? []} whatsappNumber={settings?.whatsapp_number ?? null} />
    </main>
  );
}
