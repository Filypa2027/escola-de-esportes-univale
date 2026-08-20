import { useState } from "react"; 
import { Eye, EyeOff, Dumbbell, ArrowRight } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("cleber.siman@univale.br");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-6 sm:px-10 py-12 bg-white">
        <div className="max-w-sm w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#0F4C81" }}>
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 leading-tight">Escola de Esportes</div>
              <div className="text-gray-400 text-xs">Sistema de Gestão Educacional</div>
            </div>
          </div>

          <h1 className="text-gray-900 mb-1">Bem-vindo de volta</h1>
          <p className="text-gray-500 text-sm mb-8">Acesse sua conta para continuar</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Recuperar senha
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70 mt-2"
              style={{ background: "#0F4C81" }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 Escola de Esportes · Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden" style={{ background: "#0F4C81" }}>
        <img
          src="https://scontent.fcnf1-1.fna.fbcdn.net/v/t1.6435-9/34585017_621676164863757_1104871583752650752_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHuEnrrJK4TaN10MHk-oVHH-tpatfJduaX62lq18l25pcYcCYi3p3FOc-orXWz1AHeQXQc9lwtjiupMBCjz0MWQ&_nc_ohc=K81WeRsL1_AQ7kNvwHBuKcn&_nc_oc=Ado5O_ywWWeTVndtBKhWBx29sT7sd9PXrsIIZpNFovy7t2nRLnHdGgIM04or7ytvIBw&_nc_zt=23&_nc_ht=scontent.fcnf1-1.fna&_nc_gid=UmNksqF0epLZwFe2Lhj4ig&_nc_ss=7b2a8&oh=00_Af-EYWO2GeLuDst51gi1ZCXJBx9vfdy7JiLv4PWgCiq2Og&oe=6A53A7CE"
          alt="Esportes"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="text-5xl font-bold leading-tight mb-4">
            Transformando<br />vidas através<br />do esporte
          </div>
          <p className="text-white/70 text-lg max-w-md">
            Gerencie alunos, turmas, frequência e acompanhamentos pedagógicos de forma inteligente e eficiente.
          </p>

          <div className="flex gap-6 mt-10">
            {[
              { value: "127", label: "Alunos ativos" },
              { value: "12", label: "Turmas" },
              { value: "6", label: "Modalidades" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}