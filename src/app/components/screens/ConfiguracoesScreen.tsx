import { useState } from "react";
import { Save } from "lucide-react";
import { Toast, useToast } from "../shared/Toast";

interface ConfiguracoesScreenProps {
  searchQuery?: string;
}

export function ConfiguracoesScreen(_props: ConfiguracoesScreenProps) {
  const { toast, showToast, hideToast } = useToast();

  const [perfil, setPerfil] = useState({
    nome: "Cleber Siman de Amorim",
    email: "cleber.siman@univale.br",
    cargo: "Coordenador",
    telefone: "(33) 98802-4550",
  });

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div>
        <h1 className="text-gray-900">Perfil</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gerencie seus dados pessoais</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 lg:p-6">
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
          <button onClick={() => showToast("success", "Perfil atualizado com sucesso!")} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90" style={{ background: "var(--brand)" }}>
            <Save className="w-4 h-4" /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
