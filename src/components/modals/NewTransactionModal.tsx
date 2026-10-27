import React, { useState } from 'react';
import { X, Wallet, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType, PaymentMethod, PaymentStatus } from '../../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, bankAccounts, showToast } = useApp();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('DESPESA');
  const [category, setCategory] = useState('CMV - Insumos');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<PaymentStatus>('PENDENTE');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [entityName, setEntityName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Preencha a descrição e um valor válido.', 'warning');
      return;
    }

    addTransaction({
      description,
      amount: parsedAmount,
      type,
      category,
      dueDate,
      paymentDate: status === 'PAGO' ? dueDate : undefined,
      status,
      paymentMethod,
      entityName: entityName || (type === 'RECEITA' ? 'Cliente Diverso' : 'Fornecedor Diverso'),
      documentNumber: documentNumber || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      bankAccountId: status === 'PAGO' ? bankAccountId : undefined,
      originModule: 'MANUAL'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Novo Lançamento Financeiro</h2>
              <p className="text-xs text-slate-400">
                Adicione receita ou despesa no fluxo de caixa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('RECEITA');
                setCategory('Vendas Restaurante');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'RECEITA'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              + Receita (A Receber)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('DESPESA');
                setCategory('CMV - Insumos');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'DESPESA'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              - Despesa (A Pagar)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descrição do Lançamento
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Compra de Embalagens Delivery, Aluguel, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {type === 'RECEITA' ? (
                  <>
                    <option value="Vendas Restaurante">Vendas Restaurante</option>
                    <option value="Delivery Online">Delivery Online</option>
                    <option value="Eventos & Corporativo">Eventos & Corporativo</option>
                    <option value="Rendimentos & Outros">Rendimentos & Outros</option>
                  </>
                ) : (
                  <>
                    <option value="CMV - Insumos">CMV - Insumos & Alimentos</option>
                    <option value="Pessoal & Salários">Pessoal & Salários</option>
                    <option value="Infraestrutura & Ocupação">Infraestrutura & Ocupação</option>
                    <option value="Utilidades">Utilidades (Luz, Gás, Água)</option>
                    <option value="Marketing & Apps">Marketing & Taxas Delivery</option>
                    <option value="Impostos & Tributos">Impostos & Tributos</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="PENDENTE">Pendente (Aberto)</option>
                <option value="PAGO">Pago / Liquidado</option>
                <option value="ATRASADO">Atrasado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {type === 'RECEITA' ? 'Cliente / Origem' : 'Fornecedor / Beneficiário'}
              </label>
              <input
                type="text"
                placeholder="Ex: Frigorífico Boi Gordo..."
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="PIX">Pix</option>
                <option value="BOLETO">Boleto</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="TRANSFERENCIA">Transferência / TED</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>
          </div>

          {status === 'PAGO' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Conta Bancária / Caixa
              </label>
              <select
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {bankAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} (Saldo: R$ {acc.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Salvar Lançamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
