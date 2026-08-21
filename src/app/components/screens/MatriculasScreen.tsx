import { useState } from "react";
import { Plus, Search, Edit2, ClipboardList, X, Save, History } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { Toast, useToast } from "../shared/Toast";
import { mockPessoas, mockTurmas, mockMatriculas, type Matricula, type Status } from "../data/mockData";

interface MatriculasScreenProps {
  searchQuery?: string;
}

const emptyForm = { aluno: "", turma: "", situacao: "ATIVO" as Status };

export function MatriculasScreen({ searchQuery = "" }: MatriculasScreenProps) {
  const [search, setSearch] = useState("");
  const [matriculas, setMatriculas] = useState<Matricula[]>(mockMatriculas);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Matricula | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [historyAluno, setHistoryAluno] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const effectiveSearch = (search || searchQuery).trim().toLowerCase();
  const alunos = mockPessoas.filter(p => p.categoria === "Aluno" && p.situacao === "ATIVO");
  const turmasAtivas = mockTurmas.filter(t => t.situacao === "ATIVO");

  const filtered = matriculas.filter(
    m =>
      m.situacao !== "DELETADO" &&
      (!effectiveSearch ||
        m.aluno.toLowerCase().includes(effectiveSearch) ||
        m.turma.toLowerCase().includes(effectiveSearch) ||
        m.modalidade.toLowerCase().includes(effectiveSearch))
  );

  const openNew = () => {
    setEditItem(null);
    setForm(emptyForm);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (m: Matricula) => {
    setEditItem(m);
    setForm({ aluno: m.aluno, turma: m.turma, situacao: m.situacao });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.aluno) e.aluno = "Aluno é obrigatório";
    if (!form.turma) e.turma = "Turma é obrigatória";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const turma = turmasAtivas.find(t => t.nome === form.turma);
    const modalidade = turma?.modalidade ?? editItem?.modalidade ?? "";

    const duplicada = matriculas.some(
      m =>
        m.id !== editItem?.id &&
        m.aluno === form.aluno &&
        m.turma === form.turma &&
        m.situacao === "ATIVO"
    );
    if (duplicada) {
      showToast("error", "Aluno já matriculado nesta turma.");
      return;
    }

    if (editItem) {
      setMatriculas(prev => prev.map(m => m.id === editItem.id ? { ...m, aluno: form.aluno, turma: form.turma, modalidade, situacao: form.situacao } : m));
      showToast("success", "Matrícula atualizada!");
    } else {
      setMatriculas(prev => [{
        id: Date.now(),
        aluno: form.aluno,
        turma: form.turma,
        modalidade,
        dataMatricula: new Date().toISOString().split("T")[0],
        situacao: form.situacao,
      }, ...prev]);
      showToast("success", `${form.aluno} matriculado(a) em ${form.turma}!`);
    }
    setShowForm(false);
  };

  const historicoAluno = historyAluno
    ? matriculas
        .filter(m => m.aluno === historyAluno && m.situacao !== "DELETADO")
        .slice()
        .sort((a, b) => b.dataMatricula.localeCompare(a.dataMatricula))
    : [];
  const alunoHistorico = historyAluno
    ? mockPessoas.find(p => p.nome === historyAluno)
    : null;

  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
  const inputClass = (f: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 ${errors[f] ? "border-red-300" : "border-gray-200"}`;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-gray-900">Matrículas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} matrícula{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 self-start sm:self-auto flex-shrink-0" style={{ background: "var(--brand)" }}>
          <Plus className="w-4 h-4" /> Nova Matrícula
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por aluno, turma ou modalidade..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        <div className="px-1 flex items-center gap-2 text-gray-800">
          <ClipboardList className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">Todas as Matrículas</span>
        </div>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Nenhuma matrícula encontrada.
          </div>
        ) : filtered.map(m => (
          <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800">{m.aluno}</div>
                <div className="text-sm text-gray-600 mt-1">{m.turma}</div>
                <span className="inline-block mt-1.5 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">{m.modalidade}</span>
              </div>
              <StatusBadge status={m.situacao} size="sm" />
            </div>
            <div className="text-sm text-gray-500">{fmt(m.dataMatricula)}</div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button title="Histórico" onClick={() => setHistoryAluno(m.aluno)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <History className="w-3.5 h-3.5" /> Histórico
              </button>
              <button title="Editar" onClick={() => openEdit(m)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-gray-400" /> Todas as Matrículas
          </h3>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Aluno</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Turma</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Modalidade</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Data</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Situação</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm whitespace-nowrap">Nenhuma matrícula encontrada.</td></tr>
            ) : filtered.map(m => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{m.aluno}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{m.turma}</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">{m.modalidade}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{fmt(m.dataMatricula)}</td>
                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={m.situacao} /></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 justify-end">
                    <button title="Histórico" onClick={() => setHistoryAluno(m.aluno)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <History className="w-3.5 h-3.5" />
                    </button>
                    <button title="Editar" onClick={() => openEdit(m)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {historyAluno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setHistoryAluno(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>Histórico de Matrículas</h3>
              <button onClick={() => setHistoryAluno(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: "var(--brand)" }}>
                {historyAluno.split(" ").slice(0, 2).map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 truncate">{historyAluno}</div>
                <div className="text-xs text-gray-400">{alunoHistorico ? `${alunoHistorico.escola} · ${alunoHistorico.categoria}` : "Aluno"}</div>
              </div>
            </div>
            {historicoAluno.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Nenhuma matrícula encontrada.</p>
            ) : (
              <div className="space-y-2">
                {historicoAluno.map(m => (
                  <div key={m.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{m.turma}</div>
                      <div className="text-xs text-gray-400">{m.modalidade} · {fmt(m.dataMatricula)}</div>
                    </div>
                    <StatusBadge status={m.situacao} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3>{editItem ? "Editar Matrícula" : "Nova Matrícula"}</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Aluno *</label>
                <select value={form.aluno} onChange={e => setForm(f => ({ ...f, aluno: e.target.value }))} className={inputClass("aluno")}>
                  <option value="">Selecione...</option>
                  {alunos.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
                  {editItem && !alunos.some(a => a.nome === editItem.aluno) && (
                    <option value={editItem.aluno}>{editItem.aluno}</option>
                  )}
                </select>
                {errors.aluno && <p className="text-xs text-red-500 mt-1">{errors.aluno}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma *</label>
                <select value={form.turma} onChange={e => setForm(f => ({ ...f, turma: e.target.value }))} className={inputClass("turma")}>
                  <option value="">Selecione...</option>
                  {turmasAtivas.map(t => <option key={t.id} value={t.nome}>{t.nome}</option>)}
                  {editItem && !turmasAtivas.some(t => t.nome === editItem.turma) && (
                    <option value={editItem.turma}>{editItem.turma}</option>
                  )}
                </select>
                {errors.turma && <p className="text-xs text-red-500 mt-1">{errors.turma}</p>}
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
