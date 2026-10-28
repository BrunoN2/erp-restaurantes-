import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  UtensilsCrossed,
  KeyRound,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, registerAccount, registeredAccounts } = useApp();

  const [username, setUsername] = useState('user123');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Register New Account Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername('user123');
    setPassword('12345678');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regPassword || !regName) return;

    const ok = registerAccount({
      username: regUsername.trim(),
      password: regPassword,
      name: regName.trim(),
      role: regRole
    });

    if (ok) {
      setUsername(regUsername.trim());
      setPassword(regPassword);
      setIsRegisterOpen(false);
      setRegUsername('');
      setRegPassword('');
      setRegName('');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Image Container with Ambient Loop Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/aistudio/Gemini_Generated_Image_rzsx0yrzsx0yrzsx_de2e91ea.jpeg"
          alt="Mise Constellation Background"
          className="w-full h-full object-cover object-center scale-105 animate-kenburns transition-opacity duration-1000 opacity-90 filter contrast-105"
        />
        {/* Soft vignette gradient overlay to ensure perfect UI contrast while admiring the art */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/30 to-slate-950/80" />

        {/* Ambient star shimmer loop over the shooting star position */}
        <div className="absolute top-[18%] left-[44%] w-16 h-16 rounded-full bg-cyan-400/20 blur-xl animate-star-pulse" />
      </div>

      {/* Main Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-10 transition-all text-slate-900">
          {/* Logo & Brand Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 mb-3.5">
              <UtensilsCrossed className="w-7 h-7 stroke-[2.5]" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Mise
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Gastronomia & Gestão Empresarial
            </p>
            <p className="text-xs text-slate-400 mt-1 italic">
              "Do estoque ao prato: saiba exatamente quanto você lucra."
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário (ex: user123)"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1 font-semibold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Acessar Painel do Restaurante</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Prototype helper box */}
          <div className="mt-6 pt-5 border-t border-slate-200/80">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-start justify-between gap-3">
              <div className="text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  Credenciais do Protótipo:
                </span>
                <p className="text-amber-800 font-mono text-[11px] mt-0.5">
                  Usuário: <strong>user123</strong> | Senha: <strong>12345678</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="shrink-0 px-2.5 py-1 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm transition-all"
              >
                Preencher
              </button>
            </div>

            {/* Custom User Registration Option */}
            <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastrar novo login</span>
              </button>
              <span className="text-[11px] text-slate-400">
                {registeredAccounts.length} conta(s) ativa(s)
              </span>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-center text-xs text-slate-400/80 mt-4 font-medium drop-shadow-md">
          Mise SaaS Platform • Gestão de ponta a ponta
        </p>
      </div>

      {/* Modal: Cadastrar Novo Login */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Cadastrar Novo Login
                </h3>
                <p className="text-xs text-slate-500">
                  Crie credenciais personalizadas para sua equipe
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chef Bruno Lopes"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome de Usuário (Login)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: bruno_gestor"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  placeholder="Crie uma senha segura"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nível de Acesso (Perfil RBAC)
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="ADMIN">Administrador Geral (Acesso Total)</option>
                  <option value="FINANCEIRO">Gerente Financeiro</option>
                  <option value="ESTOQUE">Chef de Cozinha & Estoquista</option>
                  <option value="VENDAS">Atendimento & Salão (Vendas)</option>
                  <option value="RH">Recursos Humanos / DP</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Salvar e Usar Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
