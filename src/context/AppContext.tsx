import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  FinancialTransaction,
  BankAccount,
  BankStatementItem,
  StockItem,
  StockMovement,
  RecipeCard,
  Invoice,
  TaxConfiguration,
  Customer,
  SaleOrder,
  Supplier,
  PurchaseOrder,
  PriceQuotation,
  Employee,
  TimeClockRecord,
  PayrollRecord,
  IntegrationChannel,
  AuditLog,
  TabType
} from '../types';
import {
  INITIAL_COMPANY,
  INITIAL_USERS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BANK_STATEMENT,
  INITIAL_STOCK,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_RECIPES,
  INITIAL_TAX_CONFIG,
  INITIAL_INVOICES,
  INITIAL_CUSTOMERS,
  INITIAL_SALES_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_QUOTATIONS,
  INITIAL_EMPLOYEES,
  INITIAL_TIME_CLOCK,
  INITIAL_PAYROLL,
  INITIAL_INTEGRATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  company: typeof INITIAL_COMPANY;
  updateCompany: (info: Partial<typeof INITIAL_COMPANY>) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // 1. Financeiro
  transactions: FinancialTransaction[];
  bankAccounts: BankAccount[];
  bankStatements: BankStatementItem[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'conciled'>) => void;
  updateTransactionStatus: (id: string, status: FinancialTransaction['status'], paymentDate?: string) => void;
  reconcileItem: (statementId: string, transactionId: string) => void;

  // 2. Estoque e Fichas
  stock: StockItem[];
  stockMovements: StockMovement[];
  recipes: RecipeCard[];
  addStockItem: (item: Omit<StockItem, 'id'>) => void;
  updateStockQuantity: (itemId: string, diffQty: number, reason: string, type?: 'ENTRADA' | 'SAIDA' | 'AJUSTE_INVENTARIO') => void;
  addRecipe: (recipe: Omit<RecipeCard, 'id' | 'totalCost' | 'cmvPercentage' | 'quadrant'>) => void;
  recalculateRecipeCMV: () => void;

  // 3. Fiscal
  invoices: Invoice[];
  taxConfig: TaxConfiguration;
  updateTaxConfig: (config: Partial<TaxConfiguration>) => void;
  issueInvoice: (data: Omit<Invoice, 'id' | 'protocol' | 'xmlMock' | 'status'>) => void;
  importNFeXml: (xmlString: string) => { success: boolean; message: string; itemsCount: number; costChanges: string[] };

  // 4. Vendas e CRM
  customers: Customer[];
  saleOrders: SaleOrder[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'lastPurchaseDate'>) => void;
  createSaleOrder: (order: Omit<SaleOrder, 'id' | 'orderNumber' | 'date'>) => void;
  updateSaleStage: (id: string, stage: SaleOrder['stage']) => void;

  // 5. Compras
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  quotations: PriceQuotation[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'issueDate'>) => void;
  receivePurchaseOrder: (orderId: string) => void;

  // 6. RH
  employees: Employee[];
  timeClock: TimeClockRecord[];
  payroll: PayrollRecord[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  registerTimeClock: (empId: string, type: 'ENTRY' | 'LUNCH_START' | 'LUNCH_END' | 'EXIT') => void;
  markPayrollPaid: (payrollId: string) => void;

  // 7. Integrações e Segurança
  integrations: IntegrationChannel[];
  toggleIntegration: (id: string) => void;
  auditLogs: AuditLog[];
  exportBackupJson: () => void;
  importBackupJson: (jsonString: string) => boolean;
  resetAllData: () => void;

  // Helper de Permissão RBAC
  canAccess: (requiredRoles: UserRole[]) => boolean;
}

const STORAGE_KEY = 'MISE_ERP_STATE_V1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Admin by default
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Company info
  const [company, setCompany] = useState(INITIAL_COMPANY);

  // States
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [bankStatements, setBankStatements] = useState<BankStatementItem[]>(INITIAL_BANK_STATEMENT);
  
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);
  const [recipes, setRecipes] = useState<RecipeCard[]>(INITIAL_RECIPES);

  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [taxConfig, setTaxConfig] = useState<TaxConfiguration>(INITIAL_TAX_CONFIG);

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [saleOrders, setSaleOrders] = useState<SaleOrder[]>(INITIAL_SALES_ORDERS);

  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [quotations, setQuotations] = useState<PriceQuotation[]>(INITIAL_QUOTATIONS);

  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [timeClock, setTimeClock] = useState<TimeClockRecord[]>(INITIAL_TIME_CLOCK);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(INITIAL_PAYROLL);

  const [integrations, setIntegrations] = useState<IntegrationChannel[]>(INITIAL_INTEGRATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.bankAccounts) setBankAccounts(parsed.bankAccounts);
        if (parsed.stock) setStock(parsed.stock);
        if (parsed.stockMovements) setStockMovements(parsed.stockMovements);
        if (parsed.recipes) setRecipes(parsed.recipes);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.saleOrders) setSaleOrders(parsed.saleOrders);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.purchaseOrders) setPurchaseOrders(parsed.purchaseOrders);
        if (parsed.employees) setEmployees(parsed.employees);
        if (parsed.payroll) setPayroll(parsed.payroll);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch (e) {
      console.warn('Erro ao carregar estado local do Mise:', e);
    }
  }, []);

  // Save to localStorage automatically on state change
  useEffect(() => {
    try {
      const stateToSave = {
        transactions,
        bankAccounts,
        stock,
        stockMovements,
        recipes,
        invoices,
        customers,
        saleOrders,
        suppliers,
        purchaseOrders,
        employees,
        payroll,
        auditLogs
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Falha ao persistir dados localmente:', e);
    }
  }, [
    transactions,
    bankAccounts,
    stock,
    stockMovements,
    recipes,
    invoices,
    customers,
    saleOrders,
    suppliers,
    purchaseOrders,
    employees,
    payroll,
    auditLogs
  ]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, details: string, module: string) => {
    const now = new Date();
    const formatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: formatted,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      module
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const canAccess = (requiredRoles: UserRole[]) => {
    if (currentUser.role === 'ADMIN') return true;
    return requiredRoles.includes(currentUser.role);
  };

  const updateCompany = (info: Partial<typeof INITIAL_COMPANY>) => {
    setCompany((prev) => ({ ...prev, ...info }));
    showToast('Dados da empresa atualizados com sucesso!', 'success');
  };

  // 1. Financeiro Actions
  const addTransaction = (tx: Omit<FinancialTransaction, 'id' | 'conciled'>) => {
    const newTx: FinancialTransaction = {
      ...tx,
      id: `ft-${Date.now()}`,
      conciled: false
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update bank balance if already paid
    if (newTx.status === 'PAGO' && newTx.bankAccountId) {
      setBankAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === newTx.bankAccountId) {
            const delta = newTx.type === 'RECEITA' ? newTx.amount : -newTx.amount;
            return { ...acc, balance: acc.balance + delta };
          }
          return acc;
        })
      );
    }

    addAuditLog(
      `Novo Lançamento Financeiro: ${newTx.type}`,
      `R$ ${newTx.amount.toFixed(2)} - ${newTx.description}`,
      'FINANCEIRO'
    );
    showToast(`Transação "${newTx.description}" adicionada!`, 'success');
  };

  const updateTransactionStatus = (id: string, status: FinancialTransaction['status'], paymentDate?: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          const oldStatus = tx.status;
          const updated = { ...tx, status, paymentDate: paymentDate || tx.paymentDate || new Date().toISOString().slice(0, 10) };
          
          // Se mudou de Pendente para Pago e tem conta bancária
          if (oldStatus !== 'PAGO' && status === 'PAGO' && tx.bankAccountId) {
            setBankAccounts((accs) =>
              accs.map((acc) => {
                if (acc.id === tx.bankAccountId) {
                  const delta = tx.type === 'RECEITA' ? tx.amount : -tx.amount;
                  return { ...acc, balance: acc.balance + delta };
                }
                return acc;
              })
            );
          }
          return updated;
        }
        return tx;
      })
    );
    addAuditLog('Alteração de Status de Pagamento', `Transação ID ${id} alterada para ${status}`, 'FINANCEIRO');
    showToast(`Status atualizado para ${status}`, 'info');
  };

  const reconcileItem = (statementId: string, transactionId: string) => {
    setBankStatements((prev) =>
      prev.map((item) => (item.id === statementId ? { ...item, status: 'CONCILIADO', matchedTransactionId: transactionId } : item))
    );
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === transactionId ? { ...tx, conciled: true } : tx))
    );
    addAuditLog('Conciliação Bancária', `Item ${statementId} conciliado com transação ${transactionId}`, 'FINANCEIRO');
    showToast('Lançamento conciliado com sucesso!', 'success');
  };

  // 2. Estoque e Fichas
  const addStockItem = (item: Omit<StockItem, 'id'>) => {
    const newItem: StockItem = {
      ...item,
      id: `stk-${Date.now()}`
    };
    setStock((prev) => [newItem, ...prev]);
    addAuditLog('Novo Item de Estoque', `${newItem.name} (${newItem.code})`, 'ESTOQUE');
    showToast(`Insumo "${newItem.name}" cadastrado!`, 'success');
  };

  const updateStockQuantity = (
    itemId: string,
    diffQty: number,
    reason: string,
    type: 'ENTRADA' | 'SAIDA' | 'AJUSTE_INVENTARIO' = diffQty >= 0 ? 'ENTRADA' : 'SAIDA'
  ) => {
    let affectedItem: StockItem | undefined;
    setStock((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(0, Number((item.currentStock + diffQty).toFixed(3)));
          affectedItem = { ...item, currentStock: newQty };
          return affectedItem;
        }
        return item;
      })
    );

    if (affectedItem) {
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const movement: StockMovement = {
        id: `sm-${Date.now()}`,
        itemId,
        itemName: affectedItem.name,
        type,
        quantity: Math.abs(diffQty),
        unitCost: affectedItem.costPrice,
        date: nowStr,
        reason,
        responsible: currentUser.name
      };
      setStockMovements((prev) => [movement, ...prev]);

      if (affectedItem.currentStock <= affectedItem.minStock) {
        showToast(`ALERTA DE RUPTURA: ${affectedItem.name} atingiu nível crítico (${affectedItem.currentStock} ${affectedItem.unit})!`, 'warning');
      } else {
        showToast(`Estoque de "${affectedItem.name}" atualizado.`, 'info');
      }
    }
  };

  // Recalcular CMV de todos os pratos baseado no preço de custo atual do estoque
  const recalculateRecipeCMV = () => {
    setRecipes((prev) =>
      prev.map((recipe) => {
        let newTotalCost = 0;
        const updatedIngredients = recipe.ingredients.map((ing) => {
          const stockMatch = stock.find((s) => s.id === ing.stockItemId);
          const currentUnitCost = stockMatch ? stockMatch.costPrice : ing.unitCost;
          const totalCost = ing.grossQty * currentUnitCost;
          newTotalCost += totalCost;
          return {
            ...ing,
            unitCost: currentUnitCost,
            totalCost: Number(totalCost.toFixed(2))
          };
        });

        const cmvPct = recipe.salePrice > 0 ? (newTotalCost / recipe.salePrice) * 100 : 0;
        
        // Reclassificar quadrante Kasavana & Smith
        // Média de volume ~100 pratos, média de CMV ~33%
        const isHighMargin = cmvPct <= 35;
        const isHighVolume = recipe.monthlySalesQty >= 100;

        let quadrant: RecipeCard['quadrant'] = 'ESTRELA';
        if (isHighMargin && isHighVolume) quadrant = 'ESTRELA';
        else if (!isHighMargin && isHighVolume) quadrant = 'CAVALO_BATALHA';
        else if (isHighMargin && !isHighVolume) quadrant = 'QUEBRA_CABECAS';
        else quadrant = 'CAO';

        return {
          ...recipe,
          ingredients: updatedIngredients,
          totalCost: Number(newTotalCost.toFixed(2)),
          cmvPercentage: Number(cmvPct.toFixed(1)),
          quadrant
        };
      })
    );
  };

  const addRecipe = (recipe: Omit<RecipeCard, 'id' | 'totalCost' | 'cmvPercentage' | 'quadrant'>) => {
    let totalCost = 0;
    recipe.ingredients.forEach((ing) => {
      totalCost += ing.totalCost;
    });
    const cmvPct = recipe.salePrice > 0 ? (totalCost / recipe.salePrice) * 100 : 0;
    const isHighMargin = cmvPct <= 35;
    const isHighVolume = recipe.monthlySalesQty >= 100;
    let quadrant: RecipeCard['quadrant'] = 'ESTRELA';
    if (isHighMargin && isHighVolume) quadrant = 'ESTRELA';
    else if (!isHighMargin && isHighVolume) quadrant = 'CAVALO_BATALHA';
    else if (isHighMargin && !isHighVolume) quadrant = 'QUEBRA_CABECAS';
    else quadrant = 'CAO';

    const newRecipe: RecipeCard = {
      ...recipe,
      id: `rc-${Date.now()}`,
      totalCost: Number(totalCost.toFixed(2)),
      cmvPercentage: Number(cmvPct.toFixed(1)),
      quadrant
    };

    setRecipes((prev) => [newRecipe, ...prev]);
    addAuditLog('Nova Ficha Técnica', `Prato: ${newRecipe.dishName} - CMV: ${newRecipe.cmvPercentage}%`, 'ESTOQUE');
    showToast(`Ficha técnica "${newRecipe.dishName}" criada com sucesso!`, 'success');
  };

  // 3. Fiscal Actions
  const updateTaxConfig = (config: Partial<TaxConfiguration>) => {
    setTaxConfig((prev) => ({ ...prev, ...config }));
    showToast('Configuração tributária atualizada!', 'success');
  };

  const issueInvoice = (data: Omit<Invoice, 'id' | 'protocol' | 'xmlMock' | 'status'>) => {
    const proto = `1352600${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      status: 'AUTORIZADA',
      protocol: proto,
      xmlMock: `<?xml version="1.0"?><nfeProc><NFe><infNFe><ide><nNF>${data.number}</nNF><vNF>${data.totalValue}</vNF></ide></infNFe></nfeProc>`
    };
    setInvoices((prev) => [newInv, ...prev]);
    addAuditLog(`Emissão de ${newInv.type}`, `NF Nº ${newInv.number} para ${newInv.recipientName} - R$ ${newInv.totalValue.toFixed(2)}`, 'FISCAL');
    showToast(`Nota Fiscal ${newInv.type} Nº ${newInv.number} autorizada pela SEFAZ!`, 'success');
  };

  // Leitor e Parser Inteligente de XML de NF-e
  const importNFeXml = (xmlString: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // Check parse error
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        return { success: false, message: 'Arquivo XML inválido ou corrompido.', itemsCount: 0, costChanges: [] };
      }

      // Read emitente
      const emitenteNome = xmlDoc.getElementsByTagName('xNome')[0]?.textContent || 'Fornecedor Identificado via NF-e';
      const nNF = xmlDoc.getElementsByTagName('nNF')[0]?.textContent || `NF-${Math.floor(1000 + Math.random() * 9000)}`;
      const vNF = parseFloat(xmlDoc.getElementsByTagName('vNF')[0]?.textContent || '0');

      // Read items
      const detElements = xmlDoc.getElementsByTagName('det');
      if (detElements.length === 0) {
        return { success: false, message: 'Nenhum item <det> encontrado na NF-e.', itemsCount: 0, costChanges: [] };
      }

      const costAlerts: string[] = [];
      let totalAmountImported = 0;

      for (let i = 0; i < detElements.length; i++) {
        const det = detElements[i];
        const xProd = det.getElementsByTagName('xProd')[0]?.textContent || '';
        const qCom = parseFloat(det.getElementsByTagName('qCom')[0]?.textContent || '1');
        const vUnCom = parseFloat(det.getElementsByTagName('vUnCom')[0]?.textContent || '0');
        const vProd = parseFloat(det.getElementsByTagName('vProd')[0]?.textContent || '0');
        const uCom = (det.getElementsByTagName('uCom')[0]?.textContent || 'UN').toUpperCase();

        totalAmountImported += vProd;

        // Tentar mapear para insumo existente no estoque
        const normalizedXProd = xProd.toLowerCase();
        let matchedStockItem = stock.find((stk) =>
          normalizedXProd.includes(stk.name.toLowerCase()) || stk.name.toLowerCase().includes(normalizedXProd)
        );

        if (!matchedStockItem) {
          // Busca por palavras-chave
          if (normalizedXProd.includes('mignon') || normalizedXProd.includes('file')) {
            matchedStockItem = stock.find((s) => s.id === 'stk-1');
          } else if (normalizedXProd.includes('salmao') || normalizedXProd.includes('salmão')) {
            matchedStockItem = stock.find((s) => s.id === 'stk-2');
          } else if (normalizedXProd.includes('parmesao') || normalizedXProd.includes('queijo')) {
            matchedStockItem = stock.find((s) => s.id === 'stk-3');
          } else if (normalizedXProd.includes('cogumelo') || normalizedXProd.includes('shimeji')) {
            matchedStockItem = stock.find((s) => s.id === 'stk-5');
          }
        }

        if (matchedStockItem) {
          const oldPrice = matchedStockItem.costPrice;
          const newPrice = vUnCom;
          const priceDiffPct = ((newPrice - oldPrice) / oldPrice) * 100;

          // Atualiza quantidade e novo custo no estoque
          updateStockQuantity(matchedStockItem.id, qCom, `Entrada via XML NF-e ${nNF} (${emitenteNome})`, 'ENTRADA');

          setStock((prev) =>
            prev.map((s) => (s.id === matchedStockItem!.id ? { ...s, costPrice: newPrice, lastSupplierName: emitenteNome, lastPurchaseDate: new Date().toISOString().slice(0, 10) } : s))
          );

          if (priceDiffPct > 5) {
            costAlerts.push(`⚠️ ${matchedStockItem.name}: Custo subiu ${priceDiffPct.toFixed(1)}% (De R$ ${oldPrice.toFixed(2)} para R$ ${newPrice.toFixed(2)}/${matchedStockItem.unit})!`);
          } else if (priceDiffPct < -5) {
            costAlerts.push(`📉 ${matchedStockItem.name}: Custo caiu ${Math.abs(priceDiffPct).toFixed(1)}% (Ótima negociação!)`);
          }
        } else {
          // Se não encontrou, cadastra automaticamente novo item no estoque!
          const newItemId = `stk-${Date.now()}-${i}`;
          const newStockItem: StockItem = {
            id: newItemId,
            code: `XML-${Math.floor(100 + Math.random() * 900)}`,
            name: xProd,
            category: 'Insumos Importados NF-e',
            unit: (['KG', 'UN', 'L', 'G', 'ML', 'PCT', 'CX'].includes(uCom) ? uCom : 'UN') as any,
            currentStock: qCom,
            minStock: Math.max(5, qCom * 0.3),
            maxStock: qCom * 3,
            costPrice: vUnCom,
            location: 'Recebimento Geral',
            lastSupplierName: emitenteNome,
            lastPurchaseDate: new Date().toISOString().slice(0, 10)
          };
          setStock((prev) => [newStockItem, ...prev]);
        }
      }

      // Cria automaticamente a Conta a Pagar correspondente no Financeiro (Cross-Module Sync)
      const newTransaction: FinancialTransaction = {
        id: `ft-${Date.now()}`,
        description: `NF-e ${nNF} - ${emitenteNome}`,
        amount: vNF > 0 ? vNF : totalAmountImported,
        type: 'DESPESA',
        category: 'CMV - Insumos',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 15 dias de prazo
        status: 'PENDENTE',
        paymentMethod: 'BOLETO',
        entityName: emitenteNome,
        documentNumber: `NFE-${nNF}`,
        conciled: false,
        originModule: 'COMPRAS'
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      // Recalcular CMVs dos pratos com os novos preços de custo!
      setTimeout(() => {
        recalculateRecipeCMV();
      }, 200);

      addAuditLog('Importação de XML de NF-e', `NF-e ${nNF} de ${emitenteNome} - ${detElements.length} itens importados.`, 'FISCAL');
      showToast(`NF-e ${nNF} importada com sucesso! Estoque e contas a pagar atualizados.`, 'success');

      return {
        success: true,
        message: `NF-e Nº ${nNF} importada com sucesso!`,
        itemsCount: detElements.length,
        costChanges: costAlerts
      };
    } catch (err: any) {
      return { success: false, message: `Erro ao processar XML: ${err.message}`, itemsCount: 0, costChanges: [] };
    }
  };

  // 4. Vendas e CRM
  const addCustomer = (customer: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'lastPurchaseDate'>) => {
    const newCust: Customer = {
      ...customer,
      id: `c-${Date.now()}`,
      totalSpent: 0,
      ordersCount: 0,
      lastPurchaseDate: '-'
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAuditLog('Novo Cliente Cadastrado', newCust.name, 'VENDAS');
    showToast(`Cliente "${newCust.name}" cadastrado no CRM!`, 'success');
  };

  const createSaleOrder = (orderData: Omit<SaleOrder, 'id' | 'orderNumber' | 'date'>) => {
    const orderNum = `PED-${Math.floor(2000 + Math.random() * 8000)}`;
    const today = new Date().toISOString().slice(0, 10);
    const newOrder: SaleOrder = {
      ...orderData,
      id: `so-${Date.now()}`,
      orderNumber: orderNum,
      date: today
    };

    setSaleOrders((prev) => [newOrder, ...prev]);

    // Cross-Module 1: Atualizar LTV e pedidos do Cliente no CRM
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === newOrder.customerId) {
          return {
            ...c,
            totalSpent: c.totalSpent + newOrder.totalAmount,
            ordersCount: c.ordersCount + 1,
            lastPurchaseDate: today
          };
        }
        return c;
      })
    );

    // Cross-Module 2: Criar Lançamento Financeiro (Contas a Receber / Receita)
    const isPaidInstantly = ['PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'DINHEIRO'].includes(newOrder.paymentMethod);
    const primaryAccount = bankAccounts[0]?.id || 'ba-1';

    const tx: FinancialTransaction = {
      id: `ft-${Date.now()}`,
      description: `Venda ${newOrder.orderNumber} (${newOrder.channel}) - ${newOrder.customerName}`,
      amount: newOrder.totalAmount,
      type: 'RECEITA',
      category: newOrder.channel === 'DELIVERY' ? 'Delivery Online' : 'Vendas Restaurante',
      dueDate: today,
      paymentDate: isPaidInstantly ? today : undefined,
      status: isPaidInstantly ? 'PAGO' : 'PENDENTE',
      paymentMethod: newOrder.paymentMethod,
      entityName: newOrder.customerName,
      documentNumber: newOrder.orderNumber,
      conciled: false,
      bankAccountId: isPaidInstantly ? primaryAccount : undefined,
      originModule: 'VENDAS'
    };
    setTransactions((prev) => [tx, ...prev]);

    // Cross-Module 3: Baixar Insumos no Estoque a partir da Ficha Técnica dos pratos vendidos!
    newOrder.items.forEach((item) => {
      if (item.recipeCardId) {
        const recipe = recipes.find((r) => r.id === item.recipeCardId);
        if (recipe) {
          recipe.ingredients.forEach((ing) => {
            const consumedQty = ing.grossQty * item.quantity;
            updateStockQuantity(
              ing.stockItemId,
              -consumedQty,
              `Baixa automática venda ${newOrder.orderNumber} (${item.quantity}x ${item.name})`,
              'SAIDA'
            );
          });
        }
      } else if (item.stockItemId) {
        updateStockQuantity(
          item.stockItemId,
          -item.quantity,
          `Baixa automática venda ${newOrder.orderNumber} (${item.name})`,
          'SAIDA'
        );
      }
    });

    addAuditLog('Novo Pedido de Venda', `${newOrder.orderNumber} - R$ ${newOrder.totalAmount.toFixed(2)} (${newOrder.customerName})`, 'VENDAS');
    showToast(`Pedido ${newOrder.orderNumber} registrado! Estoque abatido e receita lançada.`, 'success');
  };

  const updateSaleStage = (id: string, stage: SaleOrder['stage']) => {
    setSaleOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, stage } : order))
    );
    addAuditLog('Atualização de Funil de Vendas', `Pedido ${id} mudou para ${stage}`, 'VENDAS');
    showToast(`Etapa do pedido alterada para ${stage}`, 'info');
  };

  // 5. Compras
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...supplier,
      id: `sup-${Date.now()}`
    };
    setSuppliers((prev) => [newSup, ...prev]);
    addAuditLog('Novo Fornecedor Cadastrado', newSup.name, 'COMPRAS');
    showToast(`Fornecedor "${newSup.name}" cadastrado!`, 'success');
  };

  const createPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'issueDate'>) => {
    const orderNum = `OC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      orderNumber: orderNum,
      issueDate: new Date().toISOString().slice(0, 10)
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    addAuditLog('Nova Ordem de Compra', `${newPO.orderNumber} para ${newPO.supplierName}`, 'COMPRAS');
    showToast(`Ordem de Compra ${newPO.orderNumber} gerada!`, 'success');
  };

  const receivePurchaseOrder = (orderId: string) => {
    const po = purchaseOrders.find((p) => p.id === orderId);
    if (!po) return;

    // Atualiza status da OC
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === orderId ? { ...p, status: 'RECEBIDA' } : p))
    );

    // Cross-Module 1: Dar entrada nos itens no estoque
    po.items.forEach((item) => {
      updateStockQuantity(
        item.stockItemId,
        item.quantity,
        `Entrada mercadoria OC ${po.orderNumber} (${po.supplierName})`,
        'ENTRADA'
      );
    });

    // Cross-Module 2: Lançar Conta a Pagar no Financeiro
    const newTx: FinancialTransaction = {
      id: `ft-${Date.now()}`,
      description: `Compra Mercadorias ${po.orderNumber} - ${po.supplierName}`,
      amount: po.totalAmount,
      type: 'DESPESA',
      category: 'CMV - Insumos',
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'PENDENTE',
      paymentMethod: po.paymentMethod,
      entityName: po.supplierName,
      documentNumber: po.orderNumber,
      conciled: false,
      originModule: 'COMPRAS'
    };
    setTransactions((prev) => [newTx, ...prev]);

    addAuditLog('Recebimento de Mercadorias', `OC ${po.orderNumber} recebida. Estoque abastecido e conta a pagar lançada.`, 'COMPRAS');
    showToast(`Mercadorias da ${po.orderNumber} recebidas! Estoque e financeiro atualizados.`, 'success');
  };

  // 6. RH
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [newEmp, ...prev]);

    // Cria prévia da folha
    const inss = Number((newEmp.baseSalary * 0.11).toFixed(2));
    const irrf = Number((newEmp.baseSalary * 0.075).toFixed(2));
    const newPayroll: PayrollRecord = {
      id: `pr-${Date.now()}`,
      employeeId: newEmp.id,
      employeeName: newEmp.name,
      periodMonthYear: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      baseSalary: newEmp.baseSalary,
      inssDeduction: inss,
      irrfDeduction: irrf,
      benefitsDeduction: 150.00,
      netSalary: Number((newEmp.baseSalary - inss - irrf - 150).toFixed(2)),
      totalCostCompany: Number((newEmp.baseSalary * 1.4).toFixed(2)),
      status: 'PREVIA'
    };
    setPayroll((prev) => [newPayroll, ...prev]);

    addAuditLog('Admissão de Colaborador', `${newEmp.name} - ${newEmp.role}`, 'RH');
    showToast(`Colaborador "${newEmp.name}" cadastrado no DP/RH!`, 'success');
  };

  const registerTimeClock = (empId: string, type: 'ENTRY' | 'LUNCH_START' | 'LUNCH_END' | 'EXIT') => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().slice(0, 10);

    setTimeClock((prev) => {
      const existing = prev.find((t) => t.employeeId === empId && t.date === today);
      if (existing) {
        return prev.map((t) => {
          if (t.id === existing.id) {
            if (type === 'LUNCH_START') return { ...t, lunchStart: nowTime };
            if (type === 'LUNCH_END') return { ...t, lunchEnd: nowTime };
            if (type === 'EXIT') return { ...t, exitTime: nowTime };
          }
          return t;
        });
      } else {
        const newRecord: TimeClockRecord = {
          id: `tc-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.name,
          date: today,
          entryTime: nowTime,
          lunchStart: '--:--',
          lunchEnd: '--:--',
          exitTime: '--:--',
          overtimeMinutes: 0,
          status: 'REGULAR'
        };
        return [newRecord, ...prev];
      }
    });

    addAuditLog('Ponto Digital Registrado', `${emp.name} registrou ${type} às ${nowTime}`, 'RH');
    showToast(`Ponto registrado para ${emp.name} às ${nowTime}!`, 'success');
  };

  const markPayrollPaid = (payrollId: string) => {
    const record = payroll.find((p) => p.id === payrollId);
    if (!record) return;

    setPayroll((prev) =>
      prev.map((p) => (p.id === payrollId ? { ...p, status: 'PAGO' } : p))
    );

    // Cross-Module: Gerar lançamento no Financeiro
    const newTx: FinancialTransaction = {
      id: `ft-${Date.now()}`,
      description: `Folha de Pagamento - ${record.employeeName} (${record.periodMonthYear})`,
      amount: record.netSalary,
      type: 'DESPESA',
      category: 'Pessoal & Salários',
      dueDate: new Date().toISOString().slice(0, 10),
      paymentDate: new Date().toISOString().slice(0, 10),
      status: 'PAGO',
      paymentMethod: 'PIX',
      entityName: record.employeeName,
      documentNumber: `HOL-${record.periodMonthYear.replace('/', '')}`,
      conciled: false,
      bankAccountId: bankAccounts[0]?.id,
      originModule: 'RH'
    };
    setTransactions((prev) => [newTx, ...prev]);

    addAuditLog('Pagamento de Salário', `${record.employeeName} - Líquido R$ ${record.netSalary.toFixed(2)}`, 'RH');
    showToast(`Salário de ${record.employeeName} marcado como pago e lançado no financeiro!`, 'success');
  };

  // 7. Integrações e Segurança
  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === 'CONECTADO' ? 'DESCONECTADO' : 'CONECTADO';
          return { ...item, status: newStatus, lastSync: newStatus === 'CONECTADO' ? 'Agora mesmo' : item.lastSync };
        }
        return item;
      })
    );
    showToast('Status da integração alterado com sucesso!', 'info');
  };

  const exportBackupJson = () => {
    const fullState = {
      timestamp: new Date().toISOString(),
      company,
      transactions,
      bankAccounts,
      stock,
      stockMovements,
      recipes,
      invoices,
      customers,
      saleOrders,
      suppliers,
      purchaseOrders,
      employees,
      payroll,
      integrations,
      auditLogs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_mise_erp_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('Backup Exportado', 'Arquivo JSON de snapshot do ERP gerado pelo usuário.', 'SISTEMA');
    showToast('Backup completo exportado com sucesso!', 'success');
  };

  const importBackupJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions && data.stock && data.recipes) {
        if (data.company) setCompany(data.company);
        setTransactions(data.transactions);
        if (data.bankAccounts) setBankAccounts(data.bankAccounts);
        setStock(data.stock);
        if (data.stockMovements) setStockMovements(data.stockMovements);
        setRecipes(data.recipes);
        if (data.invoices) setInvoices(data.invoices);
        if (data.customers) setCustomers(data.customers);
        if (data.saleOrders) setSaleOrders(data.saleOrders);
        if (data.suppliers) setSuppliers(data.suppliers);
        if (data.purchaseOrders) setPurchaseOrders(data.purchaseOrders);
        if (data.employees) setEmployees(data.employees);
        if (data.payroll) setPayroll(data.payroll);
        if (data.integrations) setIntegrations(data.integrations);
        if (data.auditLogs) setAuditLogs(data.auditLogs);

        addAuditLog('Restauração de Backup', 'Dados restaurados com sucesso a partir de arquivo JSON.', 'SISTEMA');
        showToast('Backup restaurado com sucesso! Todos os módulos foram atualizados.', 'success');
        return true;
      }
      return false;
    } catch (e) {
      showToast('Falha ao processar arquivo de backup JSON.', 'error');
      return false;
    }
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCompany(INITIAL_COMPANY);
    setTransactions(INITIAL_TRANSACTIONS);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
    setBankStatements(INITIAL_BANK_STATEMENT);
    setStock(INITIAL_STOCK);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setRecipes(INITIAL_RECIPES);
    setInvoices(INITIAL_INVOICES);
    setCustomers(INITIAL_CUSTOMERS);
    setSaleOrders(INITIAL_SALES_ORDERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setQuotations(INITIAL_QUOTATIONS);
    setEmployees(INITIAL_EMPLOYEES);
    setTimeClock(INITIAL_TIME_CLOCK);
    setPayroll(INITIAL_PAYROLL);
    setIntegrations(INITIAL_INTEGRATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showToast('Dados restaurados para o padrão de demonstração!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        users: INITIAL_USERS,
        company,
        updateCompany,
        toasts,
        showToast,
        removeToast,
        transactions,
        bankAccounts,
        bankStatements,
        addTransaction,
        updateTransactionStatus,
        reconcileItem,
        stock,
        stockMovements,
        recipes,
        addStockItem,
        updateStockQuantity,
        addRecipe,
        recalculateRecipeCMV,
        invoices,
        taxConfig,
        updateTaxConfig,
        issueInvoice,
        importNFeXml,
        customers,
        saleOrders,
        addCustomer,
        createSaleOrder,
        updateSaleStage,
        suppliers,
        purchaseOrders,
        quotations,
        addSupplier,
        createPurchaseOrder,
        receivePurchaseOrder,
        employees,
        timeClock,
        payroll,
        addEmployee,
        registerTimeClock,
        markPayrollPaid,
        integrations,
        toggleIntegration,
        auditLogs,
        exportBackupJson,
        importBackupJson,
        resetAllData,
        canAccess
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
