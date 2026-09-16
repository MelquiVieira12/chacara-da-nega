import { createClient } from "@/lib/supabase/server";
import BlockDateForm from "./BlockDateForm";
import RemoveBlockedDate from "./RemoveBlockedDate";

export default async function AdminBloqueios() {
  const supabase = createClient();

  const { data: bloqueios } = await supabase
    .from("blocked_dates")
    .select("*")
    .order("date");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Bloqueio de datas</h1>
      <BlockDateForm />

      <div className="mt-8 space-y-2">
        {(bloqueios ?? []).length === 0 && <p className="text-gray-500">Nenhuma data bloqueada.</p>}
        {bloqueios?.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">{b.date}</p>
              {b.reason && <p className="text-sm text-gray-500">{b.reason}</p>}
            </div>
            <RemoveBlockedDate id={b.id} />
          </div>
        ))}
      </div>
    </main>
  );
}
