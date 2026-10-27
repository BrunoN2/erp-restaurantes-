import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Check,
  Building2,
  Receipt,
  FileCheck2,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinancialTransaction, TransactionType, PaymentStatus } from '../../types';

export const FinanceModule: React.FC<{ onOpenNewTx: () => void }> = ({ onOpenNewTx }) => {
  const {
    transactions,
    bankAccounts,
    bankStatements,
    updateTransactionStatus,
    reconcileItem,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'FLUXO' | 'PAGAR' | 'RECEBER' | 'CONCILIACAO' | 'CONTAS'>('FLUXO');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.documentNumber && tx.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'TODOS' || tx.status === statusFilter;

    if (activeSubTab === 'PAGAR') {
      return tx.type === 'DESPESA' && matchesSearch && matchesStatus;
    }
    if (activeSubTab === 'RECEBER') {
      return tx.type === 'RECEITA' && matchesSearch && matchesStatus;
    }
    return matchesSearch && matchesStatus;
  });

  // Totals
  const totalReceivables = transactions
    .filter((t) => t.type === 'RECEITA' && t.status === 'PENDENTE')
    .reduce((s, t) => s + t.amount, 0);

  const totalPayables = transactions
    .filter((t) => t.type === 'DESPESA' && t.status === 'PENDENTE')
    .reduce((s, t) => s + t.amount, 0);

  const totalBankBalance = bankAccounts.reduce((s, a) => s + a.balance, 0);

  // Auto-reconciliation algorithm
  const handleAutoReconcile = () => {
    let reconciledCount = 0;
    bankStatements.forEach((stmt) => {
      if (stmt.status === 'PENDENTE') {
        const match = transactions.find(
          (t) =>
            !t.conciled &&
            t.amount === stmt.amount &&
            ((stmt.type === 'CREDITO' && t.type === 'RECEITA') || (stmt.type === 'DEBITO' && t.type === 'DESPESA'))
        );
        if (match) {
          reconcileItem(stmt.id, match.id);
          reconciledCount++;
        }
      }
    });

    if (reconciledCount > 0) {
      showToast(`${reconciledCount} lançamentos bancários conciliados automaticamente!`, 'success');
    } else {
      showToast('Nenhum novo item compatível para conciliação automática.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Saldo Líquido em Caixa/Bancos</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            R$ {totalBankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">{bankAccounts.length} contas configuradas</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Contas a Receber (Abertas)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">Previsão de entrada no fluxo</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Contas a Pagar (Abertas)</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400 font-mono">
            R$ {totalPayables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">Compromissos a liquidar</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('FLUXO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'FLUXO'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fluxo de Caixa
          </button>
          <button
            onClick={() => setActiveSubTab('PAGAR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'PAGAR'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contas a Pagar
          </button>
          <button
            onClick={() => setActiveSubTab('RECEBER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'RECEBER'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contas a Receber
          </button>
          <button
            onClick={() => setActiveSubTab('CONCILIACAO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'CONCILIACAO'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Conciliação Bancária
          </button>
          <button
            onClick={() => setActiveSubTab('CONTAS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'CONTAS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contas & Bancos
          </button>
        </div>

        <button
          onClick={onOpenNewTx}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* View: Fluxo / Pagar / Receber */}
      {activeSubTab !== 'CONCILIACAO' && activeSubTab !== 'CONTAS' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por descrição, fornecedor ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="PENDENTE">Apenas Pendentes</option>
                <option value="PAGO">Apenas Pagos</option>
                <option value="ATRASADO">Apenas Atrasados</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tipo / Vencimento</th>
                    <th className="py-3 px-4">Descrição & Categoria</th>
                    <th className="py-3 px-4">Entidade (Cliente/Fornecedor)</th>
                    <th className="py-3 px-4">Forma / Doc</th>
                    <th className="py-3 px-4 text-right">Valor</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Nenhum lançamento financeiro encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isReceita = tx.type === 'RECEITA';
                      return (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`p-1 rounded ${
                                  isReceita
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {isReceita ? (
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                ) : (
                                  <ArrowDownRight className="w-3.5 h-3.5" />
                                )}
                              </span>
                              <div>
                                <span className="font-mono text-slate-200 block">{tx.dueDate}</span>
                                <span className="text-[10px] text-slate-500">
                                  {isReceita ? 'Recebimento' : 'Pagamento'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-white block">{tx.description}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded inline-block mt-0.5">
                              {tx.category}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-300 font-medium">{tx.entityName}</td>

                          <td className="py-3 px-4">
                            <span className="text-slate-300 block">{tx.paymentMethod}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {tx.documentNumber || '-'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-mono font-bold text-sm ${
                                isReceita ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {isReceita ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                tx.status === 'PAGO'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : tx.status === 'PENDENTE'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {tx.status === 'PENDENTE' ? (
                              <button
                                onClick={() => updateTransactionStatus(tx.id, 'PAGO')}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                              >
                                <Check className="w-3 h-3" />
                                <span>{isReceita ? 'Receber' : 'Pagar'}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Liquidado
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View: Conciliação Bancária */}
      {activeSubTab === 'CONCILIACAO' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                Conciliação de Extrato Bancário
              </h3>
              <p className="text-xs text-slate-400">
                Compare lançamentos do extrato com registros internos do ERP Mise para fechar o caixa
              </p>
            </div>
            <button
              onClick={handleAutoReconcile}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Conciliar Automaticamente</span>
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Data Extrato</th>
                  <th className="py-3 px-4">Descrição no Banco</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Lançamento Vinculado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bankStatements.map((stmt) => {
                  const matchedTx = transactions.find((t) => t.id === stmt.matchedTransactionId);
                  return (
                    <tr key={stmt.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-300">{stmt.date}</td>
                      <td className="py-3 px-4 font-medium text-white">{stmt.description}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            stmt.type === 'CREDITO'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {stmt.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        R$ {stmt.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            stmt.status === 'CONCILIADO'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {stmt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400">
                        {matchedTx ? (
                          <span className="text-emerald-400 font-mono text-[11px]">
                            {matchedTx.description} (R$ {matchedTx.amount.toFixed(2)})
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Pendente de conciliação</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Contas & Bancos */}
      {activeSubTab === 'CONTAS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {acc.type.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  Ativa
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white">{acc.bankName}</h4>
              <div className="text-xs text-slate-400 space-y-0.5 font-mono">
                <p>Agência: {acc.agency}</p>
                <p>Conta Corrente: {acc.accountNumber}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-500 block">Saldo Atual Disponível</span>
                <span className="text-xl font-mono font-black text-white">
                  R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
