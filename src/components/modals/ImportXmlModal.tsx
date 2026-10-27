import React, { useState } from 'react';
import { X, FileUp, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_NFE_XML_1 } from '../../data/initialData';

interface ImportXmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportXmlModal: React.FC<ImportXmlModalProps> = ({ isOpen, onClose }) => {
  const { importNFeXml, showToast } = useApp();
  const [xmlText, setXmlText] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    itemsCount: number;
    costChanges: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleProcessXml = (content: string) => {
    if (!content.trim()) {
      showToast('Insira ou carregue um arquivo XML de NF-e válido.', 'warning');
      return;
    }
    const res = importNFeXml(content);
    setResult(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setXmlText(text);
        handleProcessXml(text);
      };
      reader.readAsText(file);
    }
  };

  const loadSampleXml = () => {
    setXmlText(SAMPLE_NFE_XML_1);
    handleProcessXml(SAMPLE_NFE_XML_1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Importador & Leitor de XML de NF-e</h2>
              <p className="text-xs text-slate-400">
                Padrão SEFAZ: atualiza estoque, recalcula CMV das fichas técnicas e lança conta a pagar
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Action options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all">
              <FileUp className="w-6 h-6 text-amber-400 mb-1.5" />
              <span className="text-xs font-bold text-white">Upload de Arquivo .XML</span>
              <span className="text-[11px] text-slate-400">NF-e emitida pelo fornecedor</span>
              <input
                type="file"
                accept=".xml,text/xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={loadSampleXml}
              className="border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all group"
            >
              <Sparkles className="w-6 h-6 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-amber-300">Carregar XML de Demonstração</span>
              <span className="text-[11px] text-slate-400">
                NF-e Frigorífico Boi Gordo (Carnes & Filé Mignon)
              </span>
            </button>
          </div>

          {/* Paste manual XML */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ou cole o código XML da NF-e diretamente:
            </label>
            <textarea
              rows={5}
              value={xmlText}
              onChange={(e) => setXmlText(e.target.value)}
              placeholder="Cole aqui o conteúdo de <?xml version='1.0' encoding='UTF-8'?><nfeProc>..."
              className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Results Box */}
          {result && (
            <div
              className={`p-4 rounded-xl border ${
                result.success
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                <span>{result.message}</span>
              </div>

              {result.success && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    Foram processados e inseridos <strong>{result.itemsCount} itens</strong> no seu estoque e criada a respectiva conta a pagar com vencimento para 15 dias.
                  </p>

                  {result.costChanges.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                      <span className="font-bold text-amber-300 block">
                        Impacto no Custo dos Insumos (Ficha Técnica Viva):
                      </span>
                      {result.costChanges.map((change, idx) => (
                        <div key={idx} className="text-amber-200 bg-amber-950/40 px-2.5 py-1 rounded">
                          {change}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            Formato: NF-e modelo 55 SEFAZ v4.00
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Fechar
            </button>
            <button
              onClick={() => handleProcessXml(xmlText)}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Processar & Atualizar Estoque</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
