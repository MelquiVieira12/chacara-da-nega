import { createClient } from "@/lib/supabase/server";
import ReservationActions from "./ReservationActions";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Concluída",
};

export default async function AdminReservas() {
  const supabase = createClient();

  const { data: reservas } = await supabase
    .from("reservations")
    .select("*, reservation_items(*, products(name))")
    .order("date", { ascending: false })
    .limit(100);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-700">Reservas</h1>
        <a href="/admin/reservas/nova" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white">+ Nova reserva</a>
      </div>

      <div className="space-y-3">
        {(reservas ?? []).length === 0 && <p className="text-gray-500">Nenhuma reserva ainda.</p>}
        {reservas?.map((r) => (
          <div key={r.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{r.date} ({r.period}) — {r.customer_name}</p>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{STATUS_LABELS[r.status] ?? r.status}</span>
            </div>
            <p className="text-sm text-gray-500">{r.customer_phone} · {r.event_type} · {r.people_count ?? "?"} pessoas</p>
            <ul className="ml-4 mt-1 list-disc text-sm text-gray-600">
              {r.reservation_items?.map((item: any) => (
                <li key={item.id}>{item.products?.name} x{item.quantity} — R$ {Number(item.subtotal).toFixed(2)}</li>
              ))}
            </ul>
            <p className="mt-1 text-sm font-medium">Total: R$ {Number(r.total_amount).toFixed(2)}</p>
            {r.notes && <p className="mt-1 text-sm text-gray-500">Obs: {r.notes}</p>}
            <ReservationActions id={r.id} status={r.status} />
          </div>
        ))}
      </div>
    </main>
  );
}
