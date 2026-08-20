import { useState } from "react";
import { Plus, Search, Eye, Trash2, Heart, X } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { mockAcompanhamentos, type Acompanhamento, type Status } from "../data/mockData";
import type { Screen } from "../layout/Sidebar";

interface AcompanhamentosScreenProps {
  onNavigate: (screen: Screen, data?: unknown) => void;
  searchQuery?: string;
}

export function AcompanhamentosScreen({ onNavigate, searchQuery = "" }: AcompanhamentosScreenProps) {
  const [items, setItems] = useState<Acompanhamento[]>(mockAcompanhamentos);
  const [search, setSearch] = useState("");
  const [filterProfissional, setFilterProfissional] = useState("");
  const [filterTurma, setFilterTurma] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<Acompanhamento | null>(null);
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
      (!filterTurma || a.turma === filterTurma)
  );

  const profissionais = [...new Set(mockAcompanhamentos.map(a => a.profissional))];
  const turmas = [...new Set(mockAcompanhamentos.map(a => a.turma))];

  const handleDelete = (id: number) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, situacao: "DELETADO" as Status } : a));
    setConfirmDelete(null);
    showToast("success", "Acompanhamento excluído.");
  };

  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("pt-BR");

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal open={confirmDelete !== null} title="Excluir acompanhamento" description="Este registro será removido definitivamente." confirmLabel="Excluir" onConfirm={() => confirmDelete && handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <h3 className="text-gray-900">Acompanhamento</h3>
              </div>
              <button onClick={() => setViewItem(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-400 text-xs">Data</span><div className="font-medium text-gray-800 mt-0.5">{fmt(viewItem.data)}</div></div>
                <div><span className="text-gray-400 text-xs">Situação</span><div className="mt-0.5"><StatusBadge status={viewItem.situacao} size="sm" /></div></div>
                <div><span className="text-gray-400 text-xs">Aluno</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.aluno}</div></div>
                <div><span className="text-gray-400 text-xs">Turma</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.turma}</div></div>
                <div className="col-span-2"><span className="text-gray-400 text-xs">Profissional</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.profissional}</div></div>
                <div className="col-span-2"><span className="text-gray-400 text-xs">Resumo</span><div className="font-medium text-gray-800 mt-0.5">{viewItem.resumo}</div></div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Observação</span>
                <p className="mt-1.5 p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed">{viewItem.observacao}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Acompanhamentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => onNavigate("acompanhamento-form", null)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "#0F4C81" }}>
          <Plus className="w-4 h-4" /> Novo Acompanhamento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por aluno ou resumo..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <select value={filterProfissional} onChange={e => setFilterProfissional(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-44">
            <option value="">Profissional</option>
            {profissionais.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterTurma} onChange={e => setFilterTurma(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-44">
            <option value="">Turma</option>
            {turmas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Data</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Aluno</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Profissional</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Resumo</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Situação</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(a.data)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.aluno}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{a.profissional}</td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{a.resumo}</td>
                <td className="px-4 py-3"><StatusBadge status={a.situacao} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => setViewItem(a)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setConfirmDelete(a.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Nenhum acompanhamento encontrado.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
