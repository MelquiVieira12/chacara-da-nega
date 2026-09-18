import { createClient } from "@/lib/supabase/server";

export default async function Informacoes() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("business_settings").select("*").single();

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Informações</h1>

      <div className="space-y-5">
        {settings?.address && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Endereço</p>
            <p>{settings.address}</p>
          </div>
        )}

        {settings?.hours && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Horário de funcionamento</p>
            <p>{settings.hours}</p>
          </div>
        )}

        {settings?.capacity && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Capacidade máxima</p>
            <p>{settings.capacity} pessoas</p>
          </div>
        )}

        {settings?.cancellation_policy && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Política de cancelamento</p>
            <p>{settings.cancellation_policy}</p>
          </div>
        )}

        {settings?.additional_info && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Informações adicionais</p>
            <p>{settings.additional_info}</p>
          </div>
        )}

        {settings?.instagram && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Instagram</p>
            <a href={settings.instagram} target="_blank" className="text-brand-700 underline">{settings.instagram}</a>
          </div>
        )}

        {!settings?.address && !settings?.hours && !settings?.capacity && !settings?.cancellation_policy && !settings?.additional_info && !settings?.instagram && (
          <p className="text-gray-500">Informações ainda não cadastradas.</p>
        )}
      </div>
    </main>
  );
}
