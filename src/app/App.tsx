import { useState } from "react";
import { Sidebar, type Screen } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { LoginScreen } from "./components/screens/LoginScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { PessoasScreen } from "./components/screens/PessoasScreen";
import { PessoaFormScreen } from "./components/screens/PessoaFormScreen";
import { EscolasScreen } from "./components/screens/EscolasScreen";
import { ModalidadesScreen } from "./components/screens/ModalidadesScreen";
import { PeriodosScreen } from "./components/screens/PeriodosScreen";
import { TurmasScreen } from "./components/screens/TurmasScreen";
import { MatriculasScreen } from "./components/screens/MatriculasScreen";
import { AulasScreen } from "./components/screens/AulasScreen";
import { FrequenciaScreen } from "./components/screens/FrequenciaScreen";
import { AcompanhamentosScreen } from "./components/screens/AcompanhamentosScreen";
import { AcompanhamentoFormScreen } from "./components/screens/AcompanhamentoFormScreen";
import { RelatoriosScreen } from "./components/screens/RelatoriosScreen";
import { ConfiguracoesScreen } from "./components/screens/ConfiguracoesScreen";
import { SimpleListScreen } from "./components/screens/SimpleListScreen";
import type { Person } from "./components/data/mockData";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [editPessoa, setEditPessoa] = useState<Person | null>(null);

  const handleNavigate = (screen: Screen, data?: unknown) => {
    if (screen === "pessoa-form") {
      setEditPessoa(data as Person | null);
    }
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen("dashboard");
    setEditPessoa(null);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard": return <DashboardScreen />;
      case "pessoas": return <PessoasScreen onNavigate={handleNavigate} />;
      case "pessoa-form": return <PessoaFormScreen onNavigate={handleNavigate} editData={editPessoa} />;
      case "escolas": return <EscolasScreen />;
      case "escolaridade": return <SimpleListScreen screen="escolaridade" />;
      case "categorias": return <SimpleListScreen screen="categorias" />;
      case "modalidades": return <ModalidadesScreen />;
      case "periodos": return <PeriodosScreen />;
      case "turmas": return <TurmasScreen />;
      case "matriculas": return <MatriculasScreen />;
      case "aulas": return <AulasScreen />;
      case "frequencia": return <FrequenciaScreen />;
      case "acompanhamentos": return <AcompanhamentosScreen onNavigate={handleNavigate} />;
      case "acompanhamento-form": return <AcompanhamentoFormScreen onNavigate={handleNavigate} />;
      case "relatorios": return <RelatoriosScreen />;
      case "configuracoes": return <ConfiguracoesScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentScreen={currentScreen} onLogout={handleLogout} onNavigate={handleNavigate} />
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
