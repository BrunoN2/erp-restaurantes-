import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Layers,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';

interface RevenueDataPoint {
  label: string;
  fullDate: string;
  revenue: number; // Receita Bruta
  cmv: number;     // Insumos
  expenses: number;// Despesas Operacionais
  netProfit: number; // Lucro Líquido
}

export const RevenueChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'MONTHS' | 'WEEKS' | 'DAYS'>('MONTHS');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Realistic data points for restaurant/enterprise revenue
  const monthlyData: RevenueDataPoint[] = [
    { label: 'Mai', fullDate: 'Maio 2026', revenue: 74200, cmv: 23744, expenses: 28100, netProfit: 22356 },
    { label: 'Jun', fullDate: 'Junho 2026', revenue: 81500, cmv: 25265, expenses: 29400, netProfit: 26835 },
    { label: 'Jul', fullDate: 'Julho 2026', revenue: 89300, cmv: 28576, expenses: 31200, netProfit: 29524 },
    { label: 'Ago', fullDate: 'Agosto 2026', revenue: 84600, cmv: 26226, expenses: 30500, netProfit: 27874 },
    { label: 'Set', fullDate: 'Setembro 2026', revenue: 95400, cmv: 29574, expenses: 32800, netProfit: 33026 },
    { label: 'Out', fullDate: 'Outubro 2026 (Atual)', revenue: 104850, cmv: 31455, expenses: 34100, netProfit: 39295 }
  ];

  const weeklyData: RevenueDataPoint[] = [
    { label: 'Sem 1', fullDate: '01 a 07 de Outubro', revenue: 23400, cmv: 7254, expenses: 8100, netProfit: 8046 },
    { label: 'Sem 2', fullDate: '08 a 14 de Outubro', revenue: 26100, cmv: 7830, expenses: 8350, netProfit: 9920 },
    { label: 'Sem 3', fullDate: '15 a 21 de Outubro', revenue: 27850, cmv: 8355, expenses: 8700, netProfit: 10795 },
    { label: 'Sem 4', fullDate: '22 a 28 de Outubro', revenue: 27500, cmv: 8016, expenses: 8950, netProfit: 10534 }
  ];

  const dailyData: RevenueDataPoint[] = [
    { label: 'Seg', fullDate: 'Segunda-feira (22/10)', revenue: 2850, cmv: 855, expenses: 950, netProfit: 1045 },
    { label: 'Ter', fullDate: 'Terça-feira (23/10)', revenue: 3420, cmv: 1026, expenses: 1100, netProfit: 1294 },
    { label: 'Qua', fullDate: 'Quarta-feira (24/10)', revenue: 4190, cmv: 1257, expenses: 1250, netProfit: 1683 },
    { label: 'Qui', fullDate: 'Quinta-feira (25/10)', revenue: 5380, cmv: 1614, expenses: 1450, netProfit: 2316 },
    { label: 'Sex', fullDate: 'Sexta-feira (26/10)', revenue: 9840, cmv: 2952, expenses: 2200, netProfit: 4688 },
    { label: 'Sáb', fullDate: 'Sábado (27/10)', revenue: 14820, cmv: 4446, expenses: 2900, netProfit: 7474 },
    { label: 'Dom', fullDate: 'Domingo (28/10)', revenue: 8920, cmv: 2676, expenses: 1950, netProfit: 4294 }
  ];

  const currentData = timeframe === 'MONTHS' ? monthlyData : timeframe === 'WEEKS' ? weeklyData : dailyData;

  const totalPeriodRevenue = currentData.reduce((s, d) => s + d.revenue, 0);
  const totalPeriodNet = currentData.reduce((s, d) => s + d.netProfit, 0);
  const avgMargin = totalPeriodRevenue > 0 ? (totalPeriodNet / totalPeriodRevenue) * 100 : 0;

  // Chart dimensions & calculations
  const maxRevenue = Math.max(...currentData.map((d) => d.revenue)) * 1.15;
  const chartHeight = 220;
  const chartWidth = 600;

  // Compute SVG Points
  const pointsRevenue = currentData.map((d, i) => {
    const x = (i / (currentData.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - 30 - (d.revenue / maxRevenue) * (chartHeight - 60);
    return { x, y, data: d };
  });

  const pointsNetProfit = currentData.map((d, i) => {
    const x = (i / (currentData.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - 30 - (d.netProfit / maxRevenue) * (chartHeight - 60);
    return { x, y, data: d };
  });

  const pointsCmv = currentData.map((d, i) => {
    const x = (i / (currentData.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - 30 - (d.cmv / maxRevenue) * (chartHeight - 60);
    return { x, y, data: d };
  });

  const revenuePathD = pointsRevenue.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pointsRevenue[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const netPathD = pointsNetProfit.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pointsNetProfit[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  // Fill area under revenue curve
  const firstPoint = pointsRevenue[0];
  const lastPoint = pointsRevenue[pointsRevenue.length - 1];
  const areaPathD = `${revenuePathD} L ${lastPoint.x} ${chartHeight - 30} L ${firstPoint.x} ${chartHeight - 30} Z`;

  const activePoint = hoveredIndex !== null ? currentData[hoveredIndex] : currentData[currentData.length - 1];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Top Header of Chart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Evolução Total de Rendimentos
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200/80">
              Receita & Lucratividade
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrativo de faturamento bruto vs. lucro líquido real apurado
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/70 text-xs font-semibold">
          <button
            onClick={() => setTimeframe('MONTHS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'MONTHS'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6 Meses
          </button>
          <button
            onClick={() => setTimeframe('WEEKS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'WEEKS'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semanas
          </button>
          <button
            onClick={() => setTimeframe('DAYS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'DAYS'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semana Atual
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-5">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Rendimento no Período
          </span>
          <span className="text-xl font-black text-slate-900 font-mono tracking-tight mt-0.5 block">
            R$ {totalPeriodRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
            Lucro Líquido Real
          </span>
          <span className="text-xl font-black text-emerald-700 font-mono tracking-tight mt-0.5 block">
            R$ {totalPeriodNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Margem Líquida Média
          </span>
          <span className="text-xl font-black text-slate-900 font-mono tracking-tight mt-0.5 block">
            {avgMargin.toFixed(1)}%
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
            Ponto em Destaque
          </span>
          <span className="text-xs font-bold text-amber-800 block mt-0.5 truncate">
            {activePoint.fullDate}: R$ {activePoint.revenue.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Interactive Minimalist SVG Graph */}
      <div className="relative pt-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 sm:h-64 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - 30 - pct * (chartHeight - 60);
            return (
              <g key={idx}>
                <line
                  x1="30"
                  y1={y}
                  x2={chartWidth - 30}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={pct === 0 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x="24"
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  R${Math.round((pct * maxRevenue) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Area fill under curve */}
          <path d={areaPathD} fill="url(#revenueGradient)" />

          {/* Line for Total Revenue */}
          <path
            d={revenuePathD}
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Line for Net Profit */}
          <path
            d={netPathD}
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />

          {/* Data Points & Interactive hover columns */}
          {pointsRevenue.map((p, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Invisible hover area trigger */}
                <rect
                  x={p.x - 20}
                  y="10"
                  width="40"
                  height={chartHeight - 40}
                  fill="transparent"
                />

                {/* Vertical hover indicator line */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1="10"
                    x2={p.x}
                    y2={chartHeight - 30}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point dot on Revenue */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 3.5}
                  className="transition-all"
                  fill="#ffffff"
                  stroke="#d97706"
                  strokeWidth={isHovered ? 3 : 2}
                />

                {/* Point dot on Net Profit */}
                <circle
                  cx={pointsNetProfit[i].x}
                  cy={pointsNetProfit[i].y}
                  r={isHovered ? 4.5 : 2.5}
                  className="transition-all"
                  fill="#ffffff"
                  stroke="#059669"
                  strokeWidth="2"
                />

                {/* Bottom X-axis labels */}
                <text
                  x={p.x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold transition-colors ${
                    isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {p.data.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Minimalist Floating Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-3 z-20 pointer-events-none border border-slate-800 animate-in fade-in zoom-in-95 duration-150"
          >
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                {currentData[hoveredIndex].fullDate}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-amber-400 font-mono font-bold">
                  Receita: R$ {currentData[hoveredIndex].revenue.toLocaleString('pt-BR')}
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  Lucro Líq: R$ {currentData[hoveredIndex].netProfit.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend & Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-3 h-1 rounded-full bg-amber-500" />
            <span>Receita Bruta Total</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-3 h-0.5 border-t-2 border-emerald-600 border-dashed" />
            <span>Lucro Líquido Real</span>
          </div>
        </div>

        <span className="text-slate-400 text-[11px] font-medium">
          Dica: passe o cursor sobre as colunas para ver detalhes de cada período
        </span>
      </div>
    </div>
  );
};
