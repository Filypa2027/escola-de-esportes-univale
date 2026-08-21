import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, LogOut, User, X, Menu, Sun, Moon } from "lucide-react";
import type { Screen } from "./Sidebar";
import { mockModalidades, mockTurmas, mockPessoas } from "../data/mockData";
import { useTheme } from "../../theme/ThemeContext";

const screenTitles: Record<string, string> = {
  dashboard: "Dashboard",
  pessoas: "Pessoas",
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
  relatorios: "Relatórios",
  configuracoes: "Perfil",
};

const navPages: { label: string; screen: Screen }[] = [
  { label: "Dashboard", screen: "dashboard" },
  { label: "Pessoas", screen: "pessoas" },
  { label: "Escolas", screen: "escolas" },
  { label: "Escolaridade", screen: "escolaridade" },
  { label: "Categorias de Pessoa", screen: "categorias" },
  { label: "Modalidades", screen: "modalidades" },
  { label: "Períodos Letivos", screen: "periodos" },
  { label: "Turmas", screen: "turmas" },
  { label: "Matrículas", screen: "matriculas" },
  { label: "Aulas", screen: "aulas" },
  { label: "Frequência", screen: "frequencia" },
  { label: "Acompanhamentos", screen: "acompanhamentos" },
  { label: "Relatórios", screen: "relatorios" },
  { label: "Perfil", screen: "configuracoes" },
];

type SearchResult = {
  id: string;
  label: string;
  subtitle?: string;
  screen: Screen;
  category: string;
};

function getSearchResults(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  navPages
    .filter(p => p.label.toLowerCase().includes(q))
    .forEach(p => results.push({ id: `page-${p.screen}`, label: p.label, screen: p.screen, category: "Páginas" }));

  mockModalidades
    .filter(m => m.situacao !== "DELETADO" && (m.modalidade.toLowerCase().includes(q) || m.descricao.toLowerCase().includes(q)))
    .forEach(m => results.push({ id: `mod-${m.id}`, label: m.modalidade, subtitle: m.descricao, screen: "modalidades", category: "Modalidades" }));

  mockTurmas
    .filter(t => t.situacao !== "DELETADO" && (t.nome.toLowerCase().includes(q) || t.modalidade.toLowerCase().includes(q)))
    .forEach(t => results.push({ id: `turma-${t.id}`, label: t.nome, subtitle: t.modalidade, screen: "turmas", category: "Turmas" }));

  mockPessoas
    .filter(p => p.situacao !== "DELETADO" && (p.nome.toLowerCase().includes(q) || p.cpf.includes(q) || p.email.toLowerCase().includes(q)))
    .forEach(p => results.push({ id: `pessoa-${p.id}`, label: p.nome, subtitle: p.categoria, screen: "pessoas", category: "Pessoas" }));

  return results.slice(0, 12);
}

interface HeaderProps {
  currentScreen: string;
  onLogout?: () => void;
  onNavigate?: (screen: Screen) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

export function Header({
  currentScreen,
  onLogout,
  onNavigate,
  searchQuery = "",
  onSearchChange,
  sidebarOpen = false,
  onSidebarToggle,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchOverlayRef = useRef<HTMLDivElement>(null);
  const { isDark, setTheme } = useTheme();

  const searchResults = useMemo(() => getSearchResults(searchQuery), [searchQuery]);

  useEffect(() => {
    if (!isDropdownOpen && !isSearchOpen && !mobileSearchOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      const outsideSearch = !searchRef.current?.contains(target);
      const outsideMobileOverlay = !mobileSearchOverlayRef.current?.contains(target);
      if ((isSearchOpen || mobileSearchOpen) && outsideSearch && outsideMobileOverlay) {
        setIsSearchOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen, isSearchOpen, mobileSearchOpen]);

  const handleSearchSelect = (result: SearchResult) => {
    onNavigate?.(result.screen);
    setIsSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSearchSelect(searchResults[0]);
    }
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <header className="relative z-30 h-14 bg-white border-b border-gray-100 flex items-center justify-between gap-3 px-4 lg:px-6 flex-shrink-0">
      {mobileSearchOpen && (
        <div ref={mobileSearchOverlayRef} className="md:hidden absolute inset-y-0 left-14 right-[7rem] flex items-center px-2 bg-white z-20">
          <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            autoFocus
            onChange={e => {
              onSearchChange?.(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-9 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          <button
            type="button"
            onClick={() => {
              onSearchChange?.("");
              setMobileSearchOpen(false);
              setIsSearchOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Fechar busca"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 min-w-0 flex-1 lg:flex-none overflow-hidden">
        <button
          type="button"
          onClick={onSidebarToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 transition-colors flex-shrink-0"
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <span className="text-gray-400">Escola de Esportes</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate">{screenTitles[currentScreen] || currentScreen}</span>
        </div>
        <span className="hidden md:inline lg:hidden text-sm font-medium text-gray-700 truncate">
          {screenTitles[currentScreen] || currentScreen}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="relative" ref={searchRef}>
          {!mobileSearchOpen && (
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(true);
                setIsSearchOpen(true);
              }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={e => {
                onSearchChange?.(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              className="pl-9 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg w-32 sm:w-44 lg:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange?.("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute right-0 top-full mt-2 w-[min(24rem,calc(100vw-2rem))] max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {searchResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-400">Nenhum resultado encontrado</p>
              ) : (
                Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category}>
                    <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{category}</p>
                    {items.map(result => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleSearchSelect(result)}
                        className="w-full flex flex-col items-start px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm text-gray-800 font-medium">{result.label}</span>
                        {result.subtitle && (
                          <span className="text-xs text-gray-400 truncate w-full">{result.subtitle}</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "Claro" : "Escuro")}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
          aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          title={isDark ? "Tema claro" : "Tema escuro"}
        >
          {isDark ? <Sun className="w-4 h-4 text-gray-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
        </button>

        <div className="relative pl-2 sm:pl-3 border-l border-gray-100" ref={dropdownRef}>
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
              className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
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
                  <User className="w-4 h-4 text-gray-400" />
                  Perfil
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
