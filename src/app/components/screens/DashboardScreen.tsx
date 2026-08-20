import { Users, Users2, Trophy, TrendingUp, Heart, CheckCircle, UserPlus, BookOpen, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { mockDashboard } from "../data/mockData";

const COLORS = ["var(--brand)", "#10B981", "#F59E0B", "#6366F1", "#EC4899", "#14B8A6"];

const activityIcons: Record<string, React.ReactNode> = {
  check: <CheckCircle className="w-4 h-4 text-green-600" />,
  user: <UserPlus className="w-4 h-4 text-blue-600" />,
  heart: <Heart className="w-4 h-4 text-pink-600" />,
  book: <BookOpen className="w-4 h-4 text-purple-600" />,
};

const activityColors: Record<string, string> = {
  check: "bg-green-50",
  user: "bg-blue-50",
  heart: "bg-pink-50",
  book: "bg-purple-50",
};

interface DashboardScreenProps {
  searchQuery?: string;
}

export function DashboardScreen({ searchQuery = "" }: DashboardScreenProps) {
  const d = mockDashboard;
  const q = searchQuery.trim().toLowerCase();

  const filteredAtividades = d.ultimasAtividades.filter(
    act => !q || act.descricao.toLowerCase().includes(q) || act.usuario.toLowerCase().includes(q) || act.tipo.toLowerCase().includes(q)
  );
  const filteredModalidades = q ? d.alunosPorModalidade.filter(m => m.name.toLowerCase().includes(q)) : d.alunosPorModalidade;
  const filteredFrequencias = q ? d.frequenciaPorTurma.filter(f => f.turma.toLowerCase().includes(q)) : d.frequenciaPorTurma;

  const statCards = [
    { label: "Total de Alunos", value: d.totalAlunos, icon: <Users className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50", trend: "+8 este mês" },
    { label: "Total de Turmas", value: d.totalTurmas, icon: <Users2 className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50", trend: "+1 este semestre" },
    { label: "Modalidades", value: d.totalModalidades, icon: <Trophy className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50", trend: "Estável" },
    { label: "Frequência Média", value: `${d.frequenciaMedia}%`, icon: <TrendingUp className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-50", trend: "+2.1% vs mês anterior" },
    { label: "Acompanhamentos/mês", value: d.acompanhamentosMes, icon: <Heart className="w-5 h-5" />, color: "text-pink-600", bg: "bg-pink-50", trend: "Jun/2026" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vindo, Rafael. Aqui está o resumo de hoje — 12 de junho de 2026.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            <div className="text-[11px] text-gray-400 mt-1">{card.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alunos por modalidade */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-800 mb-1">Alunos por Modalidade</h3>
          <p className="text-xs text-gray-400 mb-4">Distribuição atual</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={filteredModalidades} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {filteredModalidades.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} alunos`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {filteredModalidades.map((m, i) => (
              <div key={m.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                {m.name} <span className="text-gray-400">({m.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frequência por turma */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-800 mb-1">Frequência por Turma</h3>
          <p className="text-xs text-gray-400 mb-4">Percentual — Junho 2026</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredFrequencias} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis type="category" dataKey="turma" tick={{ fontSize: 11, fill: "#6b7280" }} width={80} />
              <Tooltip formatter={(v: number) => [`${v}%`, "Frequência"]} />
              <Bar dataKey="frequencia" fill="var(--brand)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evolução de matrículas */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-800 mb-1">Evolução de Matrículas</h3>
          <p className="text-xs text-gray-400 mb-4">Novas matrículas por mês — 2026</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={d.evolucaoMatriculas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip formatter={(v: number) => [`${v} matrículas`]} />
              <Line type="monotone" dataKey="matriculas" stroke="var(--brand)" strokeWidth={2} dot={{ fill: "var(--brand)", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last Activities */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-800">Últimas Atividades</h3>
            <p className="text-xs text-gray-400 mt-0.5">{filteredAtividades.length} atividade{filteredAtividades.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="space-y-3">
          {filteredAtividades.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">Nenhuma atividade encontrada{searchQuery ? ` para "${searchQuery}"` : ""}.</div>
          ) : (
            filteredAtividades.map((act, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-lg ${activityColors[act.icon]} flex items-center justify-center flex-shrink-0`}>
                  {activityIcons[act.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 font-medium truncate">{act.descricao}</div>
                  <div className="text-xs text-gray-400">{act.usuario}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full">{act.tipo}</span>
                  <span className="text-xs text-gray-400">{act.tempo}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
