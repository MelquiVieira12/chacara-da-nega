"use client";

import { useState } from "react";

type Reserva = { id: string; date: string; period: string; status: string; customer_name: string; event_type: string | null };
type Bloqueio = { date: string; reason: string | null };

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function AdminCalendar({ reservas, bloqueios }: { reservas: Reserva[]; bloqueios: Bloqueio[] }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  const primeiroDia = new Date(ano, mes, 1);
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const offset = primeiroDia.getDay();

  function paraChave(dia: number) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  }

  function reservasDoDia(chave: string) {
    return reservas.filter((r) => r.date === chave);
  }

  function bloqueioDoDia(chave: string) {
    return bloqueios.find((b) => b.date === chave);
  }

  function mudarMes(delta: number) {
    let novoMes = mes + delta;
    let novoAno = ano;
    if (novoMes < 0) { novoMes = 11; novoAno -= 1; }
    if (novoMes > 11) { novoMes = 0; novoAno += 1; }
    setMes(novoMes);
    setAno(novoAno);
    setDiaSelecionado(null);
  }

  const celulas = [];
  for (let i = 0; i < offset; i++) celulas.push(null);
  for (let dia = 1; dia <= diasNoMes; dia++) celulas.push(dia);

  const nomeMes = primeiroDia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => mudarMes(-1)} className="rounded-full border px-3 py-1">‹</button>
        <p className="font-semibold capitalize">{nomeMes}</p>
        <button onClick={() => mudarMes(1)} className="rounded-full border px-3 py-1">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
        {DIAS_SEMANA.map((d) => (<div key={d}>{d}</div>))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celulas.map((dia, i) => {
          if (dia === null) return <div key={`vazio-${i}`} />;
          const chave = paraChave(dia);
          const reservasDia = reservasDoDia(chave);
          const bloqueio = bloqueioDoDia(chave);
          const temPendente = reservasDia.some((r) => r.status === "pending");
          const temConfirmada = reservasDia.some((r) => r.status === "confirmed");

          let cor = "";
          if (bloqueio) cor = "bg-gray-200 text-gray-500";
          else if (temPendente && temConfirmada) cor = "bg-gradient-to-br from-yellow-100 to-green-100";
          else if (temConfirmada) cor = "bg-green-100 text-green-800";
          else if (temPendente) cor = "bg-yellow-100 text-yellow-800";

          return (
            <button
              key={chave}
              onClick={() => setDiaSelecionado(chave === diaSelecionado ? null : chave)}
              className={`aspect-square rounded-lg text-sm ${cor} ${chave === diaSelecionado ? "ring-2 ring-brand-600" : ""}`}
            >
              {dia}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-yellow-100" /> Pendente</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-green-100" /> Confirmada</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-gray-200" /> Bloqueado</span>
      </div>

      {diaSelecionado && (
        <div className="mt-6 rounded-xl border p-4">
          <p className="mb-2 font-semibold">{diaSelecionado}</p>
          {bloqueioDoDia(diaSelecionado) && (
            <p className="mb-2 text-sm text-gray-500">Bloqueado — {bloqueioDoDia(diaSelecionado)?.reason ?? "sem motivo informado"}</p>
          )}
          {reservasDoDia(diaSelecionado).length === 0 && !bloqueioDoDia(diaSelecionado) && (
            <p className="text-sm text-gray-500">Nenhuma reserva nesse dia.</p>
          )}
          {reservasDoDia(diaSelecionado).map((r) => (
            <div key={r.id} className="mb-2 rounded-lg border p-2 text-sm">
              <p className="font-medium">{r.period} — {r.customer_name}</p>
              <p className="text-gray-500">{r.event_type} · {r.status === "pending" ? "Pendente" : "Confirmada"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
