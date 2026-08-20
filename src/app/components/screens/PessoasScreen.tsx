import { useState } from "react";
import { Plus, Search, Edit2, Eye, UserX, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { mockPessoas, type Person, type Status } from "../data/mockData";
import type { Screen } from "../layout/Sidebar";

interface PessoasScreenProps {
  onNavigate: (screen: Screen, data?: unknown) => void;
  searchQuery?: string;
}

export function PessoasScreen({ onNavigate, searchQuery = "" }: PessoasScreenProps) {
  const [pessoas, setPessoas] = useState<Person[]>(mockPessoas);
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterEscola, setFilterEscola] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmInativar, setConfirmInativar] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const effectiveSearch = (search || searchQuery).trim().toLowerCase();

  const filtered = pessoas.filter(p => {
    if (p.situacao === "DELETADO") return false;
    if (
      effectiveSearch &&
      !p.nome.toLowerCase().includes(effectiveSearch) &&
      !p.cpf.includes(effectiveSearch) &&
      !p.escola.toLowerCase().includes(effectiveSearch) &&
      !p.categoria.toLowerCase().includes(effectiveSearch) &&
      !p.email.toLowerCase().includes(effectiveSearch) &&
      !p.telefone.includes(effectiveSearch)
    )
      return false;
    if (filterCategoria && p.categoria !== filterCategoria) return false;
    if (filterEscola && p.escola !== filterEscola) return false;
    if (filterSituacao && p.situacao !== filterSituacao) return false;
    return true;
  });

  const categorias = [...new Set(mockPessoas.map(p => p.categoria))];
  const escolas = [...new Set(mockPessoas.filter(p => p.escola !== "—").map(p => p.escola))];

  const handleDelete = (id: number) => {
    setPessoas(prev => prev.map(p => p.id === id ? { ...p, situacao: "DELETADO" as Status } : p));
    setConfirmDelete(null);
    showToast("success", "Registro excluído com sucesso.");
  };

  const handleInativar = (id: number) => {
    setPessoas(prev => prev.map(p => p.id === id ? { ...p, situacao: p.situacao === "ATIVO" ? "INATIVO" : "ATIVO" } : p));
    setConfirmInativar(null);
    showToast("success", "Situação atualizada com sucesso.");
  };

  const toInativar = confirmInativar ? pessoas.find(p => p.id === confirmInativar) : null;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
      <ConfirmModal
        open={confirmDelete !== null}
        title="Excluir registro"
        description="Esta ação não poderá ser desfeita. O registro será marcado como excluído."
        confirmLabel="Excluir"
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
      <ConfirmModal
        open={confirmInativar !== null}
        title={toInativar?.situacao === "ATIVO" ? "Inativar pessoa" : "Reativar pessoa"}
        description={toInativar?.situacao === "ATIVO" ? "O cadastro desta pessoa será inativado." : "O cadastro desta pessoa será reativado."}
        confirmLabel={toInativar?.situacao === "ATIVO" ? "Inativar" : "Reativar"}
        confirmVariant="warning"
        onConfirm={() => confirmInativar && handleInativar(confirmInativar)}
        onCancel={() => setConfirmInativar(null)}
      />

      {/* Title + Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Pessoas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} registro{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => onNavigate("pessoa-form", null)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
          style={{ background: "#0F4C81" }}
        >
          <Plus className="w-4 h-4" /> Nova Pessoa
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50"
            />
          </div>
          <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-36">
            <option value="">Categoria</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterEscola} onChange={e => setFilterEscola(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-52">
            <option value="">Escola</option>
            {escolas.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={filterSituacao} onChange={e => setFilterSituacao(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-32">
            <option value="">Situação</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
          {(search || filterCategoria || filterEscola || filterSituacao) && (
            <button onClick={() => { setSearch(""); setFilterCategoria(""); setFilterEscola(""); setFilterSituacao(""); }} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Nome</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Categoria</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Escola</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Telefone</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">E-mail</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">CPF</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Situação</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">Nenhum registro encontrado.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: "#0F4C81" }}>
                        {p.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">{p.categoria}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-44 truncate">{p.escola}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.telefone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-44 truncate">{p.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{p.cpf}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.situacao} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button title="Visualizar" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button title="Editar" onClick={() => onNavigate("pessoa-form", p)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button title={p.situacao === "ATIVO" ? "Inativar" : "Reativar"} onClick={() => setConfirmInativar(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors">
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                      <button title="Excluir" onClick={() => setConfirmDelete(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Exibindo {filtered.length} de {filtered.length} registros</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded font-medium">1</span>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30" disabled>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
