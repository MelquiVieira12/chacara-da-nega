import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function AdminConfiguracoes() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("business_settings").select("*").single();

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Configurações</h1>
      <SettingsForm settings={settings} />
    </main>
  );
}
