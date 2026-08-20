import { useState } from "react";
import { ChevronLeft, Save, X } from "lucide-react";
import { Toast, useToast } from "../shared/Toast";
import type { Screen } from "../layout/Sidebar";
import type { Person } from "../data/mockData";

interface PessoaFormScreenProps {
  onNavigate: (screen: Screen) => void;
  editData?: Person | null;
}

export function PessoaFormScreen({ onNavigate, editData }: PessoaFormScreenProps) {
  const isEdit = !!editData;
  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    nome: editData?.nome ?? "",
    dataNascimento: editData?.dataNascimento ?? "",
    cpf: editData?.cpf ?? "",
    telefone: editData?.telefone ?? "",
    email: editData?.email ?? "",
    cep: editData?.cep ?? "",
    logradouro: editData?.logradouro ?? "",
    numero: editData?.numero ?? "",
    bairro: editData?.bairro ?? "",
    cidade: editData?.cidade ?? "",
    escola: editData?.escola ?? "",
    escolaridade: editData?.escolaridade ?? "",
    categoria: editData?.categoria ?? "",
    situacao: editData?.situacao ?? "ATIVO",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.cpf.trim()) e.cpf = "CPF é obrigatório";
    if (!form.email.trim()) e.email = "E-mail é obrigatório";
    if (!form.categoria) e.categoria = "Categoria é obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    showToast("success", isEdit ? "Cadastro atualizado com sucesso!" : "Pessoa cadastrada com sucesso!");
    setTimeout(() => onNavigate("pessoas"), 1500);
  };

  const Field = ({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputClass = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 transition-all ${errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"}`;

  return (
    <div className="p-4 lg:p-6 max-w-4xl">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("pessoas")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900">{isEdit ? "Editar Pessoa" : "Nova Pessoa"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEdit ? `Editando: ${editData?.nome}` : "Preencha os dados para cadastrar uma nova pessoa"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
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

        {/* Endereço */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
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

        {/* Dados Complementares */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
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

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => onNavigate("pessoas")} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <X className="w-4 h-4" /> Cancelar
          </button>
          <button type="submit" className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-all" style={{ background: "#0F4C81" }}>
            <Save className="w-4 h-4" /> {isEdit ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
