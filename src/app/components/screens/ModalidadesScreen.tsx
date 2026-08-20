import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Dumbbell } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
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
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const active = modalidades.filter(
    m => m.situacao !== "DELETADO" && (!q || m.modalidade.toLowerCase().includes(q) || m.descricao.toLowerCase().includes(q))
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Modalidades Esportivas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{active.length} modalidade{active.length !== 1 ? "s" : ""} encontrada{active.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "#0F4C81" }}>
          <Plus className="w-4 h-4" /> Nova Modalidade
        </button>
      </div>

      {/* Cards grid */}
      {active.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
          Nenhuma modalidade encontrada{searchQuery ? ` para "${searchQuery}"` : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => openEdit(m)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Edit2 className="w-3 h-3" /> Editar
                </button>
                <button onClick={() => setConfirmDelete(m.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3 h-3" /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view too */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-gray-700">Lista Completa</h3>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Modalidade</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Descrição</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Situação</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {active.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">Nenhum registro encontrado.</td></tr>
            ) : (
              active.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.modalidade}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{m.descricao}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.situacao} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(m)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmDelete(m.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
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
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "#0F4C81" }}>
                <Save className="w-4 h-4" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
