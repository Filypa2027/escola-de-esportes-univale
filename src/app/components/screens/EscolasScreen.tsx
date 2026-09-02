import { useState } from "react";
import { Plus, Edit2, Trash2, Search, X, Save, Eye, School as SchoolIcon } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { DetailModal, ViewField, actionBtn, actionBtnDanger } from "../shared/DetailModal";
import { mockEscolas, type School, type Status } from "../data/mockData";

interface EscolasScreenProps {
  searchQuery?: string;
}

export function EscolasScreen({ searchQuery = "" }: EscolasScreenProps) {
  const [escolas, setEscolas] = useState<School[]>(mockEscolas);
  const [search, setSearch] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [viewItem, setViewItem] = useState<School | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<School | null>(null);
  const [form, setForm] = useState({ nome: "", cnpj: "", situacao: "ATIVO" as Status });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast, showToast, hideToast } = useToast();

  const effectiveSearch = (search || searchQuery).trim().toLowerCase();
  const filtered = escolas.filter(
    e =>
      e.situacao !== "DELETADO" &&
      (!filterSituacao || e.situacao === filterSituacao) &&
      (!effectiveSearch || e.nome.toLowerCase().includes(effectiveSearch) || e.cnpj.includes(effectiveSearch))
  );

  const openNew = () => { setEditItem(null); setForm({ nome: "", cnpj: "", situacao: "ATIVO" }); setErrors({}); setShowForm(true); };
  const openEdit = (e: School) => { setEditItem(e); setForm({ nome: e.nome, cnpj: e.cnpj, situacao: e.situacao }); setErrors({}); setShowForm(true); };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (editItem) {
      setEscolas(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form } : s));
      showToast("success", "Escola atualizada com sucesso!");
    } else {
      setEscolas(prev => [...prev, { id: Date.now(), ...form }]);
      showToast("success", "Escola cadastrada com sucesso!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setEscolas(prev => prev.map(s => s.id === id ? { ...s, situacao: "DELETADO" as Status } : s));
    setConfirmDelete(null);
    showToast("success", "Escola excluída com sucesso.");
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 ${errors[field] ? "border-red-300" : "border-gray-200"}`;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir escola" description="A escola será excluída permanentemente." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Escolas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} escola{filtered.length !== 1 ? "s" : ""} cadastrada{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 self-start sm:self-auto flex-shrink-0" style={{ background: "var(--brand)" }}>
          <Plus className="w-4 h-4" /> Nova Escola
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">{editItem ? "Editar Escola" : "Nova Escola"}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Escola *</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className={inputClass("nome")} placeholder="Nome completo da escola" />
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CNPJ</label>
                <input value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} className={inputClass("cnpj")} placeholder="00.000.000/0001-00 (opcional)" />
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

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
          <div className="relative lg:flex-1 w-full min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou CNPJ..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <select value={filterSituacao} onChange={e => setFilterSituacao(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Situação</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
      </div>

      <DetailModal open={!!viewItem} title="Escola" icon={<SchoolIcon className="w-5 h-5 text-blue-600" />} onClose={() => setViewItem(null)}>
        {viewItem && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ViewField label="Nome" className="sm:col-span-2">{viewItem.nome}</ViewField>
            <ViewField label="CNPJ">{viewItem.cnpj || "—"}</ViewField>
            <ViewField label="Situação"><StatusBadge status={viewItem.situacao} size="sm" /></ViewField>
          </div>
        )}
      </DetailModal>

      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Nenhuma escola encontrada.
          </div>
        ) : filtered.map(e => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="text-sm font-medium text-gray-800 min-w-0">{e.nome}</div>
              <StatusBadge status={e.situacao} size="sm" />
            </div>
            <div className="text-sm text-gray-500 font-mono">{e.cnpj}</div>
            <div className="flex items-center gap-1 justify-end mt-4 pt-4 border-t border-gray-100">
              <button type="button" title="Visualizar" onClick={() => setViewItem(e)} className={actionBtn}><Eye className="w-4 h-4" /></button>
              <button type="button" title="Editar" onClick={() => openEdit(e)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
              <button type="button" title="Excluir" onClick={() => setConfirmDelete(e.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Nome</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">CNPJ</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Situação</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400 text-sm whitespace-nowrap">Nenhuma escola encontrada.</td></tr>
            ) : filtered.map(e => (
              <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{e.nome}</td>
                <td className="px-4 py-3 text-sm text-gray-500 font-mono whitespace-nowrap">{e.cnpj}</td>
                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={e.situacao} /></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 justify-end">
                    <button type="button" title="Visualizar" onClick={() => setViewItem(e)} className={actionBtn}><Eye className="w-4 h-4" /></button>
                    <button type="button" title="Editar" onClick={() => openEdit(e)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
                    <button type="button" title="Excluir" onClick={() => setConfirmDelete(e.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
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
