import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, CalendarDays, LayoutGrid, List } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { mockPeriodos, type AcademicPeriod, type Status } from "../data/mockData";

interface PeriodosScreenProps {
  searchQuery?: string;
}

export function PeriodosScreen({ searchQuery = "" }: PeriodosScreenProps) {
  const [periodos, setPeriodos] = useState<AcademicPeriod[]>(mockPeriodos);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<AcademicPeriod | null>(null);
  const [form, setForm] = useState({ anoSemestre: "", dataInicio: "", dataFim: "", situacao: "ATIVO" as Status });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [view, setView] = useState<"cards" | "tabela">("cards");
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const active = periodos.filter(
    p => p.situacao !== "DELETADO" && (!q || p.anoSemestre.toLowerCase().includes(q) || p.dataInicio.includes(q) || p.dataFim.includes(q))
  );

  const openNew = () => { setEditItem(null); setForm({ anoSemestre: "", dataInicio: "", dataFim: "", situacao: "ATIVO" }); setErrors({}); setShowForm(true); };
  const openEdit = (p: AcademicPeriod) => { setEditItem(p); setForm({ anoSemestre: p.anoSemestre, dataInicio: p.dataInicio, dataFim: p.dataFim, situacao: p.situacao }); setErrors({}); setShowForm(true); };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.anoSemestre.trim()) e.anoSemestre = "Campo obrigatório";
    if (!form.dataInicio) e.dataInicio = "Campo obrigatório";
    if (!form.dataFim) e.dataFim = "Campo obrigatório";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (editItem) {
      setPeriodos(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p));
      showToast("success", "Período atualizado!");
    } else {
      setPeriodos(prev => [...prev, { id: Date.now(), ...form }]);
      showToast("success", "Período cadastrado!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setPeriodos(prev => prev.map(p => p.id === id ? { ...p, situacao: "DELETADO" as Status } : p));
    setConfirmDelete(null);
    showToast("success", "Período excluído.");
  };

  const fmt = (d: string) => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";
  const inputClass = (f: string) => `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 ${errors[f] ? "border-red-300" : "border-gray-200"}`;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir período" description="O período letivo será removido." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Períodos Letivos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{active.length} período{active.length !== 1 ? "s" : ""} encontrado{active.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <div className="hidden lg:flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button type="button" onClick={() => setView("cards")} className={`w-9 h-9 flex items-center justify-center ${view === "cards" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:bg-gray-50"}`} title="Cards">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setView("tabela")} className={`w-9 h-9 flex items-center justify-center ${view === "tabela" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:bg-gray-50"}`} title="Tabela">
              <List className="w-4 h-4" />
            </button>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "var(--brand)" }}>
            <Plus className="w-4 h-4" /> Novo Período
          </button>
        </div>
      </div>

      <div className={view === "tabela" ? "lg:hidden" : ""}>
        {active.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Nenhum período encontrado{searchQuery ? ` para "${searchQuery}"` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {active.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-800">{p.anoSemestre}</span>
                  </div>
                  <StatusBadge status={p.situacao} size="sm" />
                </div>
                <div className="text-xs text-gray-500 space-y-1 mt-3">
                  <div className="flex justify-between">
                    <span>Início:</span>
                    <span className="font-medium text-gray-700">{fmt(p.dataInicio)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fim:</span>
                    <span className="font-medium text-gray-700">{fmt(p.dataFim)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit2 className="w-3.5 h-3.5" /> Editar</button>
                  <button onClick={() => setConfirmDelete(p.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={view === "tabela" ? "hidden lg:block" : "hidden"}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ano/Semestre</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Data Início</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Data Fim</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Situação</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {active.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm whitespace-nowrap">Nenhum registro encontrado.</td></tr>
              ) : (
                active.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{p.anoSemestre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(p.dataInicio)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(p.dataFim)}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={p.situacao} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(p)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmDelete(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? "Editar Período" : "Novo Período Letivo"}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ano/Semestre *</label>
                <input value={form.anoSemestre} onChange={e => setForm(f => ({ ...f, anoSemestre: e.target.value }))} className={inputClass("anoSemestre")} placeholder="Ex: 2026/1°" />
                {errors.anoSemestre && <p className="text-xs text-red-500 mt-1">{errors.anoSemestre}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Data Início *</label>
                  <input type="date" value={form.dataInicio} onChange={e => setForm(f => ({ ...f, dataInicio: e.target.value }))} className={inputClass("dataInicio")} />
                  {errors.dataInicio && <p className="text-xs text-red-500 mt-1">{errors.dataInicio}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Data Fim *</label>
                  <input type="date" value={form.dataFim} onChange={e => setForm(f => ({ ...f, dataFim: e.target.value }))} className={inputClass("dataFim")} />
                  {errors.dataFim && <p className="text-xs text-red-500 mt-1">{errors.dataFim}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Situação</label>
                <div className="flex gap-4">
                  {(["ATIVO", "INATIVO"] as Status[]).map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={form.situacao === s} onChange={() => setForm(f => ({ ...f, situacao: s }))} className="accent-blue-600" />
                      <span className="text-sm text-gray-700">{s === "ATIVO" ? "Ativo" : "Inativo"}</span>
                    </label>
                  ))}
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
    </div>
  );
}
