import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AdminDashboard() {
  const supabase = createClient();

  const { count: pendentes } = await supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "pending");
  const { count: confirmadas } = await supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "confirmed");

  const { data: proximas } = await supabase
    .from("reservations")
    .select("*")
    .in("status", ["pending", "confirmed"])
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date")
    .limit(10);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-700">Painel administrativo</h1>
        <LogoutButton />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 text-center">
          <p className="text-3xl font-bold text-brand-700">{pendentes ?? 0}</p>
          <p className="text-sm text-gray-500">Solicitações pendentes</p>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <p className="text-3xl font-bold text-brand-700">{confirmadas ?? 0}</p>
          <p className="text-sm text-gray-500">Reservas confirmadas</p>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Próximas reservas</h2>
      <div className="space-y-2">
        {(proximas ?? []).length === 0 && <p className="text-gray-500">Nenhuma reserva futura.</p>}
        {proximas?.map((r) => (
          <div key={r.id} className="rounded-lg border p-3">
            <p className="font-medium">{r.date} ({r.period}) — {r.customer_name}</p>
            <p className="text-sm text-gray-500">{r.event_type} · {r.people_count ?? "?"} pessoas · R$ {Number(r.total_amount).toFixed(2)} · <span className="capitalize">{r.status}</span></p>
          </div>
        ))}
      </div>
    </main>
  );
}
