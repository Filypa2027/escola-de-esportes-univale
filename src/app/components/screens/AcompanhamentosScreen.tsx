import { useState } from "react";
import { Plus, Search, Eye, Trash2, Heart, X, Save } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { actionBtn, actionBtnDanger } from "../shared/DetailModal";
import { mockAcompanhamentos, type Acompanhamento, type Status } from "../data/mockData";

interface AcompanhamentosScreenProps {
  searchQuery?: string;
}

const emptyForm = {
  data: new Date().toISOString().split("T")[0],
  aluno: "",
  profissional: "",
  aula: "",
  resumo: "",
  observacao: "",
  situacao: "ATIVO" as Status,
};

export function AcompanhamentosScreen({ searchQuery = "" }: AcompanhamentosScreenProps) {
  const [items, setItems] = useState<Acompanhamento[]>(mockAcompanhamentos);
  const [search, setSearch] = useState("");
  const [filterProfissional, setFilterProfissional] = useState("");
  const [filterTurma, setFilterTurma] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<Acompanhamento | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast, showToast, hideToast } = useToast();

  const effectiveSearch = (search || searchQuery).trim().toLowerCase();

  const filtered = items.filter(
    a =>
      a.situacao !== "DELETADO" &&
      (!effectiveSearch ||
        a.aluno.toLowerCase().includes(effectiveSearch) ||
        a.resumo.toLowerCase().includes(effectiveSearch) ||
        a.profissional.toLowerCase().includes(effectiveSearch) ||
        a.turma.toLowerCase().includes(effectiveSearch)) &&
      (!filterProfissional || a.profissional === filterProfissional) &&
      (!filterTurma || a.turma === filterTurma) &&
      (!filterSituacao || a.situacao === filterSituacao)
  );

  const profissionais = [...new Set(mockAcompanhamentos.map(a => a.profissional))];
  const turmas = [...new Set(mockAcompanhamentos.map(a => a.turma))];

  const openNew = () => {
    setForm(emptyForm);
    setErrors({});
    setShowForm(true);
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.data) e.data = "Data é obrigatória";
    if (!form.aluno) e.aluno = "Aluno é obrigatório";
    if (!form.profissional) e.profissional = "Profissional é obrigatório";
    if (!form.observacao.trim()) e.observacao = "Observação é obrigatória";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setItems(prev => [
      {
        id: Date.now(),
        data: form.data,
        aluno: form.aluno,
        profissional: form.profissional,
        turma: form.aula || "—",
        resumo: form.resumo,
        observacao: form.observacao,
        situacao: form.situacao,
      },
      ...prev,
    ]);
    showToast("success", "Acompanhamento registrado com sucesso!");
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, situacao: "DELETADO" as Status } : a));
    setConfirmDelete(null);
    showToast("success", "Acompanhamento excluído.");
  };

  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
  const inputClass = (f: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 transition-all ${errors[f] ? "border-red-300 bg-red-50/50" : "border-gray-200"}`;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir acompanhamento" description="Este registro será removido definitivamente." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <h3 className="text-gray-900">Acompanhamento</h3>
              </div>
              <button onClick={() => setViewItem(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><span className="text-gray-400 text-xs">Data</span><div className="font-medium text-gray-800 mt-0.5">{fmt(viewItem.data)}</div></div>
                <div><span className="text-gray-400 text-xs">Situação</span><div className="mt-0.5"><StatusBadge status={viewItem.situacao} size="sm" /></div></div>
                <div><span className="text-gray-400 text-xs">Aluno</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.aluno}</div></div>
                <div><span className="text-gray-400 text-xs">Turma</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.turma}</div></div>
                <div className="sm:col-span-2"><span className="text-gray-400 text-xs">Profissional</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.profissional}</div></div>
                <div className="sm:col-span-2"><span className="text-gray-400 text-xs">Resumo</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.resumo}</div></div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Observação</span>
                <p className="mt-1.5 p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed">{viewItem.observacao}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>Novo Acompanhamento</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Data *</label>
                  <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} className={inputClass("data")} />
                  {errors.data && <p className="text-xs text-red-500 mt-1">{errors.data}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Aluno *</label>
                  <select value={form.aluno} onChange={e => setForm(f => ({ ...f, aluno: e.target.value }))} className={inputClass("aluno")}>
                    <option value="">Selecione um aluno...</option>
                    {["João Paulo Silva", "Maria Clara Oliveira", "Pedro Henrique Costa", "Ana Beatriz Ferreira", "Lucas Rodrigues Martins", "Isabela Nunes Pereira", "Thais Carvalho Dias"].map(a => <option key={a}>{a}</option>)}
                  </select>
                  {errors.aluno && <p className="text-xs text-red-500 mt-1">{errors.aluno}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Profissional *</label>
                  <select value={form.profissional} onChange={e => setForm(f => ({ ...f, profissional: e.target.value }))} className={inputClass("profissional")}>
                    <option value="">Selecione o profissional...</option>
                    <option>Carlos Eduardo Lima</option>
                    <option>Fernanda Souza Gomes</option>
                    <option>Rafael Alves Santos</option>
                  </select>
                  {errors.profissional && <p className="text-xs text-red-500 mt-1">{errors.profissional}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Aula (opcional)</label>
                  <select value={form.aula} onChange={e => setForm(f => ({ ...f, aula: e.target.value }))} className={inputClass("aula")}>
                    <option value="">Selecione a aula...</option>
                    <option>02/06/2026 – Futebol Sub-12 A – 08:00</option>
                    <option>04/06/2026 – Futebol Sub-12 A – 08:00</option>
                    <option>02/06/2026 – Vôlei Feminino A – 14:00</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Resumo</label>
                  <input value={form.resumo} onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))} className={inputClass("resumo")} placeholder="Título breve do acompanhamento..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Observação Detalhada *</label>
                  <textarea
                    value={form.observacao}
                    onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))}
                    className={`${inputClass("observacao")} resize-none leading-relaxed`}
                    rows={6}
                    placeholder="Descreva detalhadamente o acompanhamento realizado..."
                  />
                  {errors.observacao && <p className="text-xs text-red-500 mt-1">{errors.observacao}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Situação</label>
                  <div className="flex gap-4">
                    {(["ATIVO", "INATIVO"] as const).map(s => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={form.situacao === s} onChange={() => setForm(f => ({ ...f, situacao: s }))} className="accent-blue-600" />
                        <span className={`text-sm ${s === "ATIVO" ? "text-green-700" : "text-orange-600"}`}>{s === "ATIVO" ? "Ativo" : "Inativo"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "var(--brand)" }}>
                <Save className="w-4 h-4" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Acompanhamentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 self-start sm:self-auto flex-shrink-0" style={{ background: "var(--brand)" }}>
          <Plus className="w-4 h-4" /> Novo Acompanhamento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
          <div className="relative lg:flex-1 w-full min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por aluno ou resumo..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <select value={filterProfissional} onChange={e => setFilterProfissional(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Profissional</option>
            {profissionais.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterTurma} onChange={e => setFilterTurma(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Turma</option>
            {turmas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterSituacao} onChange={e => setFilterSituacao(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Situação</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Nenhum acompanhamento encontrado.
          </div>
        ) : filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="text-sm text-gray-500">{fmt(a.data)}</div>
              <StatusBadge status={a.situacao} size="sm" />
            </div>
            <div className="text-sm font-medium text-gray-800">{a.aluno}</div>
            <div className="text-sm text-gray-600 mt-1">{a.profissional}</div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{a.resumo}</p>
            <div className="flex items-center gap-1 justify-end mt-4 pt-4 border-t border-gray-100">
              <button type="button" title="Visualizar" onClick={() => setViewItem(a)} className={actionBtn}><Eye className="w-4 h-4" /></button>
              <button type="button" title="Excluir" onClick={() => setConfirmDelete(a.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Data</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Aluno</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Profissional</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Resumo</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Situação</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm whitespace-nowrap">Nenhum acompanhamento encontrado.</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(a.data)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{a.aluno}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{a.profissional}</td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate whitespace-nowrap">{a.resumo}</td>
                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={a.situacao} /></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 justify-end">
                    <button type="button" title="Visualizar" onClick={() => setViewItem(a)} className={actionBtn}><Eye className="w-4 h-4" /></button>
                    <button type="button" title="Excluir" onClick={() => setConfirmDelete(a.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
