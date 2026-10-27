import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileUp,
  FileText,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  Download,
  Percent,
  Search,
  Building,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceType, Invoice } from '../../types';

export const FiscalModule: React.FC<{ onOpenImportXml: () => void }> = ({ onOpenImportXml }) => {
  const {
    invoices,
    taxConfig,
    updateTaxConfig,
    issueInvoice,
    company,
    transactions,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'NOTAS' | 'APURACAO' | 'CONFIG'>('NOTAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmitModalOpen, setIsEmitModalOpen] = useState(false);

  // New Invoice form state
  const [invType, setInvType] = useState<InvoiceType>('NFE');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCpfCnpj, setRecipientCpfCnpj] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [itemsSummary, setItemsSummary] = useState('');

  // Tax calculation based on paid revenue
  const totalRevenueMês = transactions
    .filter((t) => t.type === 'RECEITA' && t.status === 'PAGO')
    .reduce((s, t) => s + t.amount, 0);

  const valorDASSimples = totalRevenueMês * (taxConfig.aliquotaSimples / 100);
  const icmsEstimado = totalRevenueMês * (taxConfig.icmsAliquota / 100);
  const issEstimado = totalRevenueMês * (taxConfig.issAliquota / 100);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.number.includes(searchTerm) ||
      inv.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.recipientCpfCnpj.includes(searchTerm)
  );

  const handleEmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(totalValue);
    if (!recipientName || isNaN(val) || val <= 0) {
      showToast('Preencha os dados obrigatórios da nota fiscal.', 'warning');
      return;
    }

    const calculatedTax = val * (taxConfig.aliquotaSimples / 100);
    const newNumber = (invoices.length + 4813).toString().padStart(6, '0');

    issueInvoice({
      number: newNumber,
      series: invType === 'NFE' ? '1' : 'E',
      type: invType,
      recipientName,
      recipientCpfCnpj: recipientCpfCnpj || '000.000.000-00',
      issueDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      totalValue: val,
      taxValue: Number(calculatedTax.toFixed(2)),
      itemsSummary: itemsSummary || 'Produtos alimentícios e bebidas para consumo'
    });

    setIsEmitModalOpen(false);
    setRecipientName('');
    setTotalValue('');
    setItemsSummary('');
  };

  const handleDownloadXml = (inv: Invoice) => {
    const dataStr = 'data:text/xml;charset=utf-8,' + encodeURIComponent(inv.xmlMock);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NFe_${inv.number}.xml`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Arquivo XML da ${inv.type} ${inv.number} baixado!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('NOTAS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'NOTAS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Notas Fiscais Emitidas ({invoices.length})
          </button>
          <button
            onClick={() => setActiveSubTab('APURACAO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'APURACAO'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Apuração Básica de Impostos (DAS)
          </button>
          <button
            onClick={() => setActiveSubTab('CONFIG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'CONFIG'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Regime Tributário & Alíquotas
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImportXml}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Leitor de XML NF-e</span>
          </button>

          <button
            onClick={() => setIsEmitModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Nova NF-e / NFS-e</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Notas Fiscais Emitidas */}
      {activeSubTab === 'NOTAS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por número, destinatário ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Ambiente de Produção SEFAZ Autorizado
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Modelo / Número</th>
                    <th className="py-3 px-4">Destinatário & Documento</th>
                    <th className="py-3 px-4">Data Emissão</th>
                    <th className="py-3 px-4">Descrição Resumida</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                    <th className="py-3 px-4 text-right">Tributos</th>
                    <th className="py-3 px-4 text-center">Status SEFAZ</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold text-[10px] border border-amber-500/20">
                            {inv.type}
                          </span>
                          <span className="font-mono font-bold text-white">Nº {inv.number}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                          Série {inv.series}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{inv.recipientName}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {inv.recipientCpfCnpj}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400">{inv.issueDate}</td>

                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {inv.itemsSummary}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                        R$ {inv.totalValue.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        R$ {inv.taxValue.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1 mx-auto w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          AUTORIZADA
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDownloadXml(inv)}
                          title="Download do arquivo XML da SEFAZ"
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Download className="w-3 h-3" />
                          <span>XML</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Apuração Básica de Tributos (Simples Nacional) */}
      {activeSubTab === 'APURACAO' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Base de Cálculo (Receita Mensal)
              </span>
              <div className="text-2xl font-black text-white font-mono">
                R$ {totalRevenueMês.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total faturado no mês de referência
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase text-amber-400 block mb-1">
                Guia Única DAS (Simples Nacional)
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono">
                R$ {valorDASSimples.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Alíquota Efetiva: {taxConfig.aliquotaSimples}% (Anexo I Comércio/Alimentos)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Vencimento do Tributo
              </span>
              <div className="text-2xl font-black text-white font-mono">Dia 20 do Mês Subseq.</div>
              <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Situação Fiscal Regular
              </span>
            </div>
          </div>

          {/* Breakdown of taxes inside DAS */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-400" />
              Repartição Estimada dos Tributos Federais e Estaduais
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>ICMS Estadual (Alimentação e Bebidas)</span>
                  <span className="font-mono">R$ {icmsEstimado.toFixed(2)} (3.2%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[49%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>PIS / COFINS Federal</span>
                  <span className="font-mono">
                    R$ {(totalRevenueMês * 0.0365).toFixed(2)} (3.65%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>ISS Municipal (Serviços de Buffet / Eventos)</span>
                  <span className="font-mono">R$ {issEstimado.toFixed(2)} (2.0%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[16%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Configuração Tributária */}
      {activeSubTab === 'CONFIG' && (
        <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configuração Tributária da Empresa</h3>
              <p className="text-xs text-slate-400">{company.name} - CNPJ: {company.cnpj}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Regime de Tributação
              </label>
              <select
                value={taxConfig.regime}
                onChange={(e) => updateTaxConfig({ regime: e.target.value as any })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              >
                <option value="SIMPLES_NACIONAL">Simples Nacional (Recomendado para Restaurantes)</option>
                <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                <option value="LUCRO_REAL">Lucro Real</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alíquota Efetiva DAS (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxConfig.aliquotaSimples}
                  onChange={(e) =>
                    updateTaxConfig({ aliquotaSimples: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alíquota ICMS Estimada (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxConfig.icmsAliquota}
                  onChange={(e) =>
                    updateTaxConfig({ icmsAliquota: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-amber-400 block mb-1">
                Integração com Software Contábil:
              </span>
              Estes parâmetros alimentam o arquivo mensal para o contador (Domínio/Omie) e o DRE Gerencial Sintético do Mise.
            </div>
          </div>
        </div>
      )}

      {/* Modal: Emitir Nota Fiscal */}
      {isEmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Emitir Nova Nota Fiscal (SEFAZ)</h3>
            <form onSubmit={handleEmitInvoice} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInvType('NFE')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    invType === 'NFE'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  NF-e (Mercadorias / Salão)
                </button>
                <button
                  type="button"
                  onClick={() => setInvType('NFSE')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    invType === 'NFSE'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  NFS-e (Serviços / Eventos)
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Nome do Destinatário / Razão Social
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TechSolutions Brasil ou Consumidor Final"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={recipientCpfCnpj}
                    onChange={(e) => setRecipientCpfCnpj(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={totalValue}
                    onChange={(e) => setTotalValue(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Descrição dos Itens / Serviços
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2x Pratos Principais, Bebidas"
                  value={itemsSummary}
                  onChange={(e) => setItemsSummary(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmitModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Autorizar na SEFAZ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
