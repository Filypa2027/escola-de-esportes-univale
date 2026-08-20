import { useState } from "react";
import { CheckSquare, Save, BarChart2 } from "lucide-react";
import { Toast, useToast } from "../shared/Toast";
import { mockFrequencia } from "../data/mockData";

interface FrequenciaScreenProps {
  searchQuery?: string;
}

export function FrequenciaScreen({ searchQuery = "" }: FrequenciaScreenProps) {
  const [periodo, setPeriodo] = useState("2026/1°");
  const [modalidade, setModalidade] = useState("Futebol");
  const [turma, setTurma] = useState("Futebol Sub-12 A");
  const [aula, setAula] = useState("02/06/2026 – 08:00");
  const [alunos, setAlunos] = useState(mockFrequencia.alunos);
  const [saved, setSaved] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();
  const displayedAlunos = alunos.filter(a => !q || a.nome.toLowerCase().includes(q));

  const togglePresenca = (id: number) => {
    setSaved(false);
    setAlunos(prev => prev.map(a => a.id === id ? { ...a, presente: !a.presente } : a));
  };

  const handleSave = () => {
    setSaved(true);
    showToast("success", "Chamada salva com sucesso!");
  };

  const totalPresentes = alunos.filter(a => a.presente).length;
  const pct = Math.round((totalPresentes / alunos.length) * 100);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div>
        <h1 className="text-gray-900">Controle de Frequência</h1>
        <p className="text-sm text-gray-500 mt-0.5">Selecione a turma e a aula para registrar a chamada</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="text-gray-800">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Período Letivo</label>
            <select value={periodo} onChange={e => setPeriodo(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>2025/2°</option>
              <option>2026/1°</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Modalidade</label>
            <select value={modalidade} onChange={e => setModalidade(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              {["Futebol", "Futsal", "Vôlei", "Basquete", "Atletismo"].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Turma</label>
            <select value={turma} onChange={e => setTurma(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>Futebol Sub-12 A</option>
              <option>Futebol Sub-14 B</option>
              <option>Vôlei Feminino A</option>
              <option>Basquete Misto</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Aula</label>
            <select value={aula} onChange={e => setAula(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>02/06/2026 – 08:00</option>
              <option>04/06/2026 – 08:00</option>
              <option>09/06/2026 – 08:00</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chamada */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-gray-800">{turma}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{aula}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setAlunos(prev => prev.map(a => ({ ...a, presente: true })))} className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                Todos presentes
              </button>
              <button onClick={() => setAlunos(prev => prev.map(a => ({ ...a, presente: false })))} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Todos ausentes
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {displayedAlunos.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Nenhum aluno encontrado{searchQuery ? ` para "${searchQuery}"` : ""}.</div>
            ) : (
              displayedAlunos.map((aluno, idx) => (
              <div key={aluno.id} className={`flex items-center gap-4 px-5 py-3 transition-colors ${aluno.presente ? "hover:bg-green-50/30" : "hover:bg-red-50/20"}`}>
                <span className="text-xs text-gray-300 w-5 text-right">{idx + 1}</span>
                <div className="flex-1 text-sm font-medium text-gray-800">{aluno.nome}</div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${aluno.presente ? "text-green-600" : "text-red-500"}`}>
                    {aluno.presente ? "Presente" : "Ausente"}
                  </span>
                  <button
                    onClick={() => togglePresenca(aluno.id)}
                    className={`w-10 h-6 rounded-full transition-all relative ${aluno.presente ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${aluno.presente ? "left-5" : "left-1"}`} />
                  </button>
                </div>
              </div>
            )))}
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">{totalPresentes} de {alunos.length} presentes</span>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-all"
              style={{ background: "var(--brand)" }}
            >
              <Save className="w-4 h-4" /> Salvar Chamada
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-800 mb-4">Resumo da Aula</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--brand)" strokeWidth="3" strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{pct}%</span>
                <span className="text-xs text-gray-400">Presença</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Presentes</span>
                <span className="font-medium text-green-600">{totalPresentes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ausentes</span>
                <span className="font-medium text-red-500">{alunos.length - totalPresentes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-medium text-gray-700">{alunos.length}</span>
              </div>
            </div>
            {saved && (
              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                <CheckSquare className="w-3.5 h-3.5" /> Chamada salva!
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-800 mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-gray-400" /> Histórico Recente
            </h3>
            <div className="space-y-2">
              {[
                { data: "02/06", pct: 87 },
                { data: "28/05", pct: 75 },
                { data: "26/05", pct: 100 },
                { data: "21/05", pct: 87 },
              ].map(h => (
                <div key={h.data} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-12">{h.data}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${h.pct}%`, background: h.pct >= 85 ? "#10B981" : h.pct >= 70 ? "#F59E0B" : "#EF4444" }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">{h.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
