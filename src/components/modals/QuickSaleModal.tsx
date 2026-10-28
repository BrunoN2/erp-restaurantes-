import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingCart, CheckCircle, Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, SaleItem } from '../../types';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({ isOpen, onClose }) => {
  const { customers, recipes, stock, createSaleOrder, showToast } = useApp();

  const [customerId, setCustomerId] = useState<string>(customers[0]?.id || '');
  const [channel, setChannel] = useState<'SALAO' | 'DELIVERY' | 'BALCAO' | 'CORPORATIVO'>('SALAO');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARTAO_CREDITO');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<SaleItem[]>([
    {
      recipeCardId: recipes[0]?.id,
      name: recipes[0]?.dishName || 'Prato',
      quantity: 1,
      unitPrice: recipes[0]?.salePrice || 94,
      subtotal: recipes[0]?.salePrice || 94
    }
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const defaultRecipe = recipes[0];
    if (defaultRecipe) {
      setItems((prev) => [
        ...prev,
        {
          recipeCardId: defaultRecipe.id,
          name: defaultRecipe.dishName,
          quantity: 1,
          unitPrice: defaultRecipe.salePrice,
          subtotal: defaultRecipe.salePrice
        }
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      showToast('O pedido deve conter pelo menos 1 item.', 'warning');
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemSelect = (index: number, recipeId: string) => {
    const selected = recipes.find((r) => r.id === recipeId);
    if (!selected) return;

    setItems((prev) =>
      prev.map((it, i) => {
        if (i === index) {
          return {
            recipeCardId: selected.id,
            name: selected.dishName,
            quantity: it.quantity,
            unitPrice: selected.salePrice,
            subtotal: it.quantity * selected.salePrice
          };
        }
        return it;
      })
    );
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const validQty = Math.max(1, qty);
    setItems((prev) =>
      prev.map((it, i) => {
        if (i === index) {
          return {
            ...it,
            quantity: validQty,
            subtotal: validQty * it.unitPrice
          };
        }
        return it;
      })
    );
  };

  const totalAmount = items.reduce((sum, it) => sum + it.subtotal, 0);
  const selectedCustomer = customers.find((c) => c.id === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      showToast('Selecione um cliente válido.', 'error');
      return;
    }

    createSaleOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items,
      totalAmount,
      channel,
      paymentMethod,
      stage: 'CONCLUIDO',
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Novo Pedido / Venda Comercial</h2>
              <p className="text-xs text-slate-500 font-medium">
                Baixa automática de insumos no estoque + lançamento de receita no financeiro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cliente (CRM)
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Canal de Venda
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
              >
                <option value="SALAO">Salão (Mesas & Presencial)</option>
                <option value="DELIVERY">Delivery (iFood / Próprio)</option>
                <option value="BALCAO">Balcão / Takeout</option>
                <option value="CORPORATIVO">Corporativo / Eventos</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                Itens do Cardápio / Fichas Técnicas
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex-1 min-w-0">
                    <select
                      value={item.recipeCardId}
                      onChange={(e) => handleItemSelect(idx, e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 truncate font-medium cursor-pointer"
                    >
                      {recipes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.dishName} — R$ {r.salePrice.toFixed(2)} (CMV: {r.cmvPercentage}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                      className="w-full text-xs text-center bg-white border border-slate-200 rounded-xl py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 font-mono font-bold"
                    />
                  </div>

                  <div className="w-24 text-right font-mono text-xs text-slate-900 font-bold">
                    R$ {item.subtotal.toFixed(2)}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
              >
                <option value="PIX">Pix Instantâneo (Liquidação imediata)</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="BOLETO">Boleto Bancário (Faturado)</option>
                <option value="DINHEIRO">Dinheiro em Espécie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Observações do Pedido
              </label>
              <input
                type="text"
                placeholder="Ex: Ponto da carne ao ponto para mais..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Sync explanation */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
            <span className="font-bold block">Sincronização em Tempo Real (Banco Único):</span>
            <p>
              Ao confirmar este pedido, o sistema abaterá automaticamente os gramas de Filé, Arroz e Azeite cadastrados na ficha técnica de cada prato, registrará a receita no Financeiro e atualizará o LTV do cliente no CRM.
            </p>
          </div>

          {/* Total Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold">Total do Pedido:</span>
              <p className="text-2xl font-black text-slate-900 font-mono">
                R$ {totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar & Baixar Estoque</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
