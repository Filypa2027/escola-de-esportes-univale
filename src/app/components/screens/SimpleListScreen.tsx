import { useState } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import type { Status } from "../data/mockData";

interface SimpleListScreenProps {
  title: string;
  description: string;
  items: { id: number; nome: string; situacao: Status }[];
  columns?: { key: string; label: string }[];
}

const defaultEscolaridades = [
  { id: 1, nome: "Educação Infantil", situacao: "ATIVO" as Status },
  { id: 2, nome: "Ensino Fundamental I", situacao: "ATIVO" as Status },
  { id: 3, nome: "Ensino Fundamental II", situacao: "ATIVO" as Status },
  { id: 4, nome: "Ensino Médio", situacao: "ATIVO" as Status },
  { id: 5, nome: "Superior Completo", situacao: "ATIVO" as Status },
  { id: 6, nome: "Pós-Graduação", situacao: "ATIVO" as Status },
];

const defaultCategorias = [
  { id: 1, nome: "Aluno", situacao: "ATIVO" as Status },
  { id: 2, nome: "Professor", situacao: "ATIVO" as Status },
  { id: 3, nome: "Psicólogo", situacao: "ATIVO" as Status },
  { id: 4, nome: "Coordenador", situacao: "ATIVO" as Status },
  { id: 5, nome: "Assistente Administrativo", situacao: "ATIVO" as Status },
  { id: 6, nome: "Gestor", situacao: "ATIVO" as Status },
];

interface Props {
  screen: "escolaridade" | "categorias";
  searchQuery?: string;
}

export function SimpleListScreen({ screen, searchQuery = "" }: Props) {
  const isEscolaridade = screen === "escolaridade";
  const initialItems = isEscolaridade ? defaultEscolaridades : defaultCategorias;

  const [items, setItems] = useState(initialItems);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<{ id: number; nome: string; situacao: Status } | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formSituacao, setFormSituacao] = useState<Status>("ATIVO");
  const [error, setError] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const title = isEscolaridade ? "Escolaridade" : "Categorias de Pessoa";
  const label = isEscolaridade ? "escolaridade" : "categoria";

  const openNew = () => { setEditItem(null); setFormNome(""); setFormSituacao("ATIVO"); setError(""); setShowForm(true); };
  const openEdit = (item: typeof items[0]) => { setEditItem(item); setFormNome(item.nome); setFormSituacao(item.situacao); setError(""); setShowForm(true); };

  const handleSave = () => {
    if (!formNome.trim()) { setError(`Nome da ${label} é obrigatório`); return; }
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, nome: formNome, situacao: formSituacao } : i));
      showToast("success", `${title} atualizado!`);
    } else {
      setItems(prev => [...prev, { id: Date.now(), nome: formNome, situacao: formSituacao }]);
      showToast("success", `${title} cadastrado!`);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setConfirmDelete(null);
    showToast("success", "Item excluído.");
  };

  const q = searchQuery.trim().toLowerCase();
  const active = items.filter(i => i.situacao !== "DELETADO" && (!q || i.nome.toLowerCase().includes(q)));

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title={`Excluir ${label}`} description="Este item será removido." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{active.length} item{active.length !== 1 ? "ns" : ""} encontrado{active.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "#0F4C81" }}>
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-lg">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Nome</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Situação</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {active.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-sm">Nenhum item encontrado{searchQuery ? ` para "${searchQuery}"` : ""}.</td></tr>
            ) : (
              active.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.nome}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.situacao} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(item)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmDelete(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? `Editar ${label}` : `Novo(a) ${label}`}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome *</label>
                <input value={formNome} onChange={e => { setFormNome(e.target.value); setError(""); }} className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${error ? "border-red-300" : "border-gray-200"}`} placeholder="Nome..." />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Situação</label>
                <div className="flex gap-4">
                  {(["ATIVO", "INATIVO"] as Status[]).map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={formSituacao === s} onChange={() => setFormSituacao(s)} className="accent-blue-600" />
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
