"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Produto = { id: string; name: string; price: number; charge_type: string; is_area: boolean; is_active: boolean; };
type Categoria = { id: string; name: string; products: Produto[]; };

const EVENTOS = ["Aniversário", "Confraternização", "Casamento", "Reunião", "Evento familiar", "Outro"];

export default function ManualReservationForm({ categorias }: { categorias: Categoria[] }) {
  const supabase = createClient();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [period, setPeriod] = useState<"dia" | "noite">("dia");
  const [status, setStatus] = useState<"pending" | "confirmed">("confirmed");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [eventType, setEventType] = useState(EVENTOS[0]);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const todosProdutos = categorias.flatMap((c) => c.products.filter((p) => p.is_active));

  function alterarQuantidade(produtoId: string, quantidade: number) {
    setItems((prev) => ({ ...prev, [produtoId]: Math.max(0, quantidade) }));
  }

  async function salvar() {
    setErrorMsg(null);

    if (!date || !customerName || !customerPhone) {
      setErrorMsg("Preencha data, nome e WhatsApp do cliente.");
      return;
    }

    const itensSelecionados = Object.entries(items).filter(([, qtd]) => qtd > 0).map(([produtoId, qtd]) => ({
      product_id: produtoId,
      quantity: qtd,
    }));

    if (itensSelecionados.length === 0) {
      setErrorMsg("Selecione ao menos um item.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.rpc("create_reservation", {
      p_date: date,
      p_period: period,
      p_customer_name: customerName,
      p_customer_phone: customerPhone,
      p_people_count: peopleCount ? Number(peopleCount) : null,
      p_event_type: eventType,
      p_notes: notes || null,
      p_items: itensSelecionados,
      p_status: status,
      p_created_by_admin: true,
    });
    setSubmitting(false);

    if (error) {
      setErrorMsg("Não foi possível salvar. Tente novamente.");
      return;
    }

    router.push("/admin/reservas");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {errorMsg && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMsg}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium">Data</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border p-3" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Turno</label>
        <div className="flex gap-3">
          {(["dia", "noite"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`flex-1 rounded-lg border p-3 capitalize ${period === p ? "border-brand-600 bg-brand-50 text-brand-700" : ""}`}>{p}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Status inicial</label>
        <div className="flex gap-3">
          {(["confirmed", "pending"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`flex-1 rounded-lg border p-3 capitalize ${status === s ? "border-brand-600 bg-brand-50 text-brand-700" : ""}`}>{s === "confirmed" ? "Confirmada" : "Pendente"}</button>
          ))}
        </div>
      </div>

      <div><label className="mb-1 block text-sm font-medium">Nome do cliente</label><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">WhatsApp</label><input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Quantidade de pessoas</label><input type="number" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Tipo de evento</label><select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full rounded-lg border p-3">{EVENTOS.map((ev) => (<option key={ev}>{ev}</option>))}</select></div>
      <div><label className="mb-1 block text-sm font-medium">Observações</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border p-3" /></div>

      <div>
        <p className="mb-2 text-sm font-medium">Itens</p>
        {categorias.map((categoria) => (
          <div key={categoria.id} className="mb-3">
            <p className="mb-1 text-sm font-semibold text-gray-700">{categoria.name}</p>
            <div className="space-y-2">
              {categoria.products.filter((p) => p.is_active).map((produto) => (
                <div key={produto.id} className="flex items-center justify-between rounded-lg border p-3">
                  <p className="text-sm">{produto.name} <span className="text-gray-400">(R$ {Number(produto.price).toFixed(2)})</span></p>
                  {produto.is_area ? (
                    <button onClick={() => alterarQuantidade(produto.id, items[produto.id] ? 0 : 1)} className={`rounded-full px-4 py-2 text-sm font-medium ${items[produto.id] ? "bg-brand-600 text-white" : "border border-brand-600 text-brand-700"}`}>{items[produto.id] ? "Selecionado" : "Selecionar"}</button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => alterarQuantidade(produto.id, (items[produto.id] ?? 0) - 1)} className="h-8 w-8 rounded-full border">-</button>
                      <span className="w-6 text-center">{items[produto.id] ?? 0}</span>
                      <button onClick={() => alterarQuantidade(produto.id, (items[produto.id] ?? 0) + 1)} className="h-8 w-8 rounded-full border">+</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">Como reserva feita pelo painel, o estoque e datas bloqueadas não impedem o salvamento — confira manualmente antes de confirmar.</p>

      <button disabled={submitting} onClick={salvar} className="w-full rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">{submitting ? "Salvando..." : "Salvar reserva"}</button>
    </div>
  );
}
