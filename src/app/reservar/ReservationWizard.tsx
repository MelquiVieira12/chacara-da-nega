"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Produto = { id: string; name: string; description: string | null; price: number; charge_type: string; stock_quantity: number | null; is_area: boolean; is_active: boolean; };
type Categoria = { id: string; name: string; products: Produto[]; };

const EVENTOS = ["Aniversário", "Confraternização", "Casamento", "Reunião", "Evento familiar", "Outro"];

export default function ReservationWizard({ categorias, whatsappNumber }: { categorias: Categoria[]; whatsappNumber: string | null; }) {
  const supabase = createClient();

  const [step, setStep] = useState<"date" | "products" | "customer" | "review">("date");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState<"dia" | "noite">("dia");
  const [checking, setChecking] = useState(false);
  const [dateBlocked, setDateBlocked] = useState(false);
  const [usedByProduct, setUsedByProduct] = useState<Record<string, number>>({});
  const [items, setItems] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [eventType, setEventType] = useState(EVENTOS[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; message: string } | null>(null);

  const todosProdutos = categorias.flatMap((c) => c.products.filter((p) => p.is_active));

  async function verificarDisponibilidade() {
    setErrorMsg(null);
    setChecking(true);
    try {
      const { data: bloqueada } = await supabase.from("blocked_dates").select("date").eq("date", date).maybeSingle();
      setDateBlocked(!!bloqueada);

      const { data: ocupacao, error } = await supabase.rpc("public_availability", { start_date: date, end_date: date });
      if (error) throw error;

      const usados: Record<string, number> = {};
      (ocupacao ?? []).filter((linha: any) => linha.period === period).forEach((linha: any) => {
        usados[linha.product_id] = (usados[linha.product_id] ?? 0) + linha.quantity;
      });
      setUsedByProduct(usados);
      setStep("products");
    } catch {
      setErrorMsg("Não foi possível verificar a disponibilidade. Tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  function disponivel(produto: Produto) {
    if (produto.stock_quantity == null) return Infinity;
    return produto.stock_quantity - (usedByProduct[produto.id] ?? 0);
  }

  function alterarQuantidade(produto: Produto, quantidade: number) {
    const max = disponivel(produto);
    const qtd = Math.max(0, Math.min(quantidade, max === Infinity ? quantidade : max));
    setItems((prev) => ({ ...prev, [produto.id]: qtd }));
  }

  const itensSelecionados = Object.entries(items).filter(([, qtd]) => qtd > 0).map(([produtoId, qtd]) => {
    const produto = todosProdutos.find((p) => p.id === produtoId)!;
    return { produto, quantidade: qtd, subtotal: produto.price * qtd };
  });

  const total = itensSelecionados.reduce((soma, item) => soma + item.subtotal, 0);

  async function enviarSolicitacao() {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.rpc("create_reservation", {
        p_date: date,
        p_period: period,
        p_customer_name: customerName,
        p_customer_phone: customerPhone,
        p_people_count: peopleCount ? Number(peopleCount) : null,
        p_event_type: eventType,
        p_notes: notes || null,
        p_items: itensSelecionados.map((item) => ({ product_id: item.produto.id, quantity: item.quantidade })),
      });

      if (error) {
        if (error.message?.includes("DATA_BLOQUEADA")) setErrorMsg("Essa data foi bloqueada enquanto você preenchia o formulário. Escolha outra data.");
        else if (error.message?.includes("ESTOQUE_INSUFICIENTE")) setErrorMsg("A disponibilidade mudou enquanto você preenchia o formulário. Volte e ajuste as quantidades.");
        else setErrorMsg("Não foi possível enviar a solicitação. Tente novamente.");
        return;
      }

      const linhas = itensSelecionados.map((item) => `- ${item.produto.name} (${item.quantidade}x)`).join("\n");
      const mensagem = `Olá! Gostaria de solicitar uma reserva na Chácara da Nega.\n\n📅 Data: ${date} (${period})\n🎉 Evento: ${eventType}\n👥 Pessoas: ${peopleCount || "não informado"}\n\n👤 Cliente: ${customerName}\n📱 WhatsApp: ${customerPhone}\n\n📋 Itens solicitados:\n${linhas}\n\n💰 Valor estimado: R$ ${total.toFixed(2)}\n\n📝 Observações: ${notes || "nenhuma"}\n\nGostaria de confirmar a disponibilidade e finalizar a reserva.`;

      setResult({ id: data as string, message: mensagem });
    } catch {
      setErrorMsg("Não foi possível enviar a solicitação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const link = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(result.message)}` : null;
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="mb-2 text-lg font-semibold text-brand-700">Solicitação enviada!</p>
        <p className="mb-4 text-sm text-gray-600">Sua solicitação foi registrada. A confirmação final depende da proprietária. Toque no botão abaixo para enviar os detalhes pelo WhatsApp.</p>
        {link ? (
          <a href={link} target="_blank" className="inline-block rounded-full bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">Abrir WhatsApp</a>
        ) : (
          <p className="text-sm text-red-600">Número de WhatsApp ainda não configurado no painel administrativo.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMsg && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMsg}</p>}

      {step === "date" && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Data desejada</label>
            <input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Turno</label>
            <div className="flex gap-3">
              {(["dia", "noite"] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`flex-1 rounded-lg border p-3 capitalize ${period === p ? "border-brand-600 bg-brand-50 text-brand-700" : ""}`}>{p}</button>
              ))}
            </div>
          </div>
          <button disabled={!date || checking} onClick={verificarDisponibilidade} className="w-full rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">{checking ? "Verificando..." : "Ver disponibilidade"}</button>
        </div>
      )}

      {step === "products" && (
        <div className="space-y-4">
          {dateBlocked ? (
            <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">Essa data está bloqueada pela proprietária. Escolha outra data.</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">{date} — turno {period}</p>
              {categorias.map((categoria) => (
                <div key={categoria.id}>
                  <h3 className="mb-2 font-semibold text-gray-800">{categoria.name}</h3>
                  <div className="space-y-2">
                    {categoria.products.filter((p) => p.is_active).map((produto) => {
                      const max = disponivel(produto);
                      const esgotado = max <= 0;
                      return (
                        <div key={produto.id} className={`flex items-center justify-between rounded-lg border p-3 ${esgotado ? "opacity-50" : ""}`}>
                          <div>
                            <p className="font-medium">{produto.name}</p>
                            <p className="text-sm text-gray-500">R$ {Number(produto.price).toFixed(2)}{esgotado && " — indisponível nesse turno"}</p>
                          </div>
                          {!esgotado && (produto.is_area ? (
                            <button onClick={() => alterarQuantidade(produto, items[produto.id] ? 0 : 1)} className={`rounded-full px-4 py-2 text-sm font-medium ${items[produto.id] ? "bg-brand-600 text-white" : "border border-brand-600 text-brand-700"}`}>{items[produto.id] ? "Selecionado" : "Selecionar"}</button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button onClick={() => alterarQuantidade(produto, (items[produto.id] ?? 0) - 1)} className="h-8 w-8 rounded-full border">-</button>
                              <span className="w-6 text-center">{items[produto.id] ?? 0}</span>
                              <button onClick={() => alterarQuantidade(produto, (items[produto.id] ?? 0) + 1)} className="h-8 w-8 rounded-full border">+</button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="flex gap-3">
            <button onClick={() => setStep("date")} className="flex-1 rounded-full border px-6 py-3">Voltar</button>
            <button disabled={dateBlocked || itensSelecionados.length === 0} onClick={() => setStep("customer")} className="flex-1 rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">Continuar</button>
          </div>
        </div>
      )}

      {step === "customer" && (
        <div className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium">Nome completo</label><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-lg border p-3" /></div>
          <div><label className="mb-1 block text-sm font-medium">WhatsApp</label><input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="(88) 90000-0000" className="w-full rounded-lg border p-3" /></div>
          <div><label className="mb-1 block text-sm font-medium">Quantidade de pessoas</label><input type="number" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} className="w-full rounded-lg border p-3" /></div>
          <div><label className="mb-1 block text-sm font-medium">Tipo de evento</label><select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full rounded-lg border p-3">{EVENTOS.map((ev) => (<option key={ev}>{ev}</option>))}</select></div>
          <div><label className="mb-1 block text-sm font-medium">Observações</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border p-3" /></div>
          <div className="flex gap-3">
            <button onClick={() => setStep("products")} className="flex-1 rounded-full border px-6 py-3">Voltar</button>
            <button disabled={!customerName || !customerPhone} onClick={() => setStep("review")} className="flex-1 rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">Revisar</button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <p className="font-semibold text-brand-700">Chácara da Nega</p>
            <p className="mt-2 text-sm">Data: {date} ({period})</p>
            <p className="text-sm">Evento: {eventType}</p>
            <p className="text-sm">Pessoas: {peopleCount || "não informado"}</p>
            <p className="text-sm">Cliente: {customerName}</p>
            <p className="text-sm">WhatsApp: {customerPhone}</p>
            <div className="mt-3">
              <p className="text-sm font-medium">Itens:</p>
              <ul className="ml-4 list-disc text-sm">
                {itensSelecionados.map((item) => (<li key={item.produto.id}>{item.produto.name} {!item.produto.is_area && `x${item.quantidade}`} — R$ {item.subtotal.toFixed(2)}</li>))}
              </ul>
            </div>
            <p className="mt-3 font-semibold">Valor estimado: R$ {total.toFixed(2)}</p>
          </div>
          <p className="text-xs text-gray-500">Os valores apresentados representam uma solicitação de reserva. A confirmação final depende da proprietária.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep("customer")} className="flex-1 rounded-full border px-6 py-3">Voltar</button>
            <button disabled={submitting} onClick={enviarSolicitacao} className="flex-1 rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">{submitting ? "Enviando..." : "Solicitar reserva"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
