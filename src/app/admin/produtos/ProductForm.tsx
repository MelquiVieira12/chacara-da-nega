"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Produto = {
  id: string; name: string; description: string | null; category_id: string | null;
  price: number; charge_type: string; stock_quantity: number | null; is_area: boolean;
};

export default function ProductForm({ categorias, produto }: { categorias: { id: string; name: string }[]; produto?: Produto }) {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState(produto?.name ?? "");
  const [description, setDescription] = useState(produto?.description ?? "");
  const [categoryId, setCategoryId] = useState(produto?.category_id ?? categorias[0]?.id ?? "");
  const [price, setPrice] = useState(produto?.price?.toString() ?? "");
  const [chargeType, setChargeType] = useState(produto?.charge_type ?? "fixed");
  const [isArea, setIsArea] = useState(produto?.is_area ?? false);
  const [hasStock, setHasStock] = useState(produto?.stock_quantity != null);
  const [stockQuantity, setStockQuantity] = useState(produto?.stock_quantity?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function salvar() {
    if (!name.trim() || !price) {
      setErrorMsg("Preencha ao menos nome e preço.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      category_id: categoryId || null,
      price: Number(price),
      charge_type: chargeType,
      is_area: isArea,
      stock_quantity: hasStock ? Number(stockQuantity) : null,
    };

    const { error } = produto
      ? await supabase.from("products").update(payload).eq("id", produto.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (error) {
      setErrorMsg("Não foi possível salvar. Confira os campos.");
      return;
    }
    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {errorMsg && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMsg}</p>}

      <div><label className="mb-1 block text-sm font-medium">Nome</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Descrição (opcional)</label><textarea value={description ?? ""} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border p-3" /></div>

      <div>
        <label className="mb-1 block text-sm font-medium">Categoria</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border p-3">
          {categorias.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>

      <div><label className="mb-1 block text-sm font-medium">Preço (R$)</label><input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border p-3" /></div>

      <div>
        <label className="mb-1 block text-sm font-medium">Tipo de cobrança</label>
        <select value={chargeType} onChange={(e) => setChargeType(e.target.value)} className="w-full rounded-lg border p-3">
          <option value="fixed">Valor fixo</option>
          <option value="per_unit">Por unidade</option>
          <option value="per_quantity">Por quantidade</option>
          <option value="per_day">Por diária</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isArea} onChange={(e) => setIsArea(e.target.checked)} />
        É uma área de uso exclusivo (ex: piscina, salão) — só pode ser reservada uma vez por turno
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={hasStock} onChange={(e) => setHasStock(e.target.checked)} />
        Controlar estoque (ex: mesas, cadeiras)
      </label>

      {hasStock && (
        <div><label className="mb-1 block text-sm font-medium">Quantidade em estoque</label><input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full rounded-lg border p-3" /></div>
      )}

      <button disabled={saving} onClick={salvar} className="w-full rounded-full bg-brand-600 px-6 py-3 font-medium text-white disabled:opacity-50">{saving ? "Salvando..." : "Salvar produto"}</button>
    </div>
  );
}
