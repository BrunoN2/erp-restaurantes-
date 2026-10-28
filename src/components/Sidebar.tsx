import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Boxes,
  FileSpreadsheet,
  Users2,
  ShoppingCart,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  Shield,
  UtensilsCrossed,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType, UserRole } from '../types';

interface NavItem {
  id: TabType;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: number;
  badgeType?: 'danger' | 'warning' | 'info';
  allowedRoles: UserRole[];
}

export const Sidebar: React.FC<{ isOpenMobile: boolean; onCloseMobile: () => void }> = ({
  isOpenMobile,
  onCloseMobile
}) => {
  const {
    activeTab,
    setActiveTab,
    company,
    currentUser,
    setCurrentUser,
    users,
    stock,
    transactions,
    purchaseOrders,
    logout
  } = useApp();

  // Calculate dynamic alerts for badges
  const ruptureCount = stock.filter((s) => s.currentStock <= s.minStock).length;
  const pendingBillsCount = transactions.filter(
    (t) => t.type === 'DESPESA' && t.status === 'PENDENTE'
  ).length;
  const pendingOrdersCount = purchaseOrders.filter(
    (p) => p.status === 'ENVIADA_FORNECEDOR' || p.status === 'APROVADA'
  ).length;

  const navItems: NavItem[] = [
    {
      id: 'DASHBOARD',
      label: 'Visão Geral & Rendimentos',
      sublabel: 'Gráficos, DRE e CMV',
      icon: LayoutDashboard,
      allowedRoles: ['ADMIN', 'FINANCEIRO', 'ESTOQUE', 'VENDAS', 'RH']
    },
    {
      id: 'FINANCEIRO',
      label: 'Gestão Financeira',
      sublabel: 'Caixa, Contas & Conciliação',
      icon: Wallet,
      badge: pendingBillsCount > 0 ? pendingBillsCount : undefined,
      badgeType: 'warning',
      allowedRoles: ['ADMIN', 'FINANCEIRO']
    },
    {
      id: 'ESTOQUE',
      label: 'Estoque & Logística',
      sublabel: 'Insumos, Rupturas & CMV Vivo',
      icon: Boxes,
      badge: ruptureCount > 0 ? ruptureCount : undefined,
      badgeType: 'danger',
      allowedRoles: ['ADMIN', 'ESTOQUE', 'FINANCEIRO']
    },
    {
      id: 'FISCAL',
      label: 'Faturamento & Fiscal',
      sublabel: 'NF-e, Leitor XML & Impostos',
      icon: FileSpreadsheet,
      allowedRoles: ['ADMIN', 'FINANCEIRO']
    },
    {
      id: 'VENDAS',
      label: 'Vendas e CRM',
      sublabel: 'Pipeline, Pedidos & Clientes',
      icon: Users2,
      allowedRoles: ['ADMIN', 'VENDAS', 'FINANCEIRO']
    },
    {
      id: 'COMPRAS',
      label: 'Gestão de Compras',
      sublabel: 'Ordens, Fornecedores & Cotações',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeType: 'info',
      allowedRoles: ['ADMIN', 'ESTOQUE', 'FINANCEIRO']
    },
    {
      id: 'RH',
      label: 'Recursos Humanos',
      sublabel: 'Colaboradores, Ponto & Folha',
      icon: UserCheck,
      allowedRoles: ['ADMIN', 'RH', 'FINANCEIRO']
    },
    {
      id: 'INTEGRACOES',
      label: 'Integrações & Segurança',
      sublabel: 'APIs, Perfis RBAC & Backups',
      icon: ShieldCheck,
      allowedRoles: ['ADMIN']
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Left: Company Branding with Name & Icon */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black text-xl">
              <UtensilsCrossed className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Mise</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-900 border border-amber-200">
                  ERP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate font-medium">
                {company.name}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SaaS Ativo (Nuvem)
            </span>
            <span className="text-slate-400 font-mono text-[10px]">{company.cnpj}</span>
          </div>
        </div>

        {/* Tab Items with Icon & Name */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-2 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Módulos do Sistema
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasPermission =
              currentUser.role === 'ADMIN' || item.allowedRoles.includes(currentUser.role);

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full group text-left px-3 py-2.5 rounded-2xl transition-all duration-150 flex items-center justify-between relative cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                    : hasPermission
                    ? 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950'
                    : 'text-slate-400 hover:bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-slate-950/15 text-slate-950'
                        : 'bg-slate-100 text-slate-600 group-hover:text-amber-600 group-hover:bg-amber-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                      <span className="truncate">{item.label}</span>
                      {!hasPermission && (
                        <Shield className="w-3 h-3 text-slate-400 inline-block" />
                      )}
                    </div>
                    <div
                      className={`text-[10px] truncate leading-tight ${
                        isActive ? 'text-slate-900/80 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        item.badgeType === 'danger'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : item.badgeType === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-950 ml-1" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Role Switcher (RBAC) & Logout Button */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span>Perfil Ativo (RBAC)</span>
            <span className="text-[9px] text-amber-800 bg-amber-100 px-1 py-0.5 rounded font-bold">
              Simulador
            </span>
          </div>

          <select
            aria-label="Selecionar perfil de usuário ativo"
            value={currentUser.id}
            onChange={(e) => {
              const found = users.find((u) => u.id === e.target.value);
              if (found) setCurrentUser(found);
            }}
            className="w-full text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — [{u.role}]
              </option>
            ))}
          </select>

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-800 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentUser.role}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Encerrar sessão e voltar ao login"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
