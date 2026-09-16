"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RemoveBlockedDate({ id }: { id: string }) {
  const supabase = createClient();
  const router = useRouter();

  async function desbloquear() {
    await supabase.from("blocked_dates").delete().eq("id", id);
    router.refresh();
  }

  return <button onClick={desbloquear} className="text-sm text-red-600 underline">Desbloquear</button>;
}
