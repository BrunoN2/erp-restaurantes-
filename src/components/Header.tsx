import React from 'react';
import {
  Menu,
  PlusCircle,
  FileUp,
  Download,
  RotateCcw,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle
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
    transactions,
    exportBackupJson,
    resetAllData
  } = useApp();

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'DASHBOARD':
        return {
          title: 'Visão Geral & Indicadores Estratégicos',
          desc: 'Monitoramento de DRE, fluxo de caixa unificado, CMV gastronômico e engenharia de cardápio'
        };
      case 'FINANCEIRO':
        return {
          title: 'Gestão Financeira & Tesouraria',
          desc: 'Contas a pagar e receber, fluxo de caixa diário projetado e conciliação bancária de extrato'
        };
      case 'ESTOQUE':
        return {
          title: 'Controle de Estoque & Fichas Técnicas Vivas',
          desc: 'Prevenção de ruptura, inventário, rastreabilidade e cálculo do CMV real com fator de correção'
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
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block line-clamp-1">{desc}</p>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Status */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Critical Alerts Counter */}
        {criticalStock.length > 0 && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{criticalStock.length} itens em ruptura</span>
          </div>
        )}

        {/* Quick Action: Nova Venda */}
        <button
          onClick={onOpenQuickSale}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Nova Venda / Pedido</span>
        </button>

        {/* Quick Action: Importar XML NF-e */}
        <button
          onClick={onOpenImportXml}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Importar XML NF-e</span>
        </button>

        {/* Quick Action: Novo Lançamento Financeiro */}
        <button
          onClick={onOpenNewTx}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
        >
          <span>+ Financeiro</span>
        </button>

        {/* Backup snapshot */}
        <button
          onClick={exportBackupJson}
          title="Exportar Backup JSON completo"
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
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
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
