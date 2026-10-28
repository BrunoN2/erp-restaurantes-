import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  PieChart,
  UtensilsCrossed,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RevenueChart } from '../charts/RevenueChart';

export const DashboardModule: React.FC = () => {
  const {
    transactions,
    stock,
    recipes,
    bankAccounts,
    taxConfig,
    company,
    setActiveTab
  } = useApp();

  // Metrics Calculations
  const totalRevenue = transactions
    .filter((t) => t.type === 'RECEITA' && t.status === 'PAGO')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingRevenue = transactions
    .filter((t) => t.type === 'RECEITA' && t.status === 'PENDENTE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'DESPESA' && t.status === 'PAGO')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingExpense = transactions
    .filter((t) => t.type === 'DESPESA' && t.status === 'PENDENTE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netResult = totalRevenue - totalExpense;
  const netMargin = totalRevenue > 0 ? (netResult / totalRevenue) * 100 : 0;

  const totalBankBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Average CMV across menu items
  const avgCmv = recipes.length > 0 
    ? recipes.reduce((sum, r) => sum + r.cmvPercentage, 0) / recipes.length 
    : 0;

  // Rupture items
  const criticalItems = stock.filter((s) => s.currentStock <= s.minStock);

  // DRE Sintético Calculation
  const estimatedTax = totalRevenue * (taxConfig.aliquotaSimples / 100);
  const netRevenue = totalRevenue - estimatedTax;
  const cmvTotal = transactions
    .filter((t) => t.type === 'DESPESA' && t.category === 'CMV - Insumos' && t.status === 'PAGO')
    .reduce((sum, t) => sum + t.amount, 0);
  const grossProfit = netRevenue - cmvTotal;
  const operatingExpenses = totalExpense - cmvTotal;
  const operatingProfit = grossProfit - operatingExpenses;

  // Menu Engineering Quadrants
  const stars = recipes.filter((r) => r.quadrant === 'ESTRELA');
  const plowhorses = recipes.filter((r) => r.quadrant === 'CAVALO_BATALHA');
  const puzzles = recipes.filter((r) => r.quadrant === 'QUEBRA_CABECAS');
  const dogs = recipes.filter((r) => r.quadrant === 'CAO');

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for Rupture */}
      {criticalItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-center justify-between flex-wrap gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Atenção Operacional: {criticalItems.length} insumos atingiram o estoque de ruptura!
              </h4>
              <p className="text-xs text-rose-700/90">
                {criticalItems.map((c) => `${c.name} (${c.currentStock} ${c.unit})`).join(', ')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('COMPRAS')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            Emitir Ordem de Compra
          </button>
        </div>
      )}

      {/* KPI Cards Grid - Minimalist Light Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Receita Realizada (Mês)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+R$ {pendingRevenue.toFixed(2)} a receber</span>
          </div>
        </div>

        {/* Card 2: Despesas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Despesas Pagas (Mês)
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-amber-700 flex items-center gap-1 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>R$ {pendingExpense.toFixed(2)} pendentes</span>
          </div>
        </div>

        {/* Card 3: Saldo Bancário Consolidado */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saldo em Caixa & Bancos
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            R$ {totalBankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{bankAccounts.length} contas ativas e conciliadas</span>
          </div>
        </div>

        {/* Card 4: CMV Médio Gastronômico */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CMV Médio Cardápio
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
            <span>{avgCmv.toFixed(1)}%</span>
            <span className="text-xs text-slate-500 font-normal">Meta: 28% a 32%</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                avgCmv <= 32 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className={avgCmv <= 32 ? 'text-emerald-700' : 'text-amber-700 font-semibold'}>
              {avgCmv <= 32 ? 'Margem excelente' : 'Atenção ao custo de insumos'}
            </span>
          </div>
        </div>
      </div>

      {/* NEW: Gráfico de Total de Rendimentos Requisitado pelo Usuário */}
      <RevenueChart />

      {/* Main Grid: DRE Sintético & Matriz de Engenharia */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): DRE Sintético em Tempo Real */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-600" />
                DRE Sintético Gerencial
              </h3>
              <p className="text-xs text-slate-500">
                Demonstrativo de Resultado do Exercício
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Competência
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-700 font-semibold">(+) Receita Bruta de Vendas</span>
              <span className="font-mono font-bold text-slate-900">
                R$ {totalRevenue.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100 text-rose-700">
              <span>(-) Deduções e Impostos ({taxConfig.aliquotaSimples}% Simples)</span>
              <span className="font-mono font-semibold">- R$ {estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 bg-slate-50 px-2.5 rounded-xl font-bold text-slate-800">
              <span>(=) Receita Líquida</span>
              <span className="font-mono text-emerald-700">R$ {netRevenue.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100 text-rose-700">
              <span>(-) Custo Mercadoria Vendida (CMV Insumos)</span>
              <span className="font-mono font-semibold">- R$ {cmvTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 bg-slate-50 px-2.5 rounded-xl font-bold text-slate-800">
              <span>(=) Lucro Bruto</span>
              <span className="font-mono text-emerald-700">R$ {grossProfit.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100 text-rose-700">
              <span>(-) Despesas Operacionais (Salários, Aluguel, etc.)</span>
              <span className="font-mono font-semibold">- R$ {operatingExpenses.toFixed(2)}</span>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
              <div>
                <span className="text-xs font-black uppercase text-amber-950 block">
                  (=) Lucro Operacional (EBITDA)
                </span>
                <span className="text-[11px] text-slate-500">Margem Líquida Real</span>
              </div>
              <div className="text-right">
                <span
                  className={`text-lg font-mono font-black ${
                    operatingProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  R$ {operatingProfit.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">
                  {totalRevenue > 0 ? ((operatingProfit / totalRevenue) * 100).toFixed(1) : 0}% da Receita
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Matriz de Engenharia de Cardápio (Kasavana & Smith) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                Matriz de Engenharia de Cardápio (Menu Engineering)
              </h3>
              <p className="text-xs text-slate-500">
                Divisão automática dos pratos por Lucratividade (CMV) e Volume de Saída
              </p>
            </div>
            <button
              onClick={() => setActiveTab('ESTOQUE')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              Ver Fichas Técnicas →
            </button>
          </div>

          {/* 4 Quadrants Visual Grid - Light Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Estrelas */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    🌟 Estrelas (Stars)
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-200/70 text-emerald-900 font-mono font-bold">
                    {stars.length} pratos
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Alta margem & Alta saída. Mantenha destaque no cardápio e padrão de sabor.
                </p>
                <div className="space-y-1.5">
                  {stars.map((r) => (
                    <div
                      key={r.id}
                      className="text-xs p-2 rounded-xl bg-white border border-emerald-100 flex justify-between items-center shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">{r.dishName}</span>
                      <span className="font-mono text-emerald-700 font-bold shrink-0 ml-2">
                        CMV {r.cmvPercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Cavalos de Batalha */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    🐴 Cavalos de Batalha (Plowhorses)
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-200/70 text-amber-900 font-mono font-bold">
                    {plowhorses.length} pratos
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Alta saída, mas margem baixa! Aumente o preço ou renegocie os insumos.
                </p>
                <div className="space-y-1.5">
                  {plowhorses.map((r) => (
                    <div
                      key={r.id}
                      className="text-xs p-2 rounded-xl bg-white border border-amber-100 flex justify-between items-center shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">{r.dishName}</span>
                      <span className="font-mono text-amber-700 font-bold shrink-0 ml-2">
                        CMV {r.cmvPercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Quebra-cabeças */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                    🧩 Quebra-cabeças (Puzzles)
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-200/70 text-blue-900 font-mono font-bold">
                    {puzzles.length} pratos
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Margem altíssima, mas vende pouco. Crie combos e fotos apetitosas.
                </p>
                <div className="space-y-1.5">
                  {puzzles.map((r) => (
                    <div
                      key={r.id}
                      className="text-xs p-2 rounded-xl bg-white border border-blue-100 flex justify-between items-center shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">{r.dishName}</span>
                      <span className="font-mono text-blue-700 font-bold shrink-0 ml-2">
                        CMV {r.cmvPercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Cães */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5">
                    🐕 Cães (Dogs)
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-rose-200/70 text-rose-900 font-mono font-bold">
                    {dogs.length} pratos
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Baixa margem e baixa saída. Candidatos para substituição no cardápio.
                </p>
                <div className="space-y-1.5">
                  {dogs.map((r) => (
                    <div
                      key={r.id}
                      className="text-xs p-2 rounded-xl bg-white border border-rose-100 flex justify-between items-center shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">{r.dishName}</span>
                      <span className="font-mono text-rose-700 font-bold shrink-0 ml-2">
                        CMV {r.cmvPercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Todos os módulos sincronizados (Financeiro, Estoque, Fiscal, Vendas, Compras e RH).
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Regime: {taxConfig.regime}</span>
          <span className="text-emerald-700 font-mono font-bold">APIs Ativas: 4/4</span>
        </div>
      </div>
    </div>
  );
};
