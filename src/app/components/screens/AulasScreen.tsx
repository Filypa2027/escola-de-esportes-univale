import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Clock, BookOpen, LayoutGrid, List, Eye } from "lucide-react";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { DetailModal, ViewField, actionBtn, actionBtnDanger } from "../shared/DetailModal";
import { mockAulas, mockTurmas, type Aula } from "../data/mockData";

interface AulasScreenProps {
  searchQuery?: string;
}

const emptyForm = { turma: "", data: "", horarioInicio: "", horarioFim: "", previsto: "", realizado: "" };

export function AulasScreen({ searchQuery = "" }: AulasScreenProps) {
  const [aulas, setAulas] = useState<Aula[]>(mockAulas);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState<Aula | null>(null);
  const [editItem, setEditItem] = useState<Aula | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [view, setView] = useState<"cards" | "tabela">("cards");
  const [filterTurma, setFilterTurma] = useState("");
  const [filterModalidade, setFilterModalidade] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const modalidadeOf = (turmaNome: string) => mockTurmas.find(t => t.nome === turmaNome)?.modalidade ?? "";

  const filtered = aulas.filter(a => {
    if (filterTurma && a.turma !== filterTurma) return false;
    if (filterModalidade && modalidadeOf(a.turma) !== filterModalidade) return false;
    if (
      q &&
      !a.turma.toLowerCase().includes(q) &&
      !a.previsto.toLowerCase().includes(q) &&
      !a.realizado.toLowerCase().includes(q) &&
      !a.data.includes(q) &&
      !a.horarioInicio.includes(q) &&
      !a.horarioFim.includes(q)
    )
      return false;
    return true;
  });

  const turmas = [...new Set(aulas.map(a => a.turma))];
  const modalidades = [...new Set(turmas.map(modalidadeOf).filter(Boolean))];

  const openNew = () => { setEditItem(null); setForm(emptyForm); setErrors({}); setShowForm(true); };
  const openEdit = (a: Aula) => {
    setEditItem(a);
    setForm({ turma: a.turma, data: a.data, horarioInicio: a.horarioInicio, horarioFim: a.horarioFim, previsto: a.previsto, realizado: a.realizado });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.turma) e.turma = "Selecione uma turma";
    if (!form.data) e.data = "Data é obrigatória";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (editItem) {
      setAulas(prev => prev.map(a => a.id === editItem.id ? { ...a, ...form } : a));
      showToast("success", "Plano de aula atualizado!");
    } else {
      setAulas(prev => [...prev, { id: Date.now(), ...form }]);
      showToast("success", "Plano de aula cadastrado!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setAulas(prev => prev.filter(a => a.id !== id));
    setConfirmDelete(null);
    showToast("success", "Aula excluída.");
  };

  const fmt = (d: string) => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";
  const inputClass = (f: string) => `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 ${errors[f] ? "border-red-300" : "border-gray-200"}`;
  const filterClass = "w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir aula" description="Esta aula será removida definitivamente." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      <DetailModal open={!!viewItem} title="Plano de Aula" icon={<BookOpen className="w-5 h-5 text-blue-600" />} onClose={() => setViewItem(null)}>
        {viewItem && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ViewField label="Turma">{viewItem.turma}</ViewField>
              <ViewField label="Modalidade">{modalidadeOf(viewItem.turma) || "—"}</ViewField>
              <ViewField label="Data">{fmt(viewItem.data)}</ViewField>
              <ViewField label="Horário">{viewItem.horarioInicio} – {viewItem.horarioFim}</ViewField>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Previsto</span>
              <p className="mt-1.5 p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed">{viewItem.previsto || "—"}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Realizado</span>
              <p className="mt-1.5 p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed">{viewItem.realizado || "—"}</p>
            </div>
          </>
        )}
      </DetailModal>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Plano de Aulas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} aula{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>
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
            <Plus className="w-4 h-4" /> Nova Aula
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
          <select value={filterModalidade} onChange={e => setFilterModalidade(e.target.value)} className={filterClass}>
            <option value="">Todas as modalidades</option>
            {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterTurma} onChange={e => setFilterTurma(e.target.value)} className={filterClass}>
            <option value="">Todas as turmas</option>
            {turmas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className={view === "tabela" ? "lg:hidden" : ""}>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Nenhuma aula encontrada{searchQuery ? ` para "${searchQuery}"` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{fmt(a.data)}</span>
                </div>
                <div className="font-semibold text-gray-800 text-sm">{a.turma}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {a.horarioInicio} – {a.horarioFim}
                </div>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2">{a.previsto}</p>
                <div className="flex items-center gap-1 justify-end mt-4 pt-3 border-t border-gray-100">
                  <button type="button" title="Visualizar" onClick={() => setViewItem(a)} className={actionBtn}><Eye className="w-4 h-4" /></button>
                  <button type="button" title="Editar" onClick={() => openEdit(a)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
                  <button type="button" title="Excluir" onClick={() => setConfirmDelete(a.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
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
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Turma</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Data</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Horário</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Previsto</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Realizado</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm whitespace-nowrap">Nenhum registro encontrado.</td></tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{a.turma}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(a.data)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{a.horarioInicio} – {a.horarioFim}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate whitespace-nowrap">{a.previsto}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate whitespace-nowrap">{a.realizado || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 justify-end">
                        <button type="button" title="Visualizar" onClick={() => setViewItem(a)} className={actionBtn}><Eye className="w-4 h-4" /></button>
                        <button type="button" title="Editar" onClick={() => openEdit(a)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
                        <button type="button" title="Excluir" onClick={() => setConfirmDelete(a.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
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
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? "Editar Aula" : "Nova Aula"}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma *</label>
                <select value={form.turma} onChange={e => setForm(f => ({ ...f, turma: e.target.value }))} className={inputClass("turma")}>
                  <option value="">Selecione...</option>
                  {["Futebol Sub-12 A", "Futebol Sub-14 B", "Vôlei Feminino A", "Basquete Misto", "Futsal Sub-10"].map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.turma && <p className="text-xs text-red-500 mt-1">{errors.turma}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Data *</label>
                <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} className={inputClass("data")} />
                {errors.data && <p className="text-xs text-red-500 mt-1">{errors.data}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Horário Início</label>
                <input type="time" value={form.horarioInicio} onChange={e => setForm(f => ({ ...f, horarioInicio: e.target.value }))} className={inputClass("horarioInicio")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Horário Fim</label>
                <input type="time" value={form.horarioFim} onChange={e => setForm(f => ({ ...f, horarioFim: e.target.value }))} className={inputClass("horarioFim")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Previsto</label>
                <textarea value={form.previsto} onChange={e => setForm(f => ({ ...f, previsto: e.target.value }))} className={`${inputClass("previsto")} resize-none`} rows={3} placeholder="O que está previsto para a aula..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Realizado</label>
                <textarea value={form.realizado} onChange={e => setForm(f => ({ ...f, realizado: e.target.value }))} className={`${inputClass("realizado")} resize-none`} rows={3} placeholder="O que foi realizado na aula..." />
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
