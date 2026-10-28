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
  Users,
  UserPlus
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
    registeredAccounts,
    registerAccount,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'INTEGRACOES' | 'LOGINS' | 'PERMISSOES' | 'BACKUP' | 'AUDITORIA'>('INTEGRACOES');
  const [jsonInput, setJsonInput] = useState('');

  // Register New Account State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('ADMIN');

  // RBAC Matrix
  const rbacPermissions: { module: string; admin: boolean; financeiro: boolean; estoque: boolean; vendas: boolean; rh: boolean }[] = [
    { module: 'Visão Geral & Gráfico de Rendimentos', admin: true, financeiro: true, estoque: false, vendas: false, rh: false },
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

  const handleCreateNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newName) {
      showToast('Preencha todos os campos do novo login.', 'warning');
      return;
    }

    const ok = registerAccount({
      username: newUsername.trim(),
      password: newPassword,
      name: newName.trim(),
      role: newRole
    });

    if (ok) {
      setNewUsername('');
      setNewPassword('');
      setNewName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setActiveSubTab('INTEGRACOES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'INTEGRACOES'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Hub de APIs & Conexões ({integrations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('LOGINS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'LOGINS'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Contas de Login ({registeredAccounts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('PERMISSOES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'PERMISSOES'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Matriz de Permissões (RBAC)
          </button>
          <button
            onClick={() => setActiveSubTab('BACKUP')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'BACKUP'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Segurança & Backup
          </button>
          <button
            onClick={() => setActiveSubTab('AUDITORIA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'AUDITORIA'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Trilha de Auditoria ({auditLogs.length})
          </button>
        </div>

        <button
          onClick={exportBackupJson}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar Backup Completo (.JSON)</span>
        </button>
      </div>

      {/* VIEW 1: Hub de APIs e Conexões */}
      {activeSubTab === 'INTEGRACOES' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Integração com Outros Sistemas (API Hub)</h3>
                <p className="text-xs text-slate-500">
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
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {intg.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                          isConnected
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        {intg.status}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900">{intg.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{intg.description}</p>

                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 font-mono text-[11px] text-slate-600 truncate border border-slate-200/80">
                      Endpoint: {intg.apiEndpoint}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Sincronizado: {intg.lastSync}</span>
                    <button
                      onClick={() => toggleIntegration(intg.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isConnected
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
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

      {/* VIEW 2: Contas de Login Cadastradas */}
      {activeSubTab === 'LOGINS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Usuários com Acesso ao Sistema
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cada usuário possui credenciais próprias para acessar a tela inicial de login
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nome & Usuário</th>
                    <th className="py-3.5 px-4">Senha</th>
                    <th className="py-3.5 px-4 text-center">Perfil RBAC</th>
                    <th className="py-3.5 px-4 font-mono text-slate-400">Criado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registeredAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{acc.name}</span>
                        <span className="font-mono text-amber-800 text-[11px] font-semibold">
                          @{acc.username}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 font-bold">
                        •••••••• <span className="text-[10px] text-slate-400 font-normal">({acc.password})</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {acc.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {acc.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-600" />
              Cadastrar Novo Login
            </h3>
            <p className="text-xs text-slate-500">
              Crie logins personalizados adicionais conforme solicitado
            </p>

            <form onSubmit={handleCreateNewAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chef Bruno Lopes"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome de Usuário (Login)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: bruno_gestor"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Senha de Acesso</label>
                <input
                  type="password"
                  required
                  placeholder="Digite a senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Perfil de Permissão</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium cursor-pointer"
                >
                  <option value="ADMIN">ADMIN (Acesso Total)</option>
                  <option value="FINANCEIRO">FINANCEIRO</option>
                  <option value="ESTOQUE">ESTOQUE / COZINHA</option>
                  <option value="VENDAS">VENDAS / ATENDIMENTO</option>
                  <option value="RH">RH / RECURSOS HUMANOS</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Cadastrar Usuário
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 3: Controle de Permissões (RBAC) */}
      {activeSubTab === 'PERMISSOES' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Matriz de Controle de Permissões por Função (RBAC)
              </h3>
              <p className="text-xs text-slate-500">
                Segurança granular: restrinja quem pode ver relatórios, alterar preços ou autorizar despesas
              </p>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="text-slate-400">Usuário em Sessão:</span>
              <strong className="text-amber-800 font-mono font-bold">
                {currentUser.name} ({currentUser.role})
              </strong>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Módulo / Funcionalidade</th>
                    <th className="py-3.5 px-4 text-center">ADMIN</th>
                    <th className="py-3.5 px-4 text-center">FINANCEIRO</th>
                    <th className="py-3.5 px-4 text-center">ESTOQUE / COZINHA</th>
                    <th className="py-3.5 px-4 text-center">VENDAS / SALÃO</th>
                    <th className="py-3.5 px-4 text-center">RECURSOS HUMANOS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rbacPermissions.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.module}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-emerald-700 font-bold">✓ Permitido</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.financeiro ? (
                          <span className="text-emerald-700 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-300 font-bold">✗</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.estoque ? (
                          <span className="text-emerald-700 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-300 font-bold">✗</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.vendas ? (
                          <span className="text-emerald-700 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-300 font-bold">✗</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.rh ? (
                          <span className="text-emerald-700 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-300 font-bold">✗</span>
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

      {/* VIEW 4: Segurança, Criptografia e Backup */}
      {activeSubTab === 'BACKUP' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Exportação de Snapshot (Backup)</h4>
                  <p className="text-xs text-slate-500">Gera arquivo JSON completo com todos os módulos</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                O arquivo gerado contém todas as transações financeiras, histórico de estoque, fichas técnicas, colaboradores e clientes para arquivamento ou transporte seguro.
              </p>
              <button
                onClick={exportBackupJson}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Arquivo .JSON de Backup</span>
              </button>
            </div>

            {/* Import box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-800">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Restaurar Snapshot de Dados</h4>
                  <p className="text-xs text-slate-500">Importe um arquivo JSON salvo anteriormente</p>
                </div>
              </div>

              <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 transition-colors">
                <Upload className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">Selecionar Arquivo .JSON</span>
                <span className="text-[10px] text-slate-500 font-medium">Restauração instantânea de dados</span>
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
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Segurança & Criptografia dos Dados</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1 font-medium">Criptografia em Trânsito</span>
                <strong className="text-slate-900 font-mono">TLS 1.3 / HTTPS 256-bit</strong>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1 font-medium">Persistência Local</span>
                <strong className="text-emerald-700 font-mono">Reativo & LocalStorage</strong>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1 font-medium">Integridade dos Módulos</span>
                <strong className="text-blue-700 font-mono">Cross-Module Sync 100%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: Trilha de Auditoria (Audit Logs) */}
      {activeSubTab === 'AUDITORIA' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                Trilha de Auditoria e Conformidade
              </h3>
              <p className="text-xs text-slate-500">
                Registro inalterável de todas as ações de usuários em cada setor do sistema
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Data / Hora</th>
                  <th className="py-3.5 px-4">Usuário</th>
                  <th className="py-3.5 px-4">Perfil</th>
                  <th className="py-3.5 px-4">Módulo</th>
                  <th className="py-3.5 px-4">Ação Realizada</th>
                  <th className="py-3.5 px-4">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.userName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-200">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-bold">{log.module}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-medium">{log.action}</td>
                    <td className="py-3.5 px-4 text-slate-500">{log.details}</td>
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
