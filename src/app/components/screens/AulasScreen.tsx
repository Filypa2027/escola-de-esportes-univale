import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Clock, BookOpen } from "lucide-react";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { mockAulas, type Aula } from "../data/mockData";

interface AulasScreenProps {
  searchQuery?: string;
}

export function AulasScreen({ searchQuery = "" }: AulasScreenProps) {
  const [aulas, setAulas] = useState<Aula[]>(mockAulas);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Aula | null>(null);
  const [form, setForm] = useState({ turma: "", data: "", horarioInicio: "", horarioFim: "", descricao: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const filtered = aulas.filter(
    a =>
      !q ||
      a.turma.toLowerCase().includes(q) ||
      a.descricao.toLowerCase().includes(q) ||
      a.data.includes(q) ||
      a.horarioInicio.includes(q) ||
      a.horarioFim.includes(q)
  );

  const openNew = () => { setEditItem(null); setForm({ turma: "", data: "", horarioInicio: "", horarioFim: "", descricao: "" }); setErrors({}); setShowForm(true); };
  const openEdit = (a: Aula) => { setEditItem(a); setForm({ turma: a.turma, data: a.data, horarioInicio: a.horarioInicio, horarioFim: a.horarioFim, descricao: a.descricao }); setErrors({}); setShowForm(true); };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.turma) e.turma = "Selecione uma turma";
    if (!form.data) e.data = "Data é obrigatória";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (editItem) {
      setAulas(prev => prev.map(a => a.id === editItem.id ? { ...a, ...form } : a));
      showToast("success", "Aula atualizada!");
    } else {
      setAulas(prev => [...prev, { id: Date.now(), ...form }]);
      showToast("success", "Aula cadastrada!");
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

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir aula" description="Esta aula será removida definitivamente." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Aulas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} aula{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "var(--brand)" }}>
          <Plus className="w-4 h-4" /> Nova Aula
        </button>
      </div>

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
                  <BookOpen className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-400 font-medium">{fmt(a.data)}</span>
              </div>
              <div className="font-semibold text-gray-800 text-sm">{a.turma}</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                <Clock className="w-3.5 h-3.5" />
                {a.horarioInicio} – {a.horarioFim}
              </div>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2">{a.descricao}</p>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(a)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit2 className="w-3.5 h-3.5" /> Editar</button>
                <button onClick={() => setConfirmDelete(a.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Turma</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Data</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Horário Início</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Horário Fim</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Descrição</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">Nenhum registro encontrado.</td></tr>
            ) : (
              filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.turma}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fmt(a.data)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.horarioInicio}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.horarioFim}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{a.descricao}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(a)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmDelete(a.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? "Editar Aula" : "Nova Aula"}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} className={`${inputClass("descricao")} resize-none`} rows={3} placeholder="Descreva o conteúdo da aula..." />
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
