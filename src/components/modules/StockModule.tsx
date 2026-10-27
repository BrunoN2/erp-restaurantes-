import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  BookOpen,
  ClipboardList,
  Sparkles,
  Calculator,
  UtensilsCrossed,
  CheckCircle,
  History,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockItem, RecipeCard } from '../../types';

export const StockModule: React.FC = () => {
  const {
    stock,
    stockMovements,
    recipes,
    addStockItem,
    updateStockQuantity,
    addRecipe,
    recalculateRecipeCMV,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'ESTOQUE' | 'FICHAS' | 'MOVIMENTACOES' | 'INVENTARIO'>('ESTOQUE');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('TODAS');

  // Modal states for new stock item & new recipe
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState(false);
  const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState<RecipeCard | null>(null);

  // New Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Carnes e Proteínas');
  const [newItemUnit, setNewItemUnit] = useState<'KG' | 'UN' | 'L' | 'G' | 'ML' | 'PCT' | 'CX'>('KG');
  const [newItemCurrentStock, setNewItemCurrentStock] = useState('10');
  const [newItemMinStock, setNewItemMinStock] = useState('5');
  const [newItemCostPrice, setNewItemCostPrice] = useState('25.00');
  const [newItemLocation, setNewItemLocation] = useState('Câmara Fria');

  // Inventory Quick Adjustment State
  const [adjItemId, setAdjItemId] = useState(stock[0]?.id || '');
  const [adjNewQty, setAdjNewQty] = useState('');
  const [adjReason, setAdjReason] = useState('Contagem periódica de inventário');

  const categories = Array.from(new Set(stock.map((s) => s.category)));

  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'TODAS' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) {
      showToast('Insira o nome do insumo.', 'warning');
      return;
    }

    addStockItem({
      name: newItemName,
      code: newItemCode || `INS-${Math.floor(100 + Math.random() * 900)}`,
      category: newItemCategory,
      unit: newItemUnit,
      currentStock: parseFloat(newItemCurrentStock) || 0,
      minStock: parseFloat(newItemMinStock) || 0,
      maxStock: (parseFloat(newItemMinStock) || 5) * 4,
      costPrice: parseFloat(newItemCostPrice) || 0,
      location: newItemLocation
    });

    setIsNewItemModalOpen(false);
    setNewItemName('');
  };

  const handleApplyInventory = (e: React.FormEvent) => {
    e.preventDefault();
    const item = stock.find((s) => s.id === adjItemId);
    const newQuantity = parseFloat(adjNewQty);
    if (!item || isNaN(newQuantity) || newQuantity < 0) {
      showToast('Insira uma quantidade válida para o inventário.', 'warning');
      return;
    }

    const diff = newQuantity - item.currentStock;
    updateStockQuantity(item.id, diff, `Ajuste de Inventário Físico: ${adjReason}`, 'AJUSTE_INVENTARIO');
    setAdjNewQty('');
    showToast(`Estoque de "${item.name}" ajustado para ${newQuantity} ${item.unit}.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('ESTOQUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'ESTOQUE'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Insumos & Ruptura ({stock.length})
          </button>
          <button
            onClick={() => setActiveSubTab('FICHAS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'FICHAS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fichas Técnicas & CMV Vivo ({recipes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('MOVIMENTACOES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'MOVIMENTACOES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Histórico de Entradas & Saídas
          </button>
          <button
            onClick={() => setActiveSubTab('INVENTARIO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'INVENTARIO'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ajuste de Inventário Físico
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'ESTOQUE' && (
            <button
              onClick={() => setIsNewItemModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Insumo</span>
            </button>
          )}

          {activeSubTab === 'FICHAS' && (
            <button
              onClick={() => {
                recalculateRecipeCMV();
                showToast('CMVs recalculados com base no custo atual dos insumos!', 'success');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>Recalcular Todos os CMVs</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Insumos & Estoque */}
      {activeSubTab === 'ESTOQUE' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nome, código ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Categoria:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="TODAS">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código / Insumo</th>
                    <th className="py-3 px-4">Categoria & Localização</th>
                    <th className="py-3 px-4 text-center">Nível de Estoque</th>
                    <th className="py-3 px-4 text-right">Custo Unitário</th>
                    <th className="py-3 px-4 text-right">Valor Total em Estoque</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStock.map((item) => {
                    const isRupture = item.currentStock <= item.minStock;
                    const isWarning = item.currentStock <= item.minStock * 1.3 && !isRupture;
                    const stockValue = item.currentStock * item.costPrice;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{item.name}</span>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded inline-block">
                            {item.code}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-300 block">{item.category}</span>
                          <span className="text-[10px] text-slate-500">{item.location}</span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 font-mono font-bold">
                            <span className={isRupture ? 'text-rose-400 text-sm' : 'text-white'}>
                              {item.currentStock} {item.unit}
                            </span>
                            <span className="text-slate-500 text-[10px]">
                              / mín: {item.minStock} {item.unit}
                            </span>
                          </div>
                          {/* Mini progress bar */}
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
                            <div
                              className={`h-full ${
                                isRupture ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                              style={{
                                width: `${Math.min(100, (item.currentStock / item.maxStock) * 100)}%`
                              }}
                            />
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-300">
                          R$ {item.costPrice.toFixed(2)} /{item.unit}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-white">
                          R$ {stockValue.toFixed(2)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              isRupture
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isWarning
                                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isRupture ? 'RUPTURA' : isWarning ? 'ATENÇÃO' : 'NORMAL'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                const addAmount = prompt(
                                  `Quantas unidades (${item.unit}) deseja dar entrada para "${item.name}"?`,
                                  '5'
                                );
                                if (addAmount) {
                                  const val = parseFloat(addAmount);
                                  if (val > 0) {
                                    updateStockQuantity(item.id, val, 'Entrada rápida manual', 'ENTRADA');
                                  }
                                }
                              }}
                              title="Dar entrada rápida"
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[11px] font-semibold transition-colors"
                            >
                              + Entrada
                            </button>
                            <button
                              onClick={() => {
                                const subAmount = prompt(
                                  `Quantas unidades (${item.unit}) deseja dar baixa para "${item.name}"?`,
                                  '1'
                                );
                                if (subAmount) {
                                  const val = parseFloat(subAmount);
                                  if (val > 0) {
                                    updateStockQuantity(item.id, -val, 'Baixa manual/perda', 'SAIDA');
                                  }
                                }
                              }}
                              title="Dar baixa rápida / perda"
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 text-[11px] font-semibold transition-colors"
                            >
                              - Baixa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Fichas Técnicas & CMV Vivo */}
      {activeSubTab === 'FICHAS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                Fichas Técnicas "Vivas" com Fator de Correção (FC)
              </h3>
              <p className="text-xs text-slate-400">
                Se o quilo da carne sobe na nota fiscal, o custo do prato é recalculado na hora.
              </p>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Fórmula: Custo Líquido = Custo Bruto × Fator de Correção</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        recipe.quadrant === 'ESTRELA'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : recipe.quadrant === 'CAVALO_BATALHA'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : recipe.quadrant === 'QUEBRA_CABECAS'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {recipe.quadrant.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Preparo: {recipe.preparationTimeMinutes} min
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white mb-3">
                    {recipe.dishName}
                  </h4>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-4 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">
                        Preço Venda
                      </span>
                      <span className="font-mono font-bold text-white text-sm">
                        R$ {recipe.salePrice.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">
                        Custo CMV (R$)
                      </span>
                      <span className="font-mono font-bold text-rose-400 text-sm">
                        R$ {recipe.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">
                        CMV Real %
                      </span>
                      <span
                        className={`font-mono font-black text-sm ${
                          recipe.cmvPercentage <= 33 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {recipe.cmvPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Ingredients breakdown */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Composição dos Insumos (Por Porção):
                    </span>
                    {recipe.ingredients.map((ing, i) => (
                      <div
                        key={i}
                        className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/40"
                      >
                        <div>
                          <span className="text-slate-200 font-medium">{ing.name}</span>
                          <span className="text-[10px] text-slate-500 block">
                            Bruto: {ing.grossQty} {ing.unit} (FC: {ing.correctionFactor})
                          </span>
                        </div>
                        <span className="font-mono text-slate-300 font-semibold">
                          R$ {ing.totalCost.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Volume Mensal Estimado: {recipe.monthlySalesQty} unids</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    Margem Bruta: R$ {(recipe.salePrice - recipe.totalCost).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Histórico de Movimentações */}
      {activeSubTab === 'MOVIMENTACOES' && (
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Insumo</th>
                <th className="py-3 px-4 text-right">Quantidade</th>
                <th className="py-3 px-4">Motivo / Origem</th>
                <th className="py-3 px-4">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stockMovements.map((mov) => {
                const isEntrada = mov.type === 'ENTRADA';
                return (
                  <tr key={mov.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-slate-400">{mov.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          isEntrada
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : mov.type === 'AJUSTE_INVENTARIO'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {mov.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{mov.itemName}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                      {isEntrada ? '+' : '-'} {mov.quantity}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{mov.reason}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {mov.responsible}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 4: Ajuste de Inventário Físico */}
      {activeSubTab === 'INVENTARIO' && (
        <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Contagem & Inventário Físico</h3>
              <p className="text-xs text-slate-400">
                Ajuste o saldo real apurado na câmara fria ou despensa
              </p>
            </div>
          </div>

          <form onSubmit={handleApplyInventory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selecione o Insumo
              </label>
              <select
                value={adjItemId}
                onChange={(e) => setAdjItemId(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {stock.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Saldo atual no sistema: {s.currentStock} {s.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nova Quantidade Física Apurada
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Ex: 18.5"
                value={adjNewQty}
                onChange={(e) => setAdjNewQty(e.target.value)}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Justificativa / Motivo
              </label>
              <input
                type="text"
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Gravar Novo Saldo de Inventário</span>
            </button>
          </form>
        </div>
      )}

      {/* Modal: Novo Insumo */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cadastrar Novo Insumo / Produto</h3>
            <form onSubmit={handleCreateStockItem} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nome do Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Queijo Brie Francês"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Código</label>
                  <input
                    type="text"
                    placeholder="Ex: LAT-010"
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Unidade</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value as any)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="KG">Quilo (KG)</option>
                    <option value="UN">Unidade (UN)</option>
                    <option value="L">Litro (L)</option>
                    <option value="G">Grama (G)</option>
                    <option value="ML">Mililitro (ML)</option>
                    <option value="CX">Caixa (CX)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Qtd Atual</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newItemCurrentStock}
                    onChange={(e) => setNewItemCurrentStock(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Qtd Mínima</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemCostPrice}
                    onChange={(e) => setNewItemCostPrice(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Localização</label>
                <input
                  type="text"
                  placeholder="Ex: Câmara Fria 2, Despensa"
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Salvar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
