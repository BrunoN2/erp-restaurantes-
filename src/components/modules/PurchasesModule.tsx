import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Truck,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Star,
  FileText,
  AlertTriangle,
  Building,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Supplier, PurchaseOrder, PaymentMethod } from '../../types';

export const PurchasesModule: React.FC = () => {
  const {
    suppliers,
    purchaseOrders,
    quotations,
    stock,
    addSupplier,
    createPurchaseOrder,
    receivePurchaseOrder,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'ORDENS' | 'SUGESTAO' | 'FORNECEDORES' | 'COTACOES'>('ORDENS');
  const [isNewPoModalOpen, setIsNewPoModalOpen] = useState(false);
  const [isNewSupModalOpen, setIsNewSupModalOpen] = useState(false);

  // New PO form state
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedStockItemId, setSelectedStockItemId] = useState(stock[0]?.id || '');
  const [poQuantity, setPoQuantity] = useState('20');
  const [poPaymentMethod, setPoPaymentMethod] = useState<PaymentMethod>('BOLETO');
  const [poNotes, setPoNotes] = useState('');

  // New Supplier form state
  const [supName, setSupName] = useState('');
  const [supTradeName, setSupTradeName] = useState('');
  const [supCnpj, setSupCnpj] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supCategory, setSupCategory] = useState<Supplier['category']>('CARNES');
  const [supPaymentTerms, setSupPaymentTerms] = useState('28 dias no boleto');

  // Intelligent purchasing suggestion (Items below minStock)
  const itemsNeedingRestock = stock.filter((s) => s.currentStock <= s.minStock * 1.2);

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === selectedSupplierId);
    const item = stock.find((s) => s.id === selectedStockItemId);
    const qty = parseFloat(poQuantity);

    if (!sup || !item || isNaN(qty) || qty <= 0) {
      showToast('Selecione fornecedor, item e quantidade válida.', 'warning');
      return;
    }

    const totalAmount = qty * item.costPrice;

    createPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      deliveryDateExpected: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'ENVIADA_FORNECEDOR',
      paymentMethod: poPaymentMethod,
      totalAmount,
      notes: poNotes,
      items: [
        {
          stockItemId: item.id,
          itemName: item.name,
          quantity: qty,
          unit: item.unit,
          unitPrice: item.costPrice,
          totalPrice: totalAmount
        }
      ]
    });

    setIsNewPoModalOpen(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName) {
      showToast('O nome do fornecedor é obrigatório.', 'warning');
      return;
    }

    addSupplier({
      name: supName,
      tradeName: supTradeName || supName,
      cnpj: supCnpj || '00.000.000/0001-00',
      contactName: supContact || 'Comercial',
      phone: supPhone || '(11) 90000-0000',
      email: supEmail || 'vendas@fornecedor.com.br',
      category: supCategory,
      paymentTerms: supPaymentTerms,
      rating: 5.0
    });

    setIsNewSupModalOpen(false);
    setSupName('');
    setSupTradeName('');
    setSupCnpj('');
    setSupPhone('');
    setSupEmail('');
  };

  const handleSendWhatsapp = (po: PurchaseOrder) => {
    const sup = suppliers.find((s) => s.id === po.supplierId);
    const itemsText = po.items.map((it) => `• ${it.quantity} ${it.unit} de ${it.itemName}`).join('%0A');
    const msg = `Olá ${sup?.contactName || 'Equipe'}, segue Pedido Oficial do Mise Gastronomia (${po.orderNumber}):%0A%0A${itemsText}%0A%0AValor Total Previsto: R$ ${po.totalAmount.toFixed(2)}%0APrevisão de entrega: ${po.deliveryDateExpected}%0A%0APor favor confirme o recebimento e o prazo!`;
    const cleanPhone = (sup?.phone || '5511999999999').replace(/\D/g, '');
    const url = `https://wa.me/55${cleanPhone}?text=${msg}`;
    window.open(url, '_blank');
    showToast(`Mensagem formatada para o WhatsApp do fornecedor ${po.supplierName}!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('ORDENS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'ORDENS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ordens de Compra ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('SUGESTAO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'SUGESTAO'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sugestão de Reposição Inteligente
          </button>
          <button
            onClick={() => setActiveSubTab('FORNECEDORES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'FORNECEDORES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fornecedores Homologados ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('COTACOES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'COTACOES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mapa Comparativo de Cotações
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'FORNECEDORES' ? (
            <button
              onClick={() => setIsNewSupModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Fornecedor</span>
            </button>
          ) : (
            <button
              onClick={() => setIsNewPoModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Ordem de Compra</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Ordens de Compra */}
      {activeSubTab === 'ORDENS' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Nº Ordem / Emissão</th>
                    <th className="py-3 px-4">Fornecedor</th>
                    <th className="py-3 px-4">Previsão Entrega</th>
                    <th className="py-3 px-4">Itens Solicitados</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Ações Integradas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-white block">{po.orderNumber}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{po.issueDate}</span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-200">{po.supplierName}</td>

                      <td className="py-3 px-4 font-mono text-slate-400">{po.deliveryDateExpected}</td>

                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {po.items.map((it) => `${it.quantity} ${it.unit} de ${it.itemName}`).join(', ')}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                        R$ {po.totalAmount.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            po.status === 'RECEBIDA'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : po.status === 'ENVIADA_FORNECEDOR'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {po.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Send WhatsApp */}
                          <button
                            onClick={() => handleSendWhatsapp(po)}
                            title="Disparar pedido formatado para o WhatsApp do vendedor"
                            className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* Receive Delivery (Cross-Module Stock & Financial Trigger) */}
                          {po.status !== 'RECEBIDA' ? (
                            <button
                              onClick={() => receivePurchaseOrder(po.id)}
                              title="Dar entrada no estoque e gerar conta a pagar no financeiro"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-[11px] font-semibold transition-all flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Receber</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Entregue
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Sugestão de Reposição Inteligente */}
      {activeSubTab === 'SUGESTAO' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Previsão de Demanda & Reposição Automática</h3>
                <p className="text-xs text-slate-400">
                  O sistema analisa o ponto de pedido e sugere a quantidade exata para compra sem gerar desperdício
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsNeedingRestock.map((item) => {
              const suggestedBuy = Math.ceil(item.maxStock - item.currentStock);
              const estimatedCost = suggestedBuy * item.costPrice;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-amber-400 font-bold">{item.code}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                        Estoque Baixo
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">
                      Saldo Atual: <strong className="text-rose-400">{item.currentStock} {item.unit}</strong> | Mínimo: {item.minStock} {item.unit}
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Sugestão de Compra:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {suggestedBuy} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Custo Estimado:</span>
                        <span className="font-mono font-bold text-white">
                          R$ {estimatedCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const sup = suppliers[0];
                      if (!sup) return;
                      createPurchaseOrder({
                        supplierId: sup.id,
                        supplierName: sup.name,
                        deliveryDateExpected: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                        status: 'ENVIADA_FORNECEDOR',
                        paymentMethod: 'BOLETO',
                        totalAmount: estimatedCost,
                        notes: `Reposição sugerida automática para ${item.name}`,
                        items: [
                          {
                            stockItemId: item.id,
                            itemName: item.name,
                            quantity: suggestedBuy,
                            unit: item.unit,
                            unitPrice: item.costPrice,
                            totalPrice: estimatedCost
                          }
                        ]
                      });
                      setActiveSubTab('ORDENS');
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Gerar Pedido Automático</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Fornecedores Homologados */}
      {activeSubTab === 'FORNECEDORES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {sup.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{sup.rating.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{sup.tradeName}</h4>
                <p className="text-xs text-slate-400">{sup.name}</p>
                <p className="text-[10px] font-mono text-slate-500">CNPJ: {sup.cnpj}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sup.phone} ({sup.contactName})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sup.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Condições de Pagamento: <strong className="text-slate-200">{sup.paymentTerms}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 4: Mapa Comparativo de Cotações */}
      {activeSubTab === 'COTACOES' && (
        <div className="space-y-4">
          {quotations.map((quot) => (
            <div
              key={quot.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{quot.title}</h4>
                  <span className="text-xs text-slate-400 font-mono">Data: {quot.date}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  {quot.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {quot.supplierOffers.map((off, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border ${
                      off.isWinner
                        ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white">{off.supplierName}</span>
                      {off.isWinner && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                          MELHOR PREÇO
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-mono font-black text-white mt-2">
                      R$ {off.totalOffered.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Prazo de entrega: {off.deliveryTimeDays} dias
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Nova Ordem de Compra */}
      {isNewPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Criar Ordem de Compra (OC)</h3>
            <form onSubmit={handleCreatePo} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Fornecedor Homologado</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.tradeName} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Insumo a Adquirir</label>
                <select
                  value={selectedStockItemId}
                  onChange={(e) => setSelectedStockItemId(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {stock.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — Custo Ref: R$ {item.costPrice.toFixed(2)} /{item.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Quantidade</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Forma de Pagamento</label>
                  <select
                    value={poPaymentMethod}
                    onChange={(e) => setPoPaymentMethod(e.target.value as any)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="BOLETO">Boleto Bancário</option>
                    <option value="PIX">Pix</option>
                    <option value="TRANSFERENCIA">Transferência</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Observações do Pedido</label>
                <input
                  type="text"
                  placeholder="Ex: Entregar antes das 10h da manhã"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPoModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Salvar Ordem de Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Fornecedor */}
      {isNewSupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cadastrar Novo Fornecedor</h3>
            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Distribuidora de Alimentos Sul Ltda"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Nome Fantasia</label>
                  <input
                    type="text"
                    placeholder="Ex: Alimentos Sul"
                    value={supTradeName}
                    onChange={(e) => setSupTradeName(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Categoria</label>
                  <select
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="CARNES">Carnes</option>
                    <option value="HORTIFRUTI">Hortifrúti</option>
                    <option value="LATICINIOS">Laticínios</option>
                    <option value="BEBIDAS">Bebidas</option>
                    <option value="EMBALAGENS">Embalagens</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">CNPJ</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={supCnpj}
                    onChange={(e) => setSupCnpj(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 98888-7777"
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSupModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
