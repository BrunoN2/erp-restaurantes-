// Tipos completos para todos os módulos do ERP Mise

export type UserRole = 'ADMIN' | 'FINANCEIRO' | 'ESTOQUE' | 'VENDAS' | 'RH';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

// 1. Financeiro
export type TransactionType = 'RECEITA' | 'DESPESA';
export type PaymentStatus = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
export type PaymentMethod = 'PIX' | 'BOLETO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'TRANSFERENCIA' | 'DINHEIRO';

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  dueDate: string;
  paymentDate?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  entityName: string; // Cliente ou Fornecedor
  documentNumber?: string;
  conciled: boolean;
  bankAccountId?: string;
  originModule?: 'VENDAS' | 'COMPRAS' | 'MANUAL' | 'RH';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  agency: string;
  balance: number;
  type: 'CORRENTE' | 'APLICACAO' | 'CAIXA_INTERNO';
}

export interface BankStatementItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'CREDITO' | 'DEBITO';
  matchedTransactionId?: string;
  status: 'CONCILIADO' | 'PENDENTE';
}

// 2. Estoque e Ficha Técnica
export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: 'KG' | 'UN' | 'L' | 'G' | 'ML' | 'PCT' | 'CX';
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number; // Preço de custo unitário
  location: string; // Ex: Prateleira A1, Câmara Fria 2
  lastSupplierName?: string;
  lastPurchaseDate?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'ENTRADA' | 'SAIDA' | 'AJUSTE_INVENTARIO';
  quantity: number;
  unitCost: number;
  date: string;
  reason: string;
  responsible: string;
}

export interface RecipeIngredient {
  stockItemId: string;
  name: string;
  grossQty: number; // Quantidade bruta
  netQty: number; // Quantidade líquida
  unit: string;
  correctionFactor: number; // Fator de correção (FC = Bruto / Líquido)
  unitCost: number;
  totalCost: number;
}

export interface RecipeCard {
  id: string;
  dishName: string;
  category: 'PRATO_PRINCIPAL' | 'ENTRADA' | 'SOBREMESA' | 'BEBIDA';
  portions: number;
  ingredients: RecipeIngredient[];
  preparationTimeMinutes: number;
  salePrice: number;
  totalCost: number; // CMV em R$
  cmvPercentage: number; // CMV em %
  monthlySalesQty: number; // Volume mensal para engenharia de cardápio
  quadrant: 'ESTRELA' | 'CAVALO_BATALHA' | 'QUEBRA_CABECAS' | 'CAO';
}

// 3. Faturamento e Fiscal
export type InvoiceType = 'NFE' | 'NFSE';
export type InvoiceStatus = 'AUTORIZADA' | 'EM_PROCESSAMENTO' | 'CANCELADA' | 'REJEITADA';

export interface TaxConfiguration {
  regime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  aliquotaSimples: number; // ex: 6%
  icmsAliquota: number;
  issAliquota: number;
  pisAliquota: number;
  cofinsAliquota: number;
}

export interface Invoice {
  id: string;
  number: string;
  series: string;
  type: InvoiceType;
  recipientName: string;
  recipientCpfCnpj: string;
  issueDate: string;
  totalValue: number;
  taxValue: number;
  status: InvoiceStatus;
  xmlMock: string;
  protocol?: string;
  itemsSummary: string;
}

// 4. Vendas e CRM
export type DealStage = 'ORCAMENTO' | 'NEGOCIACAO' | 'APROVADO' | 'CONCLUIDO' | 'PERDIDO';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  totalSpent: number;
  ordersCount: number;
  lastPurchaseDate: string;
  status: 'ATIVO' | 'INATIVO' | 'VIP';
  notes?: string;
}

export interface SaleItem {
  recipeCardId?: string;
  stockItemId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  channel: 'SALAO' | 'DELIVERY' | 'BALCAO' | 'CORPORATIVO';
  paymentMethod: PaymentMethod;
  stage: DealStage;
  notes?: string;
}

// 5. Compras
export type PurchaseStatus = 'COTACAO' | 'APROVADA' | 'ENVIADA_FORNECEDOR' | 'RECEBIDA' | 'CANCELADA';

export interface Supplier {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  contactName: string;
  phone: string;
  email: string;
  category: 'CARNES' | 'HORTIFRUTI' | 'LATICINIOS' | 'BEBIDAS' | 'EMBALAGENS' | 'OUTROS';
  paymentTerms: string;
  rating: number; // 1 to 5
}

export interface PurchaseOrderItem {
  stockItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  issueDate: string;
  deliveryDateExpected: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface PriceQuotation {
  id: string;
  title: string;
  date: string;
  items: { itemName: string; requiredQty: number; unit: string }[];
  supplierOffers: {
    supplierName: string;
    totalOffered: number;
    deliveryTimeDays: number;
    isWinner?: boolean;
  }[];
  status: 'ABERTA' | 'FINALIZADA';
}

// 6. Recursos Humanos (RH / DP)
export interface Employee {
  id: string;
  name: string;
  cpf: string;
  role: string;
  department: 'COZINHA' | 'ATENDIMENTO' | 'ADMINISTRATIVO' | 'FINANCEIRO' | 'LOGISTICA';
  admissionDate: string;
  baseSalary: number;
  benefits: {
    mealVoucher: number; // VR
    transportVoucher: number; // VT
    healthInsurance: number;
  };
  status: 'ATIVO' | 'FERIAS' | 'AFASTADO' | 'DESLIGADO';
  contact: {
    email: string;
    phone: string;
  };
}

export interface TimeClockRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  entryTime: string;
  lunchStart: string;
  lunchEnd: string;
  exitTime: string;
  overtimeMinutes: number;
  status: 'REGULAR' | 'HORA_EXTRA' | 'ATRASO';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  periodMonthYear: string;
  baseSalary: number;
  inssDeduction: number;
  irrfDeduction: number;
  benefitsDeduction: number;
  netSalary: number;
  totalCostCompany: number; // Salário + FGTS + encargos
  status: 'PREVIA' | 'PAGO';
}

// 7. Integrações e Segurança
export interface IntegrationChannel {
  id: string;
  name: string;
  category: 'ECOMMERCE' | 'MAQUININHA' | 'BANCO' | 'CONTABILIDADE';
  status: 'CONECTADO' | 'DESCONECTADO' | 'SINCRONIZANDO';
  lastSync: string;
  description: string;
  apiEndpoint: string;
  credentialsSet: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  module: string;
}

export type TabType = 
  | 'DASHBOARD'
  | 'FINANCEIRO'
  | 'ESTOQUE'
  | 'FISCAL'
  | 'VENDAS'
  | 'COMPRAS'
  | 'RH'
  | 'INTEGRACOES';
