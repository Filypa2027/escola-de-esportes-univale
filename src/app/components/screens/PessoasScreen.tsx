import { useState } from "react";
import { Plus, Search, Edit2, Eye, UserX, Trash2, ChevronLeft, ChevronRight, X, Save } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmModal } from "../shared/ConfirmModal";
import { Toast, useToast } from "../shared/Toast";
import { mockPessoas, type Person, type Status } from "../data/mockData";

interface PessoasScreenProps {
  searchQuery?: string;
}

const emptyForm = {
  nome: "",
  dataNascimento: "",
  cpf: "",
  telefone: "",
  email: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  escola: "",
  escolaridade: "",
  categoria: "",
  situacao: "ATIVO" as Status,
};

const Field = ({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export function PessoasScreen({ searchQuery = "" }: PessoasScreenProps) {
  const [pessoas, setPessoas] = useState<Person[]>(mockPessoas);
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterEscola, setFilterEscola] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmInativar, setConfirmInativar] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Person | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const openNew = () => {
    setEditItem(null);
    setForm(emptyForm);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (p: Person) => {
    setEditItem(p);
    setForm({
      nome: p.nome,
      dataNascimento: p.dataNascimento,
      cpf: p.cpf,
      telefone: p.telefone,
      email: p.email,
      cep: p.cep,
      logradouro: p.logradouro,
      numero: p.numero,
      bairro: p.bairro,
      cidade: p.cidade,
      escola: p.escola === "—" ? "" : p.escola,
      escolaridade: p.escolaridade,
      categoria: p.categoria,
      situacao: p.situacao,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.cpf.trim()) e.cpf = "CPF é obrigatório";
    if (!form.email.trim()) e.email = "E-mail é obrigatório";
    if (!form.categoria) e.categoria = "Categoria é obrigatória";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (editItem) {
      setPessoas(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form, escola: form.escola || "—" } : p));
      showToast("success", "Cadastro atualizado com sucesso!");
    } else {
      setPessoas(prev => [...prev, { id: Date.now(), ...form, escola: form.escola || "—" }]);
      showToast("success", "Pessoa cadastrada com sucesso!");
    }
    setShowForm(false);
  };

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

  const inputClass = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 transition-all ${errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"}`;

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Pessoas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} registro{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 self-start sm:self-auto flex-shrink-0"
          style={{ background: "var(--brand)" }}
        >
          <Plus className="w-4 h-4" /> Nova Pessoa
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
          <div className="relative lg:flex-1 w-full min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50"
            />
          </div>
          <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Categoria</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterEscola} onChange={e => setFilterEscola(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Escola</option>
            {escolas.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={filterSituacao} onChange={e => setFilterSituacao(e.target.value)} className="w-full min-w-0 lg:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Situação</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
          {(search || filterCategoria || filterEscola || filterSituacao) && (
            <button onClick={() => { setSearch(""); setFilterCategoria(""); setFilterEscola(""); setFilterSituacao(""); }} className="w-full sm:w-auto px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Nenhum registro encontrado.
          </div>
        ) : filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: "var(--brand)" }}>
                  {p.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{p.nome}</div>
                  <span className="inline-block mt-1 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">{p.categoria}</span>
                </div>
              </div>
              <StatusBadge status={p.situacao} size="sm" />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="truncate">{p.escola}</div>
              <div>{p.telefone}</div>
            </div>
            <div className="flex items-center gap-1 justify-end mt-4 pt-4 border-t border-gray-100">
              <button title="Visualizar" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button title="Editar" onClick={() => openEdit(p)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button title={p.situacao === "ATIVO" ? "Inativar" : "Reativar"} onClick={() => setConfirmInativar(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors">
                <UserX className="w-3.5 h-3.5" />
              </button>
              <button title="Excluir" onClick={() => setConfirmDelete(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
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
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Nome</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Categoria</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Escola</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Telefone</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">E-mail</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">CPF</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Situação</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm whitespace-nowrap">Nenhum registro encontrado.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: "var(--brand)" }}>
                        {p.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">{p.categoria}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-44 truncate whitespace-nowrap">{p.escola}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{p.telefone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-44 truncate whitespace-nowrap">{p.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono whitespace-nowrap">{p.cpf}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={p.situacao} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <button title="Visualizar" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button title="Editar" onClick={() => openEdit(p)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
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
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? "Editar Pessoa" : "Nova Pessoa"}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <h2 className="text-gray-800 mb-4 pb-3 border-b border-gray-100">Dados Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nome completo *" id="nome" error={errors.nome}>
                    <input id="nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className={inputClass("nome")} placeholder="Nome completo" />
                  </Field>
                  <Field label="Data de Nascimento" id="dataNascimento">
                    <input id="dataNascimento" type="date" value={form.dataNascimento} onChange={e => setForm(f => ({ ...f, dataNascimento: e.target.value }))} className={inputClass("dataNascimento")} />
                  </Field>
                  <Field label="CPF *" id="cpf" error={errors.cpf}>
                    <input id="cpf" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} className={inputClass("cpf")} placeholder="000.000.000-00" />
                  </Field>
                  <Field label="Telefone" id="telefone">
                    <input id="telefone" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} className={inputClass("telefone")} placeholder="(00) 00000-0000" />
                  </Field>
                  <Field label="E-mail *" id="email" error={errors.email}>
                    <input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass("email")} placeholder="email@exemplo.com" />
                  </Field>
                </div>
              </div>

              <div>
                <h2 className="text-gray-800 mb-4 pb-3 border-b border-gray-100">Endereço</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="CEP" id="cep">
                    <input id="cep" value={form.cep} onChange={e => setForm(f => ({ ...f, cep: e.target.value }))} className={inputClass("cep")} placeholder="00000-000" />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Logradouro" id="logradouro">
                      <input id="logradouro" value={form.logradouro} onChange={e => setForm(f => ({ ...f, logradouro: e.target.value }))} className={inputClass("logradouro")} placeholder="Rua, Avenida..." />
                    </Field>
                  </div>
                  <Field label="Número" id="numero">
                    <input id="numero" value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} className={inputClass("numero")} placeholder="Nº" />
                  </Field>
                  <Field label="Bairro" id="bairro">
                    <input id="bairro" value={form.bairro} onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))} className={inputClass("bairro")} placeholder="Bairro" />
                  </Field>
                  <Field label="Cidade" id="cidade">
                    <input id="cidade" value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} className={inputClass("cidade")} placeholder="Cidade" />
                  </Field>
                </div>
              </div>

              <div>
                <h2 className="text-gray-800 mb-4 pb-3 border-b border-gray-100">Dados Complementares</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Escola" id="escola">
                    <select id="escola" value={form.escola} onChange={e => setForm(f => ({ ...f, escola: e.target.value }))} className={inputClass("escola")}>
                      <option value="">Selecione...</option>
                      <option>Escola Municipal São Paulo</option>
                      <option>Colégio Estadual Centro</option>
                      <option>Colégio Particular Elite</option>
                      <option>Escola Municipal Norte</option>
                      <option>Instituto Educacional Novo Horizonte</option>
                    </select>
                  </Field>
                  <Field label="Escolaridade" id="escolaridade">
                    <select id="escolaridade" value={form.escolaridade} onChange={e => setForm(f => ({ ...f, escolaridade: e.target.value }))} className={inputClass("escolaridade")}>
                      <option value="">Selecione...</option>
                      <option>Ensino Fundamental</option>
                      <option>Ensino Médio</option>
                      <option>Superior Completo</option>
                      <option>Pós-Graduação</option>
                    </select>
                  </Field>
                  <Field label="Categoria *" id="categoria" error={errors.categoria}>
                    <select id="categoria" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className={inputClass("categoria")}>
                      <option value="">Selecione...</option>
                      <option>Aluno</option>
                      <option>Professor</option>
                      <option>Psicóloga</option>
                      <option>Coordenador</option>
                      <option>Assistente Administrativo</option>
                      <option>Gestor</option>
                    </select>
                  </Field>
                  <Field label="Situação" id="situacao">
                    <div className="flex gap-3 mt-1">
                      {(["ATIVO", "INATIVO"] as const).map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="situacao" value={s} checked={form.situacao === s} onChange={() => setForm(f => ({ ...f, situacao: s }))} className="accent-blue-600" />
                          <span className={`text-sm ${s === "ATIVO" ? "text-green-700" : "text-orange-600"}`}>{s === "ATIVO" ? "Ativo" : "Inativo"}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
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
