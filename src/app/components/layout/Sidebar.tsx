import {
  LayoutDashboard, Users, School, GraduationCap, Tag, Trophy, CalendarDays, Users2,
  ClipboardList, BookOpen, CheckSquare, Heart, BarChart3, ChevronDown, ChevronRight, Dumbbell
} from "lucide-react";
import { useState } from "react";

export type Screen =
  | "login" | "dashboard"
  | "pessoas"
  | "escolas" | "escola-form"
  | "escolaridade" | "categorias"
  | "modalidades" | "periodos" | "turmas"
  | "matriculas" | "aulas" | "frequencia" | "acompanhamentos"
  | "relatorios" | "configuracoes";

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  children: { label: string; screen: Screen; icon: React.ReactNode }[];
}

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navGroups: NavGroup[] = [
  {
    label: "Cadastros",
    icon: <Users className="w-4 h-4" />,
    children: [
      { label: "Pessoas", screen: "pessoas", icon: <Users className="w-4 h-4" /> },
      { label: "Escolas", screen: "escolas", icon: <School className="w-4 h-4" /> },
      { label: "Escolaridade", screen: "escolaridade", icon: <GraduationCap className="w-4 h-4" /> },
      { label: "Categorias de Pessoa", screen: "categorias", icon: <Tag className="w-4 h-4" /> },
    ],
  },
  {
    label: "Esportes",
    icon: <Trophy className="w-4 h-4" />,
    children: [
      { label: "Modalidades", screen: "modalidades", icon: <Dumbbell className="w-4 h-4" /> },
      { label: "Períodos Letivos", screen: "periodos", icon: <CalendarDays className="w-4 h-4" /> },
      { label: "Turmas", screen: "turmas", icon: <Users2 className="w-4 h-4" /> },
    ],
  },
  {
    label: "Operacional",
    icon: <ClipboardList className="w-4 h-4" />,
    children: [
      { label: "Matrículas", screen: "matriculas", icon: <ClipboardList className="w-4 h-4" /> },
      { label: "Plano de Aulas", screen: "aulas", icon: <BookOpen className="w-4 h-4" /> },
      { label: "Frequência", screen: "frequencia", icon: <CheckSquare className="w-4 h-4" /> },
      { label: "Acompanhamentos", screen: "acompanhamentos", icon: <Heart className="w-4 h-4" /> },
    ],
  },
];

function SidebarContent({
  currentScreen,
  onNavigate,
  expanded,
  toggle,
}: {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  expanded: Record<string, boolean>;
  toggle: (label: string) => void;
}) {
  return (
    <>
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Escola de Esportes</div>
            <div className="text-white/50 text-xs">Sistema de Gestão</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => onNavigate("dashboard")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${currentScreen === "dashboard"
              ? "bg-white/15 text-white font-medium"
              : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        {navGroups.map(group => (
          <div key={group.label}>
            <button
              onClick={() => toggle(group.label)}
              className="w-full flex items-center justify-between px-3 py-1.5 mt-3 mb-1"
            >
              <span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">{group.label}</span>
              {expanded[group.label] ? (
                <ChevronDown className="w-3 h-3 text-white/30" />
              ) : (
                <ChevronRight className="w-3 h-3 text-white/30" />
              )}
            </button>
            {expanded[group.label] && (
              <div className="space-y-0.5">
                {group.children.map(item => (
                  <button
                    key={item.screen}
                    onClick={() => onNavigate(item.screen)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${currentScreen === item.screen
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-4 pt-3 border-t border-white/10 space-y-0.5">
          <button
            onClick={() => onNavigate("relatorios")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${currentScreen === "relatorios" ? "bg-white/15 text-white font-medium" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            Relatórios
          </button>
        </div>
      </nav>
    </>
  );
}

export function Sidebar({ currentScreen, onNavigate, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Cadastros: true, Esportes: true, Operacional: true,
  });

  const toggle = (label: string) => setExpanded(prev => ({ ...prev, [label]: !prev[label] }));

  const handleNavigate = (screen: Screen) => {
    onNavigate(screen);
    onMobileClose?.();
  };

  const contentProps = { currentScreen, onNavigate: handleNavigate, expanded, toggle };

  return (
    <>
      <aside className="hidden lg:flex w-64 h-screen flex-col flex-shrink-0" style={{ background: "var(--brand)" }}>
        <SidebarContent {...contentProps} />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-64 h-screen flex flex-col lg:hidden"
            style={{ background: "var(--brand)" }}
          >
            <SidebarContent {...contentProps} />
          </aside>
        </>
      )}
    </>
  );
}
