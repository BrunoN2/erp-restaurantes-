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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Importador & Leitor de XML de NF-e</h2>
              <p className="text-xs text-slate-500 font-medium">
                Padrão SEFAZ: atualiza estoque, recalcula CMV das fichas técnicas e lança conta a pagar
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Action options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-amber-50/50 transition-all">
              <FileUp className="w-6 h-6 text-amber-600 mb-1.5" />
              <span className="text-xs font-bold text-slate-900">Upload de Arquivo .XML</span>
              <span className="text-[11px] text-slate-500 font-medium">NF-e emitida pelo fornecedor</span>
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
              className="border border-amber-200 bg-amber-50/80 hover:bg-amber-100/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            >
              <Sparkles className="w-6 h-6 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-amber-900">Carregar XML de Demonstração</span>
              <span className="text-[11px] text-amber-800/80 font-medium">
                NF-e Frigorífico Boi Gordo (Carnes & Filé Mignon)
              </span>
            </button>
          </div>

          {/* Paste manual XML */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ou cole o código XML da NF-e diretamente:
            </label>
            <textarea
              rows={5}
              value={xmlText}
              onChange={(e) => setXmlText(e.target.value)}
              placeholder="Cole aqui o conteúdo de <?xml version='1.0' encoding='UTF-8'?><nfeProc>..."
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Results Box */}
          {result && (
            <div
              className={`p-4 rounded-2xl border ${
                result.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
                <span>{result.message}</span>
              </div>

              {result.success && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-700">
                    Foram processados e inseridos <strong>{result.itemsCount} itens</strong> no seu estoque e criada a respectiva conta a pagar com vencimento para 15 dias.
                  </p>

                  {result.costChanges.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-emerald-200/60 space-y-1">
                      <span className="font-bold text-emerald-950 block">
                        Impacto no Custo dos Insumos (Ficha Técnica Viva):
                      </span>
                      {result.costChanges.map((change, idx) => (
                        <div key={idx} className="text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg font-medium">
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
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-medium">
            Formato: NF-e modelo 55 SEFAZ v4.00
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={() => handleProcessXml(xmlText)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
