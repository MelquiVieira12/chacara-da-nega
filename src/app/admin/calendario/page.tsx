import { createClient } from "@/lib/supabase/server";
import AdminCalendar from "./AdminCalendar";

export default async function AdminCalendario() {
  const supabase = createClient();

  const { data: reservas } = await supabase
    .from("reservations")
    .select("id, date, period, status, customer_name, event_type")
    .in("status", ["pending", "confirmed"])
    .order("date");

  const { data: bloqueios } = await supabase.from("blocked_dates").select("date, reason");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Calendário</h1>
      <AdminCalendar reservas={reservas ?? []} bloqueios={bloqueios ?? []} />
    </main>
  );
}
