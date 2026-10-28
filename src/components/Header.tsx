import React from 'react';
import {
  Menu,
  PlusCircle,
  FileUp,
  Download,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  LogOut,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenQuickSale: () => void;
  onOpenImportXml: () => void;
  onOpenNewTx: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenQuickSale,
  onOpenImportXml,
  onOpenNewTx
}) => {
  const {
    activeTab,
    stock,
    exportBackupJson,
    resetAllData,
    currentUser,
    logout
  } = useApp();

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'DASHBOARD':
        return {
          title: 'Visão Geral & Rendimentos',
          desc: 'Acompanhamento do gráfico de faturamento, DRE sintético e engenharia de cardápio'
        };
      case 'FINANCEIRO':
        return {
          title: 'Gestão Financeira & Tesouraria',
          desc: 'Contas a pagar e receber, fluxo de caixa diário e conciliação bancária'
        };
      case 'ESTOQUE':
        return {
          title: 'Controle de Estoque & Fichas Técnicas Vivas',
          desc: 'Prevenção de ruptura, inventário e recálculo do CMV real gastronômico'
        };
      case 'FISCAL':
        return {
          title: 'Faturamento, NF-e & Gestão Fiscal',
          desc: 'Emissão automatizada de notas fiscais, leitor de XML SEFAZ e apuração de tributos'
        };
      case 'VENDAS':
        return {
          title: 'Vendas, Pedidos & CRM de Clientes',
          desc: 'Ciclo comercial do lead ao fechamento, PDV integrado ao estoque e histórico de consumo'
        };
      case 'COMPRAS':
        return {
          title: 'Gestão de Compras & Suprimentos',
          desc: 'Cadastro de fornecedores homologados, cotações de preços e ordens de compra integradas'
        };
      case 'RH':
        return {
          title: 'Recursos Humanos & Departamento Pessoal',
          desc: 'Quadro de colaboradores, registro de ponto digital e prévia da folha com encargos CLT'
        };
      case 'INTEGRACOES':
        return {
          title: 'Central de Integrações, Segurança & Backup',
          desc: 'Conexão via API com iFood, bancos e maquininhas, controle de perfis RBAC e snapshot de dados'
        };
      default:
        return { title: 'Mise ERP', desc: '' };
    }
  };

  const { title, desc } = getTabTitle(activeTab);
  const criticalStock = stock.filter((s) => s.currentStock <= s.minStock);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block line-clamp-1 font-medium">{desc}</p>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Status */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Critical Alerts Counter */}
        {criticalStock.length > 0 && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{criticalStock.length} itens em ruptura</span>
          </div>
        )}

        {/* Quick Action: Nova Venda */}
        <button
          onClick={onOpenQuickSale}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Nova Venda</span>
        </button>

        {/* Quick Action: Importar XML NF-e */}
        <button
          onClick={onOpenImportXml}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Importar XML NF-e</span>
        </button>

        {/* Quick Action: Novo Lançamento Financeiro */}
        <button
          onClick={onOpenNewTx}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <span>+ Financeiro</span>
        </button>

        {/* Backup snapshot */}
        <button
          onClick={exportBackupJson}
          title="Exportar Backup JSON completo"
          className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Reset button */}
        <button
          onClick={() => {
            if (window.confirm('Deseja restaurar todos os dados para o padrão de demonstração do Mise?')) {
              resetAllData();
            }
          }}
          title="Restaurar dados de demonstração"
          className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Logout button */}
        <button
          onClick={logout}
          title="Encerrar Sessão (Voltar ao Login)"
          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 transition-colors cursor-pointer ml-1"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
