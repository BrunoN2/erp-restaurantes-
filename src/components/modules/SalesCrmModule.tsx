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
    { id: 'ORCAMENTO', label: '1. Orçamento / Lead', color: 'border-slate-200 bg-slate-50/70' },
    { id: 'NEGOCIACAO', label: '2. Em Negociação', color: 'border-amber-200 bg-amber-50/60' },
    { id: 'APROVADO', label: '3. Proposta Aprovada', color: 'border-blue-200 bg-blue-50/60' },
    { id: 'CONCLUIDO', label: '4. Concluído / Faturado', color: 'border-emerald-200 bg-emerald-50/60' }
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setActiveSubTab('PIPELINE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'PIPELINE'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Funil Comercial (Kanban)
          </button>
          <button
            onClick={() => setActiveSubTab('PEDIDOS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'PEDIDOS'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Histórico de Pedidos ({saleOrders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('CLIENTES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'CLIENTES'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Base de Clientes & CRM ({customers.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'CLIENTES' ? (
            <button
              onClick={() => setIsNewCustModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Cliente</span>
            </button>
          ) : (
            <button
              onClick={onOpenQuickSale}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
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
                className={`p-4 rounded-3xl border ${stg.color} flex flex-col justify-between shadow-2xs space-y-3 min-h-[420px]`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-xs font-extrabold text-slate-900 tracking-wide">{stg.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-slate-700 shadow-2xs">
                      {stageOrders.length}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">
                    Total: R$ {totalStage.toFixed(2)}
                  </div>

                  {/* Deals cards */}
                  <div className="mt-3 space-y-2.5">
                    {stageOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-extrabold text-slate-900">{order.customerName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                            {order.orderNumber}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 line-clamp-2">
                          {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                          <span className="text-xs font-mono font-black text-emerald-700">
                            R$ {order.totalAmount.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">{order.channel}</span>
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
                              className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
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

                <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
                  {stageOrders.length === 0 && 'Nenhuma oportunidade nesta etapa.'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Histórico de Pedidos */}
      {activeSubTab === 'PEDIDOS' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nº Pedido / Data</th>
                  <th className="py-3.5 px-4">Cliente (CRM)</th>
                  <th className="py-3.5 px-4">Canal</th>
                  <th className="py-3.5 px-4">Itens & Quantidades</th>
                  <th className="py-3.5 px-4 text-right">Valor Total</th>
                  <th className="py-3.5 px-4">Pagamento</th>
                  <th className="py-3.5 px-4 text-center">Etapa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {saleOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ord.date}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{ord.customerName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {ord.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate font-medium">
                      {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(' + ')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                      R$ {ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{ord.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          ord.stage === 'CONCLUIDO'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
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
              className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.status === 'VIP'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {cust.status === 'VIP' ? '★ CLIENTE VIP' : 'ATIVO'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {cust.ordersCount} pedidos
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900">{cust.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400">{cust.document}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cust.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate text-[11px]">{cust.address}</span>
                    </div>
                  </div>

                  {cust.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 italic">
                      "{cust.notes}"
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Gasto Total (LTV)</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-4 text-slate-900">
            <h3 className="text-base font-extrabold text-slate-900">Cadastrar Novo Cliente no CRM</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Mariana Ramos"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@dominio.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CPF ou CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={custDoc}
                  onChange={(e) => setCustDoc(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Rua, Número, Bairro, Cidade"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferências & Notas</label>
                <input
                  type="text"
                  placeholder="Ex: Prefere mesa perto da adega, vinho tinto, etc."
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
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
