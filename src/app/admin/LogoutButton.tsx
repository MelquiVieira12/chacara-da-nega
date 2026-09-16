"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return <button onClick={sair} className="rounded-full border px-4 py-2 text-sm">Sair</button>;
}
