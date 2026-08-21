import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Clock } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { mockTurmas, type Turma, type Status } from "../data/mockData";

interface TurmasScreenProps {
  searchQuery?: string;
}

export function TurmasScreen({ searchQuery = "" }: TurmasScreenProps) {
  const [turmas, setTurmas] = useState<Turma[]>(mockTurmas);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Turma | null>(null);
  const [form, setForm] = useState({ nome: "", modalidade: "", periodoLetivo: "", horario: "", diaSemana: "", situacao: "ATIVO" as Status });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const active = turmas.filter(
    t =>
      t.situacao !== "DELETADO" &&
      (!q ||
        t.nome.toLowerCase().includes(q) ||
        t.modalidade.toLowerCase().includes(q) ||
        t.periodoLetivo.toLowerCase().includes(q) ||
        t.diaSemana.toLowerCase().includes(q) ||
        t.horario.toLowerCase().includes(q))
  );

  const openNew = () => { setEditItem(null); setForm({ nome: "", modalidade: "", periodoLetivo: "", horario: "", diaSemana: "", situacao: "ATIVO" }); setErrors({}); setShowForm(true); };
  const openEdit = (t: Turma) => { setEditItem(t); setForm({ nome: t.nome, modalidade: t.modalidade, periodoLetivo: t.periodoLetivo, horario: t.horario, diaSemana: t.diaSemana, situacao: t.situacao }); setErrors({}); setShowForm(true); };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.modalidade) e.modalidade = "Selecione uma modalidade";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (editItem) {
      setTurmas(prev => prev.map(t => t.id === editItem.id ? { ...t, ...form } : t));
      showToast("success", "Turma atualizada!");
    } else {
      setTurmas(prev => [...prev, { id: Date.now(), ...form }]);
      showToast("success", "Turma criada!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setTurmas(prev => prev.map(t => t.id === id ? { ...t, situacao: "DELETADO" as Status } : t));
    setConfirmDelete(null);
    showToast("success", "Turma excluída.");
  };

  const inputClass = (f: string) => `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 ${errors[f] ? "border-red-300" : "border-gray-200"}`;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir turma" description="A turma será excluída permanentemente." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Turmas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{active.length} turma{active.length !== 1 ? "s" : ""} encontrada{active.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 self-start sm:self-auto flex-shrink-0" style={{ background: "var(--brand)" }}>
          <Plus className="w-4 h-4" /> Nova Turma
        </button>
      </div>

      <div className="lg:hidden space-y-3">
        {active.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Nenhuma turma encontrada{searchQuery ? ` para "${searchQuery}"` : ""}.
          </div>
        ) : active.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-800">{t.nome}</div>
                <span className="inline-block mt-1.5 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">{t.modalidade}</span>
              </div>
              <StatusBadge status={t.situacao} size="sm" />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{t.periodoLetivo}</div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                {t.horario}
              </div>
              <div className="text-gray-500">{t.diaSemana}</div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => openEdit(t)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit2 className="w-3 h-3" /> Editar
              </button>
              <button onClick={() => setConfirmDelete(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-3 h-3" /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Nome da Turma</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Modalidade</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Período Letivo</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Horário</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Dias</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Situação</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {active.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm whitespace-nowrap">Nenhuma turma encontrada{searchQuery ? ` para "${searchQuery}"` : ""}.</td></tr>
            ) : (
              active.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{t.nome}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">{t.modalidade}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{t.periodoLetivo}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {t.horario}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{t.diaSemana}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={t.situacao} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(t)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmDelete(t.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? "Editar Turma" : "Nova Turma"}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Turma *</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className={inputClass("nome")} placeholder="Ex: Futebol Sub-12 A" />
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Modalidade *</label>
                <select value={form.modalidade} onChange={e => setForm(f => ({ ...f, modalidade: e.target.value }))} className={inputClass("modalidade")}>
                  <option value="">Selecione...</option>
                  {["Futebol", "Futsal", "Vôlei", "Basquete", "Atletismo", "Natação"].map(m => <option key={m}>{m}</option>)}
                </select>
                {errors.modalidade && <p className="text-xs text-red-500 mt-1">{errors.modalidade}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Período Letivo</label>
                <select value={form.periodoLetivo} onChange={e => setForm(f => ({ ...f, periodoLetivo: e.target.value }))} className={inputClass("periodoLetivo")}>
                  <option value="">Selecione...</option>
                  <option>2025/2°</option>
                  <option>2026/1°</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Horário</label>
                <input value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} className={inputClass("horario")} placeholder="Ex: 08:00 – 09:30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dia da Semana</label>
                <input value={form.diaSemana} onChange={e => setForm(f => ({ ...f, diaSemana: e.target.value }))} className={inputClass("diaSemana")} placeholder="Ex: Seg, Qua, Sex" />
              </div>
              <div className="sm:col-span-2">
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
