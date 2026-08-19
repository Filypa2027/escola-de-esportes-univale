import { useState } from "react";
import { ChevronLeft, Save, X, Heart } from "lucide-react";
import { Toast, useToast } from "../shared/Toast";
import type { Screen } from "../layout/Sidebar";

interface AcompanhamentoFormScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function AcompanhamentoFormScreen({ onNavigate }: AcompanhamentoFormScreenProps) {
  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    data: new Date().toISOString().split("T")[0],
    aluno: "",
    profissional: "",
    aula: "",
    resumo: "",
    observacao: "",
    situacao: "ATIVO",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.data) e.data = "Data é obrigatória";
    if (!form.aluno) e.aluno = "Aluno é obrigatório";
    if (!form.profissional) e.profissional = "Profissional é obrigatório";
    if (!form.observacao.trim()) e.observacao = "Observação é obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    showToast("success", "Acompanhamento registrado com sucesso!");
    setTimeout(() => onNavigate("acompanhamentos"), 1500);
  };

  const inputClass = (f: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 transition-all ${errors[f] ? "border-red-300 bg-red-50/50" : "border-gray-200"}`;

  return (
    <div className="p-6 max-w-3xl">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("acompanhamentos")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Novo Acompanhamento
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Registre um acompanhamento pedagógico ou psicológico</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-gray-800 mb-4 pb-3 border-b border-gray-100">Dados do Acompanhamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data *</label>
              <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} className={inputClass("data")} />
              {errors.data && <p className="text-xs text-red-500 mt-1">{errors.data}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Aluno *</label>
              <select value={form.aluno} onChange={e => setForm(f => ({ ...f, aluno: e.target.value }))} className={inputClass("aluno")}>
                <option value="">Selecione um aluno...</option>
                {["João Paulo Silva", "Maria Clara Oliveira", "Pedro Henrique Costa", "Ana Beatriz Ferreira", "Lucas Rodrigues Martins", "Isabela Nunes Pereira", "Thais Carvalho Dias"].map(a => <option key={a}>{a}</option>)}
              </select>
              {errors.aluno && <p className="text-xs text-red-500 mt-1">{errors.aluno}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Profissional *</label>
              <select value={form.profissional} onChange={e => setForm(f => ({ ...f, profissional: e.target.value }))} className={inputClass("profissional")}>
                <option value="">Selecione o profissional...</option>
                <option>Carlos Eduardo Lima</option>
                <option>Fernanda Souza Gomes</option>
                <option>Rafael Alves Santos</option>
              </select>
              {errors.profissional && <p className="text-xs text-red-500 mt-1">{errors.profissional}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Aula (opcional)</label>
              <select value={form.aula} onChange={e => setForm(f => ({ ...f, aula: e.target.value }))} className={inputClass("aula")}>
                <option value="">Selecione a aula...</option>
                <option>02/06/2026 – Futebol Sub-12 A – 08:00</option>
                <option>04/06/2026 – Futebol Sub-12 A – 08:00</option>
                <option>02/06/2026 – Vôlei Feminino A – 14:00</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Resumo</label>
              <input value={form.resumo} onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))} className={inputClass("resumo")} placeholder="Título breve do acompanhamento..." />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-gray-800 mb-4 pb-3 border-b border-gray-100">Observações e Registro</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Observação Detalhada *</label>
            <textarea
              value={form.observacao}
              onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))}
              className={`${inputClass("observacao")} resize-none leading-relaxed`}
              rows={10}
              placeholder="Descreva detalhadamente o acompanhamento realizado, evolução do aluno, pontos observados, recomendações e próximos passos..."
            />
            {errors.observacao && <p className="text-xs text-red-500 mt-1">{errors.observacao}</p>}
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-400">Campo de texto longo para registros detalhados</p>
              <span className="text-xs text-gray-400">{form.observacao.length} caracteres</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Situação</label>
            <div className="flex gap-4">
              {(["ATIVO", "INATIVO"] as const).map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={form.situacao === s} onChange={() => setForm(f => ({ ...f, situacao: s }))} className="accent-blue-600" />
                  <span className={`text-sm ${s === "ATIVO" ? "text-green-700" : "text-orange-600"}`}>{s === "ATIVO" ? "Ativo" : "Inativo"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => onNavigate("acompanhamentos")} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <X className="w-4 h-4" /> Cancelar
          </button>
          <button type="submit" className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "#0F4C81" }}>
            <Save className="w-4 h-4" /> Salvar Acompanhamento
          </button>
        </div>
      </form>
    </div>
  );
}
