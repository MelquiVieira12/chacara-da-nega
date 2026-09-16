import { createClient } from "@/lib/supabase/server";
import ManualReservationForm from "./ManualReservationForm";

export default async function NovaReservaManual() {
  const supabase = createClient();

  const { data: categorias } = await supabase
    .from("categories")
    .select("id, name, products(*)")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Nova reserva manual</h1>
      <ManualReservationForm categorias={categorias ?? []} />
    </main>
  );
}
