import { useState } from "react";
import { Save, Bell, Shield, Palette, Database } from "lucide-react";
import { Toast, useToast } from "../shared/Toast";

export function ConfiguracoesScreen() {
  const { toast, showToast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState("perfil");

  const [perfil, setPerfil] = useState({
    nome: "Cleber Siman de Amorim",
    email: "cleber.siman@univale.br",
    cargo: "Coordenador",
    telefone: "(33) 98802-4550",
  });

  const [notif, setNotif] = useState({
    novasMatriculas: true,
    frequencia: true,
    acompanhamentos: false,
    relatorios: true,
  });

  const tabs = [
    { id: "perfil", label: "Perfil", icon: <Shield className="w-4 h-4" /> },
    { id: "notificacoes", label: "Notificações", icon: <Bell className="w-4 h-4" /> },
    { id: "aparencia", label: "Aparência", icon: <Palette className="w-4 h-4" /> },
    { id: "sistema", label: "Sistema", icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div>
        <h1 className="text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <div className="flex gap-5">
        {/* Tabs sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${activeTab === tab.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span className={activeTab === tab.id ? "text-blue-600" : "text-gray-400"}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {activeTab === "perfil" && (
            <div>
              <h2 className="text-gray-800 mb-5 pb-4 border-b border-gray-100">Dados do Perfil</h2>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZCyKxHiNSoB9jD5IFWq2IJjkJ53TL5J3kNg&s"
                  alt="Foto de perfil"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
                />
                <div>
                  <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Alterar foto</button>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG ou GIF. Máx. 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Nome completo", key: "nome" as const },
                  { label: "E-mail", key: "email" as const },
                  { label: "Cargo", key: "cargo" as const },
                  { label: "Telefone", key: "telefone" as const },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                    <input
                      value={perfil[f.key]}
                      onChange={e => setPerfil(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h3 className="text-gray-700 mb-4">Alterar Senha</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Senha atual", "Nova senha", "Confirmar nova senha"].map(label => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input type="password" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="••••••••" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => showToast("success", "Perfil atualizado com sucesso!")} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "#0F4C81" }}>
                  <Save className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {activeTab === "notificacoes" && (
            <div>
              <h2 className="text-gray-800 mb-5 pb-4 border-b border-gray-100">Preferências de Notificações</h2>
              <div className="space-y-4">
                {[
                  { key: "novasMatriculas" as const, label: "Novas matrículas", desc: "Receba notificações quando uma nova matrícula for realizada" },
                  { key: "frequencia" as const, label: "Registro de frequência", desc: "Alertas sobre chamadas pendentes e baixa frequência" },
                  { key: "acompanhamentos" as const, label: "Acompanhamentos", desc: "Notificações sobre novos acompanhamentos pedagógicos e psicológicos" },
                  { key: "relatorios" as const, label: "Relatórios prontos", desc: "Aviso quando um relatório for gerado com sucesso" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotif(n => ({ ...n, [item.key]: !n[item.key] }))}
                      className={`w-10 h-6 rounded-full transition-all relative ${notif[item.key] ? "bg-blue-600" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${notif[item.key] ? "left-5" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => showToast("success", "Preferências salvas!")} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "#0F4C81" }}>
                  <Save className="w-4 h-4" /> Salvar
                </button>
              </div>
            </div>
          )}

          {activeTab === "aparencia" && (
            <div>
              <h2 className="text-gray-800 mb-5 pb-4 border-b border-gray-100">Aparência do Sistema</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
                  <div className="flex gap-3">
                    {["Claro", "Escuro", "Sistema"].map(t => (
                      <button key={t} className={`px-4 py-2.5 rounded-lg text-sm border transition-all ${t === "Claro" ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tamanho da fonte</label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">A</span>
                    <input type="range" min="12" max="20" defaultValue="14" className="flex-1 accent-blue-600" />
                    <span className="text-lg text-gray-700 font-medium">A</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Cor de destaque</label>
                  <div className="flex gap-2">
                    {["#0F4C81", "#7C3AED", "#059669", "#DC2626", "#D97706"].map(color => (
                      <button key={color} className={`w-8 h-8 rounded-full border-2 ${color === "#0F4C81" ? "border-gray-800 scale-110" : "border-transparent"} transition-all`} style={{ background: color }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sistema" && (
            <div>
              <h2 className="text-gray-800 mb-5 pb-4 border-b border-gray-100">Informações do Sistema</h2>
              <div className="space-y-4">
                {[
                  { label: "Versão do sistema", value: "2.4.1" },
                  { label: "Última atualização", value: "10/06/2026" },
                  { label: "Banco de dados", value: "PostgreSQL 15.2" },
                  { label: "Ambiente", value: "Produção" },
                  { label: "Último backup", value: "12/06/2026 – 03:00" },
                ].map(info => (
                  <div key={info.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{info.label}</span>
                    <span className="text-sm font-medium text-gray-800">{info.value}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <button className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100">Realizar backup manual</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
