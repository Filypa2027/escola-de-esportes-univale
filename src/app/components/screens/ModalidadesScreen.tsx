import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Dumbbell, LayoutGrid, List, Eye } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { DetailModal, ViewField, actionBtn, actionBtnDanger } from "../shared/DetailModal";
import { mockModalidades, type Modality, type Status } from "../data/mockData";

const modalityColors: Record<string, string> = {
  Futebol: "bg-green-100 text-green-700",
  Futsal: "bg-emerald-100 text-emerald-700",
  Vôlei: "bg-yellow-100 text-yellow-700",
  Basquete: "bg-orange-100 text-orange-700",
  Atletismo: "bg-blue-100 text-blue-700",
  Natação: "bg-cyan-100 text-cyan-700",
};

interface ModalidadesScreenProps {
  searchQuery?: string;
}

export function ModalidadesScreen({ searchQuery = "" }: ModalidadesScreenProps) {
  const [modalidades, setModalidades] = useState<Modality[]>(mockModalidades);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Modality | null>(null);
  const [form, setForm] = useState({ modalidade: "", descricao: "", situacao: "ATIVO" as Status });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [view, setView] = useState<"cards" | "tabela">("cards");
  const [viewItem, setViewItem] = useState<Modality | null>(null);
  const [filterSituacao, setFilterSituacao] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const active = modalidades.filter(
    m => m.situacao !== "DELETADO" && (!filterSituacao || m.situacao === filterSituacao) && (!q || m.modalidade.toLowerCase().includes(q) || m.descricao.toLowerCase().includes(q))
  );

  const openNew = () => { setEditItem(null); setForm({ modalidade: "", descricao: "", situacao: "ATIVO" }); setErrors({}); setShowForm(true); };
  const openEdit = (m: Modality) => { setEditItem(m); setForm({ modalidade: m.modalidade, descricao: m.descricao, situacao: m.situacao }); setErrors({}); setShowForm(true); };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.modalidade.trim()) e.modalidade = "Nome é obrigatório";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (editItem) {
      setModalidades(prev => prev.map(m => m.id === editItem.id ? { ...m, ...form } : m));
      showToast("success", "Modalidade atualizada!");
    } else {
      setModalidades(prev => [...prev, { id: Date.now(), ...form }]);
      showToast("success", "Modalidade cadastrada!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setModalidades(prev => prev.map(m => m.id === id ? { ...m, situacao: "DELETADO" as Status } : m));
    setConfirmDelete(null);
    showToast("success", "Modalidade excluída.");
  };

  const inputClass = (f: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 ${errors[f] ? "border-red-300" : "border-gray-200"}`;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir modalidade" description="A modalidade será removida." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Modalidades Esportivas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{active.length} modalidade{active.length !== 1 ? "s" : ""} encontrada{active.length !== 1 ? "s" : ""}</p>
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
            <Plus className="w-4 h-4" /> Nova Modalidade
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <select value={filterSituacao} onChange={e => setFilterSituacao(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value="">Situação</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
      </div>

      <DetailModal open={!!viewItem} title="Modalidade" icon={<Dumbbell className="w-5 h-5 text-blue-600" />} onClose={() => setViewItem(null)}>
        {viewItem && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ViewField label="Modalidade">{viewItem.modalidade}</ViewField>
              <ViewField label="Situação"><StatusBadge status={viewItem.situacao} size="sm" /></ViewField>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Descrição</span>
              <p className="mt-1.5 p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed">{viewItem.descricao || "—"}</p>
            </div>
          </>
        )}
      </DetailModal>

      <div className={view === "tabela" ? "lg:hidden" : ""}>
        {active.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm w-full">
            Nenhuma modalidade encontrada{searchQuery ? ` para "${searchQuery}"` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {active.map(m => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${modalityColors[m.modalidade] ?? "bg-gray-100 text-gray-700"}`}>
                    <Dumbbell className="w-3.5 h-3.5" />
                    {m.modalidade}
                  </div>
                  <StatusBadge status={m.situacao} size="sm" />
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{m.descricao}</p>
                <div className="flex items-center gap-1 justify-end mt-4 pt-4 border-t border-gray-100">
                  <button type="button" title="Visualizar" onClick={() => setViewItem(m)} className={actionBtn}><Eye className="w-4 h-4" /></button>
                  <button type="button" title="Editar" onClick={() => openEdit(m)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
                  <button type="button" title="Excluir" onClick={() => setConfirmDelete(m.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={view === "tabela" ? "hidden lg:block" : "hidden"}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Modalidade</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Descrição</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Situação</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {active.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm whitespace-nowrap">Nenhum registro encontrado.</td></tr>
              ) : (
                active.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{m.modalidade}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{m.descricao}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={m.situacao} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 justify-end">
                        <button type="button" title="Visualizar" onClick={() => setViewItem(m)} className={actionBtn}><Eye className="w-4 h-4" /></button>
                        <button type="button" title="Editar" onClick={() => openEdit(m)} className={actionBtn}><Edit2 className="w-4 h-4" /></button>
                        <button type="button" title="Excluir" onClick={() => setConfirmDelete(m.id)} className={actionBtnDanger}><Trash2 className="w-4 h-4" /></button>
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? "Editar Modalidade" : "Nova Modalidade"}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Modalidade *</label>
                <input value={form.modalidade} onChange={e => setForm(f => ({ ...f, modalidade: e.target.value }))} className={inputClass("modalidade")} placeholder="Ex: Futebol, Vôlei..." />
                {errors.modalidade && <p className="text-xs text-red-500 mt-1">{errors.modalidade}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} className={`${inputClass("descricao")} resize-none`} rows={3} placeholder="Descrição da modalidade..." />
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
