import React, { useState } from 'react';
import {
  Users2,
  ShoppingCart,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Tag,
  Star,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DealStage, Customer, SaleOrder } from '../../types';

export const SalesCrmModule: React.FC<{ onOpenQuickSale: () => void }> = ({ onOpenQuickSale }) => {
  const { customers, saleOrders, updateSaleStage, addCustomer, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'PIPELINE' | 'PEDIDOS' | 'CLIENTES'>('PIPELINE');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);

  // New Customer Form State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custDoc, setCustDoc] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custNotes, setCustNotes] = useState('');

  const stages: { id: DealStage; label: string; color: string }[] = [
    { id: 'ORCAMENTO', label: '1. Orçamento / Lead', color: 'border-slate-600 bg-slate-900/50' },
    { id: 'NEGOCIACAO', label: '2. Em Negociação', color: 'border-amber-500/50 bg-amber-950/20' },
    { id: 'APROVADO', label: '3. Proposta Aprovada', color: 'border-blue-500/50 bg-blue-950/20' },
    { id: 'CONCLUIDO', label: '4. Concluído / Faturado', color: 'border-emerald-500/50 bg-emerald-950/20' }
  ];

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName) {
      showToast('O nome do cliente é obrigatório.', 'warning');
      return;
    }

    addCustomer({
      name: custName,
      email: custEmail || 'cliente@contato.com.br',
      phone: custPhone || '(11) 90000-0000',
      document: custDoc || '000.000.000-00',
      address: custAddress || 'São Paulo - SP',
      status: 'ATIVO',
      notes: custNotes
    });

    setIsNewCustModalOpen(false);
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustDoc('');
    setCustAddress('');
    setCustNotes('');
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.document.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('PIPELINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'PIPELINE'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Funil Comercial (Kanban)
          </button>
          <button
            onClick={() => setActiveSubTab('PEDIDOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'PEDIDOS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Histórico de Pedidos ({saleOrders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('CLIENTES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'CLIENTES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Base de Clientes & CRM ({customers.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'CLIENTES' ? (
            <button
              onClick={() => setIsNewCustModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Cliente</span>
            </button>
          ) : (
            <button
              onClick={onOpenQuickSale}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Venda / Pedido</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Funil Comercial / Pipeline Kanban */}
      {activeSubTab === 'PIPELINE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stages.map((stg) => {
            const stageOrders = saleOrders.filter((o) => o.stage === stg.id);
            const totalStage = stageOrders.reduce((s, o) => s + o.totalAmount, 0);

            return (
              <div
                key={stg.id}
                className={`p-4 rounded-2xl border ${stg.color} flex flex-col justify-between shadow-lg space-y-3 min-h-[420px]`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white tracking-wide">{stg.label}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {stageOrders.length}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Total: R$ {totalStage.toFixed(2)}
                  </div>

                  {/* Deals cards */}
                  <div className="mt-3 space-y-2.5">
                    {stageOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-white">{order.customerName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-semibold">
                            {order.orderNumber}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 line-clamp-2">
                          {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                          <span className="text-xs font-mono font-black text-emerald-400">
                            R$ {order.totalAmount.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500">{order.channel}</span>
                        </div>

                        {/* Stage Mover */}
                        <div className="pt-1 flex items-center justify-end gap-1">
                          {stg.id !== 'CONCLUIDO' && (
                            <button
                              onClick={() => {
                                const nextStageIndex = stages.findIndex((s) => s.id === stg.id) + 1;
                                if (stages[nextStageIndex]) {
                                  updateSaleStage(order.id, stages[nextStageIndex].id);
                                }
                              }}
                              className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800"
                            >
                              <span>Avançar Etapa</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px] text-slate-500">
                  {stageOrders.length === 0 && 'Nenhuma oportunidade nesta etapa.'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Histórico de Pedidos */}
      {activeSubTab === 'PEDIDOS' && (
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nº Pedido / Data</th>
                  <th className="py-3 px-4">Cliente (CRM)</th>
                  <th className="py-3 px-4">Canal</th>
                  <th className="py-3 px-4">Itens & Quantidades</th>
                  <th className="py-3 px-4 text-right">Valor Total</th>
                  <th className="py-3 px-4">Pagamento</th>
                  <th className="py-3 px-4 text-center">Etapa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {saleOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-white block">{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{ord.date}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{ord.customerName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {ord.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(' + ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      R$ {ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{ord.paymentMethod}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          ord.stage === 'CONCLUIDO'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ord.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Base de Clientes & CRM */}
      {activeSubTab === 'CLIENTES' && (
        <div className="space-y-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar cliente por nome, email ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.status === 'VIP'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {cust.status === 'VIP' ? '★ CLIENTE VIP' : 'ATIVO'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {cust.ordersCount} pedidos
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{cust.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400">{cust.document}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cust.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate text-[11px]">{cust.address}</span>
                    </div>
                  </div>

                  {cust.notes && (
                    <div className="mt-3 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 italic">
                      "{cust.notes}"
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Gasto Total (LTV)</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    R$ {cust.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Novo Cliente */}
      {isNewCustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cadastrar Novo Cliente no CRM</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nome Completo / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Mariana Ramos"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@dominio.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">CPF ou CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={custDoc}
                  onChange={(e) => setCustDoc(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Rua, Número, Bairro, Cidade"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Preferências & Notas</label>
                <input
                  type="text"
                  placeholder="Ex: Prefere mesa perto da adega, vinho tinto, etc."
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
