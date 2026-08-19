import { useState } from "react";
import { Search, ClipboardList, CheckCircle, User } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { Toast, useToast } from "../shared/Toast";
import { mockPessoas, mockTurmas, mockMatriculas, type Matricula } from "../data/mockData";

export function MatriculasScreen() {
  const [search, setSearch] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<typeof mockPessoas[0] | null>(null);
  const [matriculas, setMatriculas] = useState<Matricula[]>(mockMatriculas);
  const [selectedTurma, setSelectedTurma] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const alunos = mockPessoas.filter(p => p.categoria === "Aluno" && p.situacao === "ATIVO");
  const filteredAlunos = alunos.filter(a =>
    !search || a.nome.toLowerCase().includes(search.toLowerCase()) || a.cpf.includes(search)
  );

  const turmasAtivas = mockTurmas.filter(t => t.situacao === "ATIVO");

  const historicoAluno = selectedAluno
    ? matriculas.filter(m => m.aluno === selectedAluno.nome)
    : [];

  const turmasMatriculado = historicoAluno.filter(m => m.situacao === "ATIVO").map(m => m.turma);

  const handleMatricular = () => {
    if (!selectedAluno || !selectedTurma) return;
    const turma = turmasAtivas.find(t => t.id === selectedTurma);
    if (!turma) return;

    if (turmasMatriculado.includes(turma.nome)) {
      showToast("error", "Aluno já matriculado nesta turma.");
      return;
    }

    const nova: Matricula = {
      id: Date.now(),
      aluno: selectedAluno.nome,
      turma: turma.nome,
      modalidade: turma.modalidade,
      dataMatricula: new Date().toISOString().split("T")[0],
      situacao: "ATIVO",
    };
    setMatriculas(prev => [nova, ...prev]);
    showToast("success", `${selectedAluno.nome} matriculado(a) em ${turma.nome}!`);
    setSelectedTurma(null);
  };

  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("pt-BR");

  return (
    <div className="p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div>
        <h1 className="text-gray-900">Matrículas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Busque um aluno e selecione a turma para realizar a matrícula</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: busca aluno */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-gray-800 mb-3">Buscar Aluno</h3>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Nome ou CPF do aluno..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {filteredAlunos.map(a => (
                <button
                  key={a.id}
                  onClick={() => { setSelectedAluno(a); setSelectedTurma(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${selectedAluno?.id === a.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"}`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: "#0F4C81" }}>
                    {a.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{a.nome}</div>
                    <div className="text-xs text-gray-400">{a.escola}</div>
                  </div>
                  {selectedAluno?.id === a.id && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                </button>
              ))}
              {filteredAlunos.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">Nenhum aluno encontrado.</div>
              )}
            </div>
          </div>

          {/* Turmas disponíveis */}
          {selectedAluno && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-gray-800 mb-3">Turmas Disponíveis</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {turmasAtivas.map(t => {
                  const jaMatriculado = turmasMatriculado.includes(t.nome);
                  return (
                    <button
                      key={t.id}
                      onClick={() => !jaMatriculado && setSelectedTurma(t.id)}
                      disabled={jaMatriculado}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left border transition-all ${
                        jaMatriculado ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100" :
                        selectedTurma === t.id ? "bg-blue-50 border-blue-200" :
                        "hover:bg-gray-50 border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800">{t.nome}</div>
                        <div className="text-xs text-gray-400">{t.modalidade} · {t.horario} · {t.diaSemana}</div>
                      </div>
                      {jaMatriculado && <span className="text-xs text-gray-400 flex-shrink-0">Matriculado</span>}
                      {!jaMatriculado && selectedTurma === t.id && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleMatricular}
                disabled={!selectedTurma}
                className="w-full mt-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#0F4C81" }}
              >
                Realizar Matrícula
              </button>
            </div>
          )}
        </div>

        {/* Right: histórico */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {selectedAluno ? (
            <>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "#0F4C81" }}>
                    {selectedAluno.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{selectedAluno.nome}</div>
                    <div className="text-xs text-gray-400">{selectedAluno.escola} · {selectedAluno.categoria}</div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-gray-700 mb-3 text-sm font-semibold">Histórico de Matrículas</h4>
                {historicoAluno.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">Nenhuma matrícula encontrada.</div>
                ) : (
                  <div className="space-y-2">
                    {historicoAluno.map(m => (
                      <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{m.turma}</div>
                          <div className="text-xs text-gray-400">{m.modalidade} · {fmt(m.dataMatricula)}</div>
                        </div>
                        <StatusBadge status={m.situacao} size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <User className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Selecione um aluno para ver o histórico</p>
            </div>
          )}
        </div>
      </div>

      {/* All Matriculas */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-gray-400" /> Todas as Matrículas
          </h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Aluno</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Turma</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Modalidade</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Data</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {matriculas.filter(m => m.situacao !== "DELETADO").map(m => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.aluno}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.turma}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">{m.modalidade}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{fmt(m.dataMatricula)}</td>
                <td className="px-4 py-3"><StatusBadge status={m.situacao} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
