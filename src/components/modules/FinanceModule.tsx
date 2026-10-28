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
      {/* Financial Overview Cards - Light Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Saldo Líquido em Caixa/Bancos</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            R$ {totalBankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-400 mt-1 block font-medium">{bankAccounts.length} contas configuradas</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Contas a Receber (Abertas)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
            R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-emerald-800/80 mt-1 block font-medium">Previsão de entrada no fluxo</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Contas a Pagar (Abertas)</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono tracking-tight">
            R$ {totalPayables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-rose-800/80 mt-1 block font-medium">Compromissos a liquidar</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setActiveSubTab('FLUXO')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'FLUXO'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Fluxo de Caixa
          </button>
          <button
            onClick={() => setActiveSubTab('PAGAR')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'PAGAR'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Contas a Pagar
          </button>
          <button
            onClick={() => setActiveSubTab('RECEBER')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'RECEBER'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Contas a Receber
          </button>
          <button
            onClick={() => setActiveSubTab('CONCILIACAO')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'CONCILIACAO'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Conciliação Bancária
          </button>
          <button
            onClick={() => setActiveSubTab('CONTAS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'CONTAS'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Contas & Bancos
          </button>
        </div>

        <button
          onClick={onOpenNewTx}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* View: Fluxo / Pagar / Receber */}
      {activeSubTab !== 'CONCILIACAO' && activeSubTab !== 'CONTAS' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por descrição, fornecedor ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="PENDENTE">Apenas Pendentes</option>
                <option value="PAGO">Apenas Pagos</option>
                <option value="ATRASADO">Apenas Atrasados</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Tipo / Vencimento</th>
                    <th className="py-3.5 px-4">Descrição & Categoria</th>
                    <th className="py-3.5 px-4">Entidade (Cliente/Fornecedor)</th>
                    <th className="py-3.5 px-4">Forma / Doc</th>
                    <th className="py-3.5 px-4 text-right">Valor</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                        Nenhum lançamento financeiro encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isReceita = tx.type === 'RECEITA';
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`p-1.5 rounded-lg ${
                                  isReceita
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {isReceita ? (
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                ) : (
                                  <ArrowDownRight className="w-3.5 h-3.5" />
                                )}
                              </span>
                              <div>
                                <span className="font-mono text-slate-900 font-semibold block">{tx.dueDate}</span>
                                <span className="text-[10px] text-slate-400">
                                  {isReceita ? 'Recebimento' : 'Pagamento'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{tx.description}</span>
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5 font-medium">
                              {tx.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 font-semibold">{tx.entityName}</td>

                          <td className="py-3.5 px-4">
                            <span className="text-slate-800 font-medium block">{tx.paymentMethod}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {tx.documentNumber || '-'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`font-mono font-black text-sm ${
                                isReceita ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {isReceita ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                tx.status === 'PAGO'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : tx.status === 'PENDENTE'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {tx.status === 'PENDENTE' ? (
                              <button
                                onClick={() => updateTransactionStatus(tx.id, 'PAGO')}
                                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-[11px] font-bold transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>{isReceita ? 'Receber' : 'Pagar'}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                Conciliação de Extrato Bancário
              </h3>
              <p className="text-xs text-slate-500">
                Compare lançamentos do extrato com registros internos do ERP Mise para fechar o caixa
              </p>
            </div>
            <button
              onClick={handleAutoReconcile}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Conciliar Automaticamente</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Data Extrato</th>
                  <th className="py-3.5 px-4">Descrição no Banco</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4 text-right">Valor</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Lançamento Vinculado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bankStatements.map((stmt) => {
                  const matchedTx = transactions.find((t) => t.id === stmt.matchedTransactionId);
                  return (
                    <tr key={stmt.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono text-slate-600">{stmt.date}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{stmt.description}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            stmt.type === 'CREDITO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {stmt.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        R$ {stmt.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                            stmt.status === 'CONCILIADO'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {stmt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-500">
                        {matchedTx ? (
                          <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                            {matchedTx.description} (R$ {matchedTx.amount.toFixed(2)})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pendente de conciliação</span>
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
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {acc.type.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Ativa
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">{acc.bankName}</h4>
              <div className="text-xs text-slate-500 space-y-0.5 font-mono">
                <p>Agência: {acc.agency}</p>
                <p>Conta Corrente: {acc.accountNumber}</p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Saldo Atual Disponível</span>
                <span className="text-xl font-mono font-black text-slate-900">
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
