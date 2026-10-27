import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toasts } from './components/Toasts';
import { QuickSaleModal } from './components/modals/QuickSaleModal';
import { ImportXmlModal } from './components/modals/ImportXmlModal';
import { NewTransactionModal } from './components/modals/NewTransactionModal';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { StockModule } from './components/modules/StockModule';
import { FiscalModule } from './components/modules/FiscalModule';
import { SalesCrmModule } from './components/modules/SalesCrmModule';
import { PurchasesModule } from './components/modules/PurchasesModule';
import { HRModule } from './components/modules/HRModule';
import { IntegrationsSecurityModule } from './components/modules/IntegrationsSecurityModule';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, canAccess } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isImportXmlOpen, setIsImportXmlOpen] = useState(false);
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);

  // Role permissions mapping
  const getRequiredRolesForTab = (tab: typeof activeTab) => {
    switch (tab) {
      case 'DASHBOARD':
        return ['ADMIN', 'FINANCEIRO', 'ESTOQUE', 'VENDAS', 'RH'];
      case 'FINANCEIRO':
        return ['ADMIN', 'FINANCEIRO'];
      case 'ESTOQUE':
        return ['ADMIN', 'ESTOQUE', 'FINANCEIRO'];
      case 'FISCAL':
        return ['ADMIN', 'FINANCEIRO'];
      case 'VENDAS':
        return ['ADMIN', 'VENDAS', 'FINANCEIRO'];
      case 'COMPRAS':
        return ['ADMIN', 'ESTOQUE', 'FINANCEIRO'];
      case 'RH':
        return ['ADMIN', 'RH', 'FINANCEIRO'];
      case 'INTEGRACOES':
        return ['ADMIN'];
      default:
        return ['ADMIN'];
    }
  };

  const hasAccess = canAccess(getRequiredRolesForTab(activeTab) as any);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (shifted on desktop for fixed sidebar) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenQuickSale={() => setIsQuickSaleOpen(true)}
          onOpenImportXml={() => setIsImportXmlOpen(true)}
          onOpenNewTx={() => setIsNewTxOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {!hasAccess ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-rose-500/30 text-center max-w-lg mx-auto my-12 space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Acesso Restrito pelo Controle RBAC</h3>
              <p className="text-xs text-slate-400">
                O seu perfil atual (<strong>{currentUser.role}</strong> - {currentUser.name}) não possui permissão para visualizar ou editar este módulo.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('DASHBOARD')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar ao Dashboard</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'DASHBOARD' && <DashboardModule />}
              {activeTab === 'FINANCEIRO' && (
                <FinanceModule onOpenNewTx={() => setIsNewTxOpen(true)} />
              )}
              {activeTab === 'ESTOQUE' && <StockModule />}
              {activeTab === 'FISCAL' && (
                <FiscalModule onOpenImportXml={() => setIsImportXmlOpen(true)} />
              )}
              {activeTab === 'VENDAS' && (
                <SalesCrmModule onOpenQuickSale={() => setIsQuickSaleOpen(true)} />
              )}
              {activeTab === 'COMPRAS' && <PurchasesModule />}
              {activeTab === 'RH' && <HRModule />}
              {activeTab === 'INTEGRACOES' && <IntegrationsSecurityModule />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <QuickSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
      />

      <ImportXmlModal
        isOpen={isImportXmlOpen}
        onClose={() => setIsImportXmlOpen(false)}
      />

      <NewTransactionModal
        isOpen={isNewTxOpen}
        onClose={() => setIsNewTxOpen(false)}
      />

      {/* Toast Notifications */}
      <Toasts />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
