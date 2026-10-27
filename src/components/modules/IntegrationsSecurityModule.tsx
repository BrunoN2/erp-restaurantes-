import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Download,
  Upload,
  RotateCcw,
  Key,
  Lock,
  History,
  CheckCircle2,
  AlertTriangle,
  Server,
  RefreshCw,
  ExternalLink,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const IntegrationsSecurityModule: React.FC = () => {
  const {
    integrations,
    toggleIntegration,
    auditLogs,
    exportBackupJson,
    importBackupJson,
    resetAllData,
    currentUser,
    users,
    setCurrentUser,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'INTEGRACOES' | 'PERMISSOES' | 'BACKUP' | 'AUDITORIA'>('INTEGRACOES');
  const [jsonInput, setJsonInput] = useState('');

  // RBAC Matrix
  const rbacPermissions: { module: string; admin: boolean; financeiro: boolean; estoque: boolean; vendas: boolean; rh: boolean }[] = [
    { module: 'Visão Geral & DRE Gerencial', admin: true, financeiro: true, estoque: false, vendas: false, rh: false },
    { module: 'Gestão Financeira & Caixa', admin: true, financeiro: true, estoque: false, vendas: false, rh: false },
    { module: 'Conciliação Bancária', admin: true, financeiro: true, estoque: false, vendas: false, rh: false },
    { module: 'Controle de Estoque & Insumos', admin: true, financeiro: true, estoque: true, vendas: false, rh: false },
    { module: 'Fichas Técnicas & Cálculo CMV', admin: true, financeiro: true, estoque: true, vendas: false, rh: false },
    { module: 'Emissão de Notas Fiscais (NF-e)', admin: true, financeiro: true, estoque: false, vendas: false, rh: false },
    { module: 'Importador de XML da SEFAZ', admin: true, financeiro: true, estoque: true, vendas: false, rh: false },
    { module: 'Funil de Vendas & CRM Clientes', admin: true, financeiro: false, estoque: false, vendas: true, rh: false },
    { module: 'Lançar Pedidos de Venda', admin: true, financeiro: true, estoque: false, vendas: true, rh: false },
    { module: 'Ordens de Compra & Fornecedores', admin: true, financeiro: true, estoque: true, vendas: false, rh: false },
    { module: 'Folha de Pagamento & Salários', admin: true, financeiro: true, estoque: false, vendas: false, rh: true },
    { module: 'Controle de Ponto dos Funcionários', admin: true, financeiro: false, estoque: false, vendas: false, rh: true },
    { module: 'Configurações de APIs & Backups', admin: true, financeiro: false, estoque: false, vendas: false, rh: false }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const ok = importBackupJson(text);
        if (ok) setJsonInput('');
      };
      reader.readAsText(file);
    }
  };

  const handleManualJsonRestore = () => {
    if (!jsonInput.trim()) {
      showToast('Cole o conteúdo JSON do backup para restaurar.', 'warning');
      return;
    }
    const ok = importBackupJson(jsonInput);
    if (ok) setJsonInput('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('INTEGRACOES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'INTEGRACOES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hub de APIs & Conexões ({integrations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('PERMISSOES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'PERMISSOES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Controle de Permissões (RBAC)
          </button>
          <button
            onClick={() => setActiveSubTab('BACKUP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'BACKUP'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Segurança, Criptografia & Backup
          </button>
          <button
            onClick={() => setActiveSubTab('AUDITORIA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'AUDITORIA'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Trilha de Auditoria ({auditLogs.length})
          </button>
        </div>

        <button
          onClick={exportBackupJson}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar Backup Completo (.JSON)</span>
        </button>
      </div>

      {/* VIEW 1: Hub de APIs e Conexões */}
      {activeSubTab === 'INTEGRACOES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Integração com Outros Sistemas (API Hub)</h3>
                <p className="text-xs text-slate-400">
                  Conecte o ERP Mise ao seu e-commerce/delivery, maquininhas de cartão, bancos e softwares contábeis
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((intg) => {
              const isConnected = intg.status === 'CONECTADO';
              return (
                <div
                  key={intg.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {intg.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          isConnected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        {intg.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{intg.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{intg.description}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 truncate border border-slate-800">
                      Endpoint: {intg.apiEndpoint}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Última sincronização: {intg.lastSync}</span>
                    <button
                      onClick={() => toggleIntegration(intg.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isConnected
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isConnected ? 'Desconectar API' : 'Conectar Agora'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Controle de Permissões (RBAC) */}
      {activeSubTab === 'PERMISSOES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Matriz de Controle de Permissões por Função (RBAC)
              </h3>
              <p className="text-xs text-slate-400">
                Segurança granular: restrinja quem pode ver relatórios, alterar preços ou autorizar despesas
              </p>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="text-slate-400">Usuário em Sessão:</span>
              <strong className="text-amber-400 font-mono">
                {currentUser.name} ({currentUser.role})
              </strong>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Módulo / Funcionalidade</th>
                    <th className="py-3 px-4 text-center">ADMIN</th>
                    <th className="py-3 px-4 text-center">FINANCEIRO</th>
                    <th className="py-3 px-4 text-center">ESTOQUE / COZINHA</th>
                    <th className="py-3 px-4 text-center">VENDAS / SALÃO</th>
                    <th className="py-3 px-4 text-center">RECURSOS HUMANOS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {rbacPermissions.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-medium text-white">{row.module}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-400 font-bold">✓ Permitido</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.financeiro ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-600 font-bold">✗</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.estoque ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-600 font-bold">✗</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.vendas ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-600 font-bold">✗</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.rh ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-600 font-bold">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Segurança, Criptografia e Backup */}
      {activeSubTab === 'BACKUP' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export box */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Exportação de Snapshot (Backup)</h4>
                  <p className="text-xs text-slate-400">Gera arquivo JSON completo com todos os módulos</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                O arquivo gerado contém todas as transações financeiras, histórico de estoque, fichas técnicas, colaboradores e clientes para arquivamento ou transporte seguro.
              </p>
              <button
                onClick={exportBackupJson}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Arquivo .JSON de Backup</span>
              </button>
            </div>

            {/* Import box */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Restaurar Snapshot de Dados</h4>
                  <p className="text-xs text-slate-400">Importe um arquivo JSON salvo anteriormente</p>
                </div>
              </div>

              <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950 transition-colors">
                <Upload className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-xs font-bold text-white">Selecionar Arquivo .JSON</span>
                <span className="text-[10px] text-slate-400">Restauração instantânea de dados</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Encryption & Cloud Architecture Status */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Segurança & Criptografia dos Dados</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Criptografia em Trânsito</span>
                <strong className="text-white font-mono">TLS 1.3 / HTTPS 256-bit</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Persistência Local</span>
                <strong className="text-emerald-400 font-mono">Reativo & LocalStorage</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Integridade dos Módulos</span>
                <strong className="text-blue-400 font-mono">Cross-Module Sync 100%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Trilha de Auditoria (Audit Logs) */}
      {activeSubTab === 'AUDITORIA' && (
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                Trilha de Auditoria e Conformidade
              </h3>
              <p className="text-xs text-slate-400">
                Registro inalterável de todas as ações de usuários em cada setor do sistema
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Data / Hora</th>
                  <th className="py-3 px-4">Usuário</th>
                  <th className="py-3 px-4">Perfil</th>
                  <th className="py-3 px-4">Módulo</th>
                  <th className="py-3 px-4">Ação Realizada</th>
                  <th className="py-3 px-4">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-white">{log.userName}</td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/10 text-amber-300">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-semibold">{log.module}</td>
                    <td className="py-3 px-4 text-white font-medium">{log.action}</td>
                    <td className="py-3 px-4 text-slate-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
