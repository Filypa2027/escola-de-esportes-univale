import { useState, useRef, useEffect } from "react";
import { Bell, Search, ChevronDown, LogOut, Settings } from "lucide-react";
import type { Screen } from "./Sidebar";

const screenTitles: Record<string, string> = {
  dashboard: "Dashboard",
  pessoas: "Pessoas",
  "pessoa-form": "Cadastro de Pessoa",
  escolas: "Escolas",
  "escola-form": "Cadastro de Escola",
  escolaridade: "Escolaridade",
  categorias: "Categorias de Pessoa",
  modalidades: "Modalidades Esportivas",
  periodos: "Períodos Letivos",
  turmas: "Turmas",
  matriculas: "Matrículas",
  aulas: "Aulas",
  frequencia: "Controle de Frequência",
  acompanhamentos: "Acompanhamentos",
  "acompanhamento-form": "Novo Acompanhamento",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
};

interface HeaderProps {
  currentScreen: string;
  onLogout?: () => void;
  onNavigate?: (screen: Screen) => void;
}

export function Header({ currentScreen, onLogout, onNavigate }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-gray-400">Escola de Esportes</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">{screenTitles[currentScreen] || currentScreen}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
          <Bell className="w-4.5 h-4.5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User profile dropdown */}
        <div className="relative pl-3 border-l border-gray-100" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZCyKxHiNSoB9jD5IFWq2IJjkJ53TL5J3kNg&s"
              alt="Cleber Siman"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-700 leading-tight">Cleber Siman</div>
              <div className="text-xs text-gray-400 leading-tight">Coordenador</div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
              <div className="px-3.5 py-2.5 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">Cleber Siman</p>
                <p className="text-xs text-gray-500 truncate">cleber.siman@univale.br</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full">
                  Coordenador Geral
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onNavigate?.("configuracoes");
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Configurações
                </button>
              </div>

              <div className="border-t border-gray-100 my-1" />

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
