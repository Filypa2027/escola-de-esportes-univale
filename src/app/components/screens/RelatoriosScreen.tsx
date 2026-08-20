import { useState } from "react";
import { FileText, Download, Filter, BarChart3, Users, School, CalendarDays, TrendingUp, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Toast, useToast } from "../shared/Toast";
import { mockDashboard } from "../data/mockData";

const reports = [
  { id: "alunos-modalidade", label: "Alunos por Modalidade", icon: <BarChart3 className="w-4 h-4" />, category: "Alunos" },
  { id: "alunos-escola", label: "Alunos por Escola", icon: <School className="w-4 h-4" />, category: "Alunos" },
  { id: "matriculas-periodo", label: "Matrículas por Período", icon: <CalendarDays className="w-4 h-4" />, category: "Matrículas" },
  { id: "frequencia-turma", label: "Frequência por Turma", icon: <TrendingUp className="w-4 h-4" />, category: "Frequência" },
  { id: "frequencia-aluno", label: "Frequência por Aluno", icon: <Users className="w-4 h-4" />, category: "Frequência" },
  { id: "acomp-aluno", label: "Acompanhamentos por Aluno", icon: <Heart className="w-4 h-4" />, category: "Acompanhamentos" },
  { id: "acomp-profissional", label: "Acompanhamentos por Profissional", icon: <Heart className="w-4 h-4" />, category: "Acompanhamentos" },
];

const alunosPorEscola = [
  { escola: "E.M. São Paulo", alunos: 42 },
  { escola: "C.E. Centro", alunos: 28 },
  { escola: "C.P. Elite", alunos: 19 },
  { escola: "E.M. Norte", alunos: 23 },
  { escola: "E.M. Sul", alunos: 15 },
];

interface RelatoriosScreenProps {
  searchQuery?: string;
}

export function RelatoriosScreen({ searchQuery = "" }: RelatoriosScreenProps) {
  const [selectedReport, setSelectedReport] = useState("alunos-modalidade");
  const [periodo, setPeriodo] = useState("2026/1°");
  const [modalidade, setModalidade] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const q = searchQuery.trim().toLowerCase();

  const handleExport = (tipo: "PDF" | "Excel") => {
    showToast("success", `Relatório exportado como ${tipo} com sucesso!`);
  };

  const current = reports.find(r => r.id === selectedReport);
  const baseData = selectedReport === "alunos-modalidade" ? mockDashboard.alunosPorModalidade.map(d => ({ name: d.name, value: d.value }))
    : selectedReport === "alunos-escola" ? alunosPorEscola.map(d => ({ name: d.escola, value: d.alunos }))
    : selectedReport.includes("frequencia") ? mockDashboard.frequenciaPorTurma.map(d => ({ name: d.turma, value: d.frequencia }))
    : mockDashboard.evolucaoMatriculas.map(d => ({ name: d.mes, value: d.matriculas }));

  const chartData = q ? baseData.filter(d => d.name.toLowerCase().includes(q)) : baseData;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div>
        <h1 className="text-gray-900">Relatórios Gerenciais</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gere e exporte relatórios analíticos do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar: report list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-3">Tipos de Relatório</p>
          {["Alunos", "Matrículas", "Frequência", "Acompanhamentos"].map(cat => {
            const catReports = reports.filter(r => r.category === cat && (!q || r.label.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)));
            if (catReports.length === 0) return null;
            return (
              <div key={cat}>
                <p className="text-xs text-gray-300 uppercase tracking-wider px-2 pt-3 pb-1 font-semibold">{cat}</p>
                {catReports.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReport(r.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${selectedReport === r.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span className={selectedReport === r.id ? "text-blue-600" : "text-gray-400"}>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtros Avançados</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Período Letivo</label>
                <select value={periodo} onChange={e => setPeriodo(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>2025/2°</option>
                  <option>2026/1°</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Modalidade</label>
                <select value={modalidade} onChange={e => setModalidade(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="">Todas</option>
                  {["Futebol", "Futsal", "Vôlei", "Basquete", "Atletismo"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Início</label>
                <input type="date" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Fim</label>
                <input type="date" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-gray-800">{current?.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Período: {periodo} {modalidade && `· ${modalidade}`}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleExport("PDF")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={() => handleExport("Excel")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Excel
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0F4C81" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Dados do Relatório
              </h3>
              <button onClick={() => handleExport("Excel")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                <Download className="w-3.5 h-3.5" /> Exportar tabela
              </button>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Item</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Valor</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {chartData.map((row, i) => {
                  const total = chartData.reduce((s, r) => s + r.value, 0);
                  const pct = ((row.value / total) * 100).toFixed(1);
                  return (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">{row.value}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#0F4C81" }} />
                          </div>
                          <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
