import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Clock, Eye, Users2 } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { DetailModal, ViewField, actionBtn, actionBtnDanger } from "../shared/DetailModal";
import { mockTurmas, type Turma, type Status } from "../data/mockData";

interface TurmasScreenProps {
  searchQuery?: string;
}

export function TurmasScreen({ searchQuery = "" }: TurmasScreenProps) {
  const [turmas, setTurmas] = useState<Turma[]>(mockTurmas);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Turma | null>(null);
  const [form, setForm] = useState({ nome: "", modalidade: "", periodoLetivo: "", horarioInicio: "", horarioFim: "", diaSemana: "", situacao: "ATIVO" as Status });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewItem, setViewItem] = useState<Turma | null>(null);
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterModalidade, setFilterModalidade] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const active = turmas.filter(
    t =>
      t.situacao !== "DELETADO" &&
      (!filterSituacao || t.situacao === filterSituacao) &&
      (!filterModalidade || t.modalidade === filterModalidade) &&
      (!q ||
        t.nome.toLowerCase().includes(q) ||
        t.modalidade.toLowerCase().includes(q) ||
        t.periodoLetivo.toLowerCase().includes(q) ||
        t.diaSemana.toLowerCase().includes(q) ||
        t.horario.toLowerCase().includes(q))
  );
  const modalidades = [...new Set(mockTurmas.map(t => t.modalidade))];

  const splitHorario = (h: string) => {
    const [inicio = "", fim = ""] = h.split(/[–-]/).map(s => s.trim());
    return { horarioInicio: inicio, horarioFim: fim };
  };

  const openNew = () => { setEditItem(null); setForm({ nome: "", modalidade: "", periodoLetivo: "", horarioInicio: "", horarioFim: "", diaSemana: "", situacao: "ATIVO" }); setErrors({}); setShowForm(true); };
  const openEdit = (t: Turma) => {
    const { horarioInicio, horarioFim } = splitHorario(t.horario);
    setEditItem(t);
    setForm({ nome: t.nome, modalidade: t.modalidade, periodoLetivo: t.periodoLetivo, horarioInicio, horarioFim, diaSemana: t.diaSemana, situacao: t.situacao });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.modalidade) e.modalidade = "Selecione uma modalidade";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const horario = [form.horarioInicio, form.horarioFim].filter(Boolean).join(" – ");
    const payload = { ...form, horario };
    if (editItem) {
      setTurmas(prev => prev.map(t => t.id === editItem.id ? { ...t, nome: payload.nome, modalidade: payload.modalidade, periodoLetivo: payload.periodoLetivo, horario: payload.horario, diaSemana: payload.diaSemana, situacao: payload.situacao } : t));
      showToast("success", "Turma atualizada!");
    } else {
      setTurmas(prev => [...prev, { id: Date.now(), nome: payload.nome, modalidade: payload.modalidade, periodoLetivo: payload.periodoLetivo, horario: payload.horario, diaSemana: payload.diaSemana, situacao: payload.situacao }]);
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

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
          <select value={filterModalidade} onChange={e => setFilterModalidade(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Modalidade</option>
            {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterSituacao} onChange={e => setFilterSituacao(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Situação</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
      </div>

      <DetailModal open={!!viewItem} title="Turma" icon={<Users2 className="w-5 h-5 text-blue-600" />} onClose={() => setViewItem(null)}>
        {viewItem && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ViewField label="Nome" className="sm:col-span-2">{viewItem.nome}</ViewField>
            <ViewField label="Modalidade">{viewItem.modalidade}</ViewField>
            <ViewField label="Situação"><StatusBadge status={viewItem.situacao} size="sm" /></ViewField>
            <ViewField label="Período letivo">{viewItem.periodoLetivo}</ViewField>
            <ViewField label="Horário">{viewItem.horario}</ViewField>
            <ViewField label="Dias" className="sm:col-span-2">{viewItem.diaSemana}</ViewField>
          </div>
        )}
      </DetailModal>

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
            <div className="flex items-center gap-1 justify-end mt-4 pt-4 border-t border-gray-100">
              <button type="button" title="Visualizar" onClick={() => setViewItem(t)} className={actionBtn}><Eye className="w-4 h-4" /></button>
              <button type="button" title="Editar" onClick={() => openEdit(t)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
              <button type="button" title="Excluir" onClick={() => setConfirmDelete(t.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
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
                      <button type="button" title="Visualizar" onClick={() => setViewItem(t)} className={actionBtn}><Eye className="w-4 h-4" /></button>
                      <button type="button" title="Editar" onClick={() => openEdit(t)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
                      <button type="button" title="Excluir" onClick={() => setConfirmDelete(t.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Horário Início</label>
                <input type="time" value={form.horarioInicio} onChange={e => setForm(f => ({ ...f, horarioInicio: e.target.value }))} className={inputClass("horarioInicio")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Horário Fim</label>
                <input type="time" value={form.horarioFim} onChange={e => setForm(f => ({ ...f, horarioFim: e.target.value }))} className={inputClass("horarioFim")} />
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
