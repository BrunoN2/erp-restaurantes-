import {
  UserProfile,
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
  AuditLog
} from '../types';

export const INITIAL_COMPANY = {
  name: 'Mise Gastronomia & Gestão',
  legalName: 'Mise Alimentos e Bebidas Ltda',
  cnpj: '34.891.203/0001-44',
  phone: '(11) 3456-7890',
  city: 'São Paulo - SP',
  regime: 'Simples Nacional (Anexo I)',
  currency: 'BRL'
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Carlos Oliveira',
    email: 'carlos@misebistro.com.br',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'u-2',
    name: 'Mariana Santos',
    email: 'mariana.financas@misebistro.com.br',
    role: 'FINANCEIRO',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'u-3',
    name: 'Chef Rodrigo Moura',
    email: 'chef.rodrigo@misebistro.com.br',
    role: 'ESTOQUE',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'u-4',
    name: 'Juliana Costa',
    email: 'juliana.vendas@misebistro.com.br',
    role: 'VENDAS',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'u-5',
    name: 'Felipe Alencar',
    email: 'felipe.rh@misebistro.com.br',
    role: 'RH',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
  }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'ba-1',
    bankName: 'Banco Itaú Empresas',
    accountNumber: '48291-5',
    agency: '0340',
    balance: 42850.70,
    type: 'CORRENTE'
  },
  {
    id: 'ba-2',
    bankName: 'Banco Inter PJ',
    accountNumber: '10924-8',
    agency: '0001',
    balance: 18420.30,
    type: 'CORRENTE'
  },
  {
    id: 'ba-3',
    bankName: 'Cofre Caixa Operacional (Salão)',
    accountNumber: 'CAIXA-01',
    agency: 'FÍSICO',
    balance: 3450.00,
    type: 'CAIXA_INTERNO'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'ft-1',
    description: 'Vendas Salão e Balcão (Sábado à Noite)',
    amount: 14820.00,
    type: 'RECEITA',
    category: 'Vendas Restaurante',
    dueDate: '2026-10-25',
    paymentDate: '2026-10-25',
    status: 'PAGO',
    paymentMethod: 'CARTAO_CREDITO',
    entityName: 'Clientes Diversos - Salão',
    documentNumber: 'NSU-892102',
    conciled: true,
    bankAccountId: 'ba-1',
    originModule: 'VENDAS'
  },
  {
    id: 'ft-2',
    description: 'Repasse Semanal iFood Delivery',
    amount: 8350.40,
    type: 'RECEITA',
    category: 'Delivery Online',
    dueDate: '2026-10-26',
    paymentDate: '2026-10-26',
    status: 'PAGO',
    paymentMethod: 'TRANSFERENCIA',
    entityName: 'iFood Brasil Agência',
    documentNumber: 'REC-77123',
    conciled: true,
    bankAccountId: 'ba-1',
    originModule: 'VENDAS'
  },
  {
    id: 'ft-3',
    description: 'Aluguel do Ponto Comercial + Condomínio',
    amount: 8200.00,
    type: 'DESPESA',
    category: 'Infraestrutura & Ocupação',
    dueDate: '2026-10-30',
    status: 'PENDENTE',
    paymentMethod: 'BOLETO',
    entityName: 'Imobiliária Jardins Empreendimentos',
    documentNumber: 'BOL-9921',
    conciled: false,
    originModule: 'MANUAL'
  },
  {
    id: 'ft-4',
    description: 'Compra de Carnes Nobres - Frigorífico Boi Gordo',
    amount: 5420.00,
    type: 'DESPESA',
    category: 'CMV - Insumos',
    dueDate: '2026-10-28',
    status: 'PENDENTE',
    paymentMethod: 'PIX',
    entityName: 'Frigorífico Boi Gordo Ltda',
    documentNumber: 'NF-10492',
    conciled: false,
    bankAccountId: 'ba-2',
    originModule: 'COMPRAS'
  },
  {
    id: 'ft-5',
    description: 'Laticínios e Queijos Finos - Queijaria da Serra',
    amount: 2190.50,
    type: 'DESPESA',
    category: 'CMV - Insumos',
    dueDate: '2026-10-24',
    paymentDate: '2026-10-24',
    status: 'PAGO',
    paymentMethod: 'PIX',
    entityName: 'Queijaria da Serra Distribuidora',
    documentNumber: 'NF-8821',
    conciled: true,
    bankAccountId: 'ba-2',
    originModule: 'COMPRAS'
  },
  {
    id: 'ft-6',
    description: 'Energia Elétrica (Câmaras frias e salão)',
    amount: 3240.10,
    type: 'DESPESA',
    category: 'Utilidades',
    dueDate: '2026-11-05',
    status: 'PENDENTE',
    paymentMethod: 'BOLETO',
    entityName: 'Enel Distribuição São Paulo',
    documentNumber: 'CONTA-10-26',
    conciled: false,
    originModule: 'MANUAL'
  },
  {
    id: 'ft-7',
    description: 'Adiantamento de Evento Corporativo (Buffet 60 pax)',
    amount: 12500.00,
    type: 'RECEITA',
    category: 'Eventos & Corporativo',
    dueDate: '2026-10-27',
    paymentDate: '2026-10-27',
    status: 'PAGO',
    paymentMethod: 'PIX',
    entityName: 'TechSolutions Brasil S/A',
    documentNumber: 'CONTRATO-EVT-08',
    conciled: true,
    bankAccountId: 'ba-1',
    originModule: 'VENDAS'
  }
];

export const INITIAL_BANK_STATEMENT: BankStatementItem[] = [
  {
    id: 'bs-1',
    date: '2026-10-25',
    description: 'RECEBIMENTO CIELO CARTAO CREDITO',
    amount: 14820.00,
    type: 'CREDITO',
    matchedTransactionId: 'ft-1',
    status: 'CONCILIADO'
  },
  {
    id: 'bs-2',
    date: '2026-10-26',
    description: 'TED IFOOD REPASSE VENDAS',
    amount: 8350.40,
    type: 'CREDITO',
    matchedTransactionId: 'ft-2',
    status: 'CONCILIADO'
  },
  {
    id: 'bs-3',
    date: '2026-10-24',
    description: 'PIX ENVIADO QUEIJARIA SERRA',
    amount: 2190.50,
    type: 'DEBITO',
    matchedTransactionId: 'ft-5',
    status: 'CONCILIADO'
  },
  {
    id: 'bs-4',
    date: '2026-10-27',
    description: 'PIX RECEBIDO TECHSOLUTIONS',
    amount: 12500.00,
    type: 'CREDITO',
    matchedTransactionId: 'ft-7',
    status: 'CONCILIADO'
  },
  {
    id: 'bs-5',
    date: '2026-10-27',
    description: 'TARIFA MENSAL CONTA PJ ITAU',
    amount: 129.90,
    type: 'DEBITO',
    status: 'PENDENTE'
  }
];

export const INITIAL_STOCK: StockItem[] = [
  {
    id: 'stk-1',
    code: 'CAR-001',
    name: 'Filé Mignon Bovino Limpo',
    category: 'Carnes e Proteínas',
    unit: 'KG',
    currentStock: 14.5,
    minStock: 20.0,
    maxStock: 50.0,
    costPrice: 78.50, // R$/kg
    location: 'Câmara Fria 1 - Prateleira A',
    lastSupplierName: 'Frigorífico Boi Gordo Ltda',
    lastPurchaseDate: '2026-10-20'
  },
  {
    id: 'stk-2',
    code: 'PEI-002',
    name: 'Salmão Fresco Chileno (Filé)',
    category: 'Pescados',
    unit: 'KG',
    currentStock: 8.0,
    minStock: 12.0,
    maxStock: 30.0,
    costPrice: 94.00,
    location: 'Câmara Fria 1 - Prateleira B',
    lastSupplierName: 'Peixaria Oceânica',
    lastPurchaseDate: '2026-10-24'
  },
  {
    id: 'stk-3',
    code: 'LAT-003',
    name: 'Queijo Parmesão Grana D.O.P.',
    category: 'Laticínios',
    unit: 'KG',
    currentStock: 6.2,
    minStock: 5.0,
    maxStock: 15.0,
    costPrice: 110.00,
    location: 'Geladeira Laticínios',
    lastSupplierName: 'Queijaria da Serra Distribuidora',
    lastPurchaseDate: '2026-10-18'
  },
  {
    id: 'stk-4',
    code: 'GRA-004',
    name: 'Arroz Carnaroli Italiano',
    category: 'Grãos e Cereais',
    unit: 'KG',
    currentStock: 32.0,
    minStock: 15.0,
    maxStock: 60.0,
    costPrice: 22.50,
    location: 'Despensa Seca - Módulo 2',
    lastSupplierName: 'Emporio Gourmet Import',
    lastPurchaseDate: '2026-10-10'
  },
  {
    id: 'stk-5',
    code: 'COG-005',
    name: 'Cogumelos Frescos Shimeji & Paris',
    category: 'Hortifrúti',
    unit: 'KG',
    currentStock: 2.1, // RUPTURA IMINENTE!
    minStock: 8.0,
    maxStock: 25.0,
    costPrice: 38.00,
    location: 'Geladeira Hortifrúti',
    lastSupplierName: 'HortiVerde Orgânicos',
    lastPurchaseDate: '2026-10-22'
  },
  {
    id: 'stk-6',
    code: 'BEB-006',
    name: 'Vinho Tinto Cabernet Sauvignon Reserva',
    category: 'Bebidas e Vinhos',
    unit: 'UN',
    currentStock: 48,
    minStock: 24,
    maxStock: 120,
    costPrice: 42.00,
    location: 'Adega Climatizada',
    lastSupplierName: 'Vinícola Grand Terroir',
    lastPurchaseDate: '2026-10-15'
  },
  {
    id: 'stk-7',
    code: 'OLE-007',
    name: 'Azeite de Oliva Extra Virgem 0.2%',
    category: 'Mercearia Fina',
    unit: 'L',
    currentStock: 18.0,
    minStock: 10.0,
    maxStock: 40.0,
    costPrice: 58.00,
    location: 'Despensa Seca - Módulo 1',
    lastSupplierName: 'Emporio Gourmet Import',
    lastPurchaseDate: '2026-10-12'
  },
  {
    id: 'stk-8',
    code: 'EMB-008',
    name: 'Embalagem Kraft Térmica P/ Pratos Quentes',
    category: 'Embalagens Delivery',
    unit: 'UN',
    currentStock: 210,
    minStock: 150,
    maxStock: 1000,
    costPrice: 2.30,
    location: 'Estoque de Embalagens',
    lastSupplierName: 'EcoPack Embalagens Sustentáveis',
    lastPurchaseDate: '2026-10-05'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm-1',
    itemId: 'stk-1',
    itemName: 'Filé Mignon Bovino Limpo',
    type: 'SAIDA',
    quantity: 4.5,
    unitCost: 78.50,
    date: '2026-10-26 21:30',
    reason: 'Baixa de vendas da noite (18 pratos de Medalhão)',
    responsible: 'Chef Rodrigo Moura'
  },
  {
    id: 'sm-2',
    itemId: 'stk-5',
    itemName: 'Cogumelos Frescos Shimeji & Paris',
    type: 'SAIDA',
    quantity: 3.2,
    unitCost: 38.00,
    date: '2026-10-26 21:00',
    reason: 'Preparo de Risotos do jantar',
    responsible: 'Chef Rodrigo Moura'
  },
  {
    id: 'sm-3',
    itemId: 'stk-2',
    itemName: 'Salmão Fresco Chileno (Filé)',
    type: 'ENTRADA',
    quantity: 10.0,
    unitCost: 94.00,
    date: '2026-10-24 10:15',
    reason: 'Entrada via NF-e 1982 - Peixaria Oceânica',
    responsible: 'Carlos Oliveira'
  }
];

export const INITIAL_RECIPES: RecipeCard[] = [
  {
    id: 'rc-1',
    dishName: 'Medalhão de Mignon ao Molho Madeira & Risoto Parmesão',
    category: 'PRATO_PRINCIPAL',
    portions: 1,
    preparationTimeMinutes: 22,
    salePrice: 94.00,
    totalCost: 29.80,
    cmvPercentage: 31.7,
    monthlySalesQty: 340,
    quadrant: 'ESTRELA', // Alta margem, Alta saída
    ingredients: [
      {
        stockItemId: 'stk-1',
        name: 'Filé Mignon Bovino',
        grossQty: 0.25,
        netQty: 0.22,
        unit: 'KG',
        correctionFactor: 1.136,
        unitCost: 78.50,
        totalCost: 19.62
      },
      {
        stockItemId: 'stk-4',
        name: 'Arroz Carnaroli',
        grossQty: 0.09,
        netQty: 0.09,
        unit: 'KG',
        correctionFactor: 1.0,
        unitCost: 22.50,
        totalCost: 2.02
      },
      {
        stockItemId: 'stk-3',
        name: 'Queijo Parmesão Grana',
        grossQty: 0.04,
        netQty: 0.04,
        unit: 'KG',
        correctionFactor: 1.0,
        unitCost: 110.00,
        totalCost: 4.40
      },
      {
        stockItemId: 'stk-7',
        name: 'Azeite Extra Virgem e Condimentos',
        grossQty: 0.03,
        netQty: 0.03,
        unit: 'L',
        correctionFactor: 1.0,
        unitCost: 58.00,
        totalCost: 3.76
      }
    ]
  },
  {
    id: 'rc-2',
    dishName: 'Salmão Grelhado com Redução de Laranja e Aspargos',
    category: 'PRATO_PRINCIPAL',
    portions: 1,
    preparationTimeMinutes: 18,
    salePrice: 89.00,
    totalCost: 38.60,
    cmvPercentage: 43.3, // Margem apertada devido à alta do salmão
    monthlySalesQty: 290,
    quadrant: 'CAVALO_BATALHA', // Vende muito, mas margem baixa!
    ingredients: [
      {
        stockItemId: 'stk-2',
        name: 'Salmão Fresco Chileno',
        grossQty: 0.28,
        netQty: 0.23,
        unit: 'KG',
        correctionFactor: 1.217,
        unitCost: 94.00,
        totalCost: 26.32
      },
      {
        stockItemId: 'stk-7',
        name: 'Azeite de Oliva e Marinada',
        grossQty: 0.04,
        netQty: 0.04,
        unit: 'L',
        correctionFactor: 1.0,
        unitCost: 58.00,
        totalCost: 2.32
      },
      {
        stockItemId: 'stk-8',
        name: 'Acompanhamentos e Finalização',
        grossQty: 1,
        netQty: 1,
        unit: 'UN',
        correctionFactor: 1.0,
        unitCost: 9.96,
        totalCost: 9.96
      }
    ]
  },
  {
    id: 'rc-3',
    dishName: 'Risoto de Cogumelos Selvagens Trufados',
    category: 'PRATO_PRINCIPAL',
    portions: 1,
    preparationTimeMinutes: 20,
    salePrice: 79.00,
    totalCost: 17.50,
    cmvPercentage: 22.1, // Margem altíssima (77.9% de margem bruta!)
    monthlySalesQty: 75,
    quadrant: 'QUEBRA_CABECAS', // Alta margem, mas vende pouco - estimular!
    ingredients: [
      {
        stockItemId: 'stk-5',
        name: 'Cogumelos Shimeji & Paris',
        grossQty: 0.18,
        netQty: 0.16,
        unit: 'KG',
        correctionFactor: 1.125,
        unitCost: 38.00,
        totalCost: 6.84
      },
      {
        stockItemId: 'stk-4',
        name: 'Arroz Carnaroli',
        grossQty: 0.10,
        netQty: 0.10,
        unit: 'KG',
        correctionFactor: 1.0,
        unitCost: 22.50,
        totalCost: 2.25
      },
      {
        stockItemId: 'stk-3',
        name: 'Queijo Parmesão Grana',
        grossQty: 0.045,
        netQty: 0.045,
        unit: 'KG',
        correctionFactor: 1.0,
        unitCost: 110.00,
        totalCost: 4.95
      },
      {
        stockItemId: 'stk-7',
        name: 'Azeite Trufado e Manteiga',
        grossQty: 0.03,
        netQty: 0.03,
        unit: 'L',
        correctionFactor: 1.0,
        unitCost: 58.00,
        totalCost: 3.46
      }
    ]
  },
  {
    id: 'rc-4',
    dishName: 'Entrecôte com Batatas Rústicas Congeladas',
    category: 'PRATO_PRINCIPAL',
    portions: 1,
    preparationTimeMinutes: 25,
    salePrice: 65.00,
    totalCost: 34.00,
    cmvPercentage: 52.3, // CMV péssimo
    monthlySalesQty: 42,
    quadrant: 'CAO', // Baixa margem, baixa saída -> retirar ou reformular!
    ingredients: [
      {
        stockItemId: 'stk-1',
        name: 'Corte Bovino Alternativo',
        grossQty: 0.32,
        netQty: 0.28,
        unit: 'KG',
        correctionFactor: 1.14,
        unitCost: 78.50,
        totalCost: 25.12
      },
      {
        stockItemId: 'stk-7',
        name: 'Óleo e Batatas',
        grossQty: 1,
        netQty: 1,
        unit: 'UN',
        correctionFactor: 1.0,
        unitCost: 8.88,
        totalCost: 8.88
      }
    ]
  }
];

export const INITIAL_TAX_CONFIG: TaxConfiguration = {
  regime: 'SIMPLES_NACIONAL',
  aliquotaSimples: 6.5, // 6.5% no Anexo I
  icmsAliquota: 3.2,
  issAliquota: 2.0,
  pisAliquota: 0.65,
  cofinsAliquota: 3.0
};

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    number: '000.004.812',
    series: '1',
    type: 'NFE',
    recipientName: 'Consumidor Final (NFC-e / NF-e)',
    recipientCpfCnpj: '098.765.432-11',
    issueDate: '2026-10-26 22:15',
    totalValue: 348.00,
    taxValue: 22.62,
    status: 'AUTORIZADA',
    protocol: '135260098412891',
    itemsSummary: '2x Medalhão Mignon, 1x Garrafa Vinho Tinto Cabernet',
    xmlMock: '<?xml version="1.0"?><nfeProc><NFe><infNFe Id="NFe35261034891203000144550010000048121000048123"><ide><nNF>4812</nNF><vNF>348.00</vNF></ide></infNFe></nfeProc>'
  },
  {
    id: 'inv-2',
    number: '000.000.320',
    series: 'E',
    type: 'NFSE',
    recipientName: 'TechSolutions Brasil S/A',
    recipientCpfCnpj: '18.490.112/0001-88',
    issueDate: '2026-10-27 10:00',
    totalValue: 12500.00,
    taxValue: 625.00,
    status: 'AUTORIZADA',
    protocol: 'SP2026-NFS-99120',
    itemsSummary: 'Serviço de Gastronomia, Buffet e Locação de Espaço Corporativo',
    xmlMock: '<?xml version="1.0"?><CompNfse><Nfse><InfNfse><Numero>320</Numero><ValoresNfse><ValorServicos>12500.00</ValorServicos></ValoresNfse></InfNfse></Nfse></CompNfse>'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    name: 'TechSolutions Brasil S/A',
    email: 'eventos@techsolutions.com.br',
    phone: '(11) 98122-3344',
    document: '18.490.112/0001-88',
    address: 'Av. Brigadeiro Faria Lima, 3400 - 14º andar, SP',
    totalSpent: 48900.00,
    ordersCount: 6,
    lastPurchaseDate: '2026-10-27',
    status: 'VIP',
    notes: 'Cliente corporativo frequente para jantares de diretoria e premiações.'
  },
  {
    id: 'c-2',
    name: 'Dra. Beatriz Albuquerque',
    email: 'beatriz.med@gmail.com',
    phone: '(11) 99876-1122',
    document: '219.882.109-40',
    address: 'Rua Bela Cintra, 1420 - Apto 82, SP',
    totalSpent: 4210.00,
    ordersCount: 14,
    lastPurchaseDate: '2026-10-25',
    status: 'VIP',
    notes: 'Apreciadora de vinhos reserva e risotos. Reserva mesa aos sábados.'
  },
  {
    id: 'c-3',
    name: 'Marcelo Pires Nogueira',
    email: 'marcelo.pires@adv.com.br',
    phone: '(11) 97100-8899',
    document: '144.908.231-02',
    address: 'Alameda Santos, 980, SP',
    totalSpent: 1650.00,
    ordersCount: 4,
    lastPurchaseDate: '2026-10-18',
    status: 'ATIVO',
    notes: 'Costuma pedir delivery nas quartas e quintas à noite.'
  }
];

export const INITIAL_SALES_ORDERS: SaleOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'PED-1094',
    customerId: 'c-1',
    customerName: 'TechSolutions Brasil S/A',
    date: '2026-10-27',
    channel: 'CORPORATIVO',
    paymentMethod: 'PIX',
    stage: 'CONCLUIDO',
    totalAmount: 12500.00,
    notes: 'Jantar comemorativo de encerramento de trimestre para diretoria.',
    items: [
      {
        recipeCardId: 'rc-1',
        name: 'Menu Executivo Completo Degustação (Mignon)',
        quantity: 50,
        unitPrice: 180.00,
        subtotal: 9000.00
      },
      {
        stockItemId: 'stk-6',
        name: 'Garrafas Vinho Reserva Cabernet',
        quantity: 25,
        unitPrice: 140.00,
        subtotal: 3500.00
      }
    ]
  },
  {
    id: 'so-2',
    orderNumber: 'PED-1095',
    customerId: 'c-2',
    customerName: 'Dra. Beatriz Albuquerque',
    date: '2026-10-26',
    channel: 'SALAO',
    paymentMethod: 'CARTAO_CREDITO',
    stage: 'CONCLUIDO',
    totalAmount: 348.00,
    items: [
      {
        recipeCardId: 'rc-1',
        name: 'Medalhão de Mignon ao Molho Madeira',
        quantity: 2,
        unitPrice: 94.00,
        subtotal: 188.00
      },
      {
        stockItemId: 'stk-6',
        name: 'Vinho Tinto Cabernet Sauvignon Reserva',
        quantity: 1,
        unitPrice: 140.00,
        subtotal: 140.00
      },
      {
        name: 'Couvert Artesanal da Casa',
        quantity: 2,
        unitPrice: 10.00,
        subtotal: 20.00
      }
    ]
  },
  {
    id: 'so-3',
    orderNumber: 'ORC-2041',
    customerId: 'c-3',
    customerName: 'Marcelo Pires Nogueira',
    date: '2026-10-27',
    channel: 'CORPORATIVO',
    paymentMethod: 'BOLETO',
    stage: 'NEGOCIACAO',
    totalAmount: 4800.00,
    notes: 'Proposta enviada para almoço de confraternização de escritório (20 pessoas).',
    items: [
      {
        recipeCardId: 'rc-3',
        name: 'Menu Risoto de Cogumelos + Sobremesa',
        quantity: 20,
        unitPrice: 140.00,
        subtotal: 2800.00
      },
      {
        name: 'Serviço de Bebidas e Garçom Exclusivo',
        quantity: 1,
        unitPrice: 2000.00,
        subtotal: 2000.00
      }
    ]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Frigorífico Boi Gordo Distribuidora de Carnes',
    tradeName: 'Boi Gordo Prime',
    cnpj: '45.109.821/0001-30',
    contactName: 'Ricardo Vendas',
    phone: '(11) 98765-4321',
    email: 'pedidos@boigordoprime.com.br',
    category: 'CARNES',
    paymentTerms: '28 dias no boleto',
    rating: 4.8
  },
  {
    id: 'sup-2',
    name: 'Queijaria da Serra Distribuidora Ltda',
    tradeName: 'Queijos da Serra',
    cnpj: '19.442.100/0001-55',
    contactName: 'Fernanda Laticínios',
    phone: '(11) 97654-3210',
    email: 'vendas@queijariadaserra.com.br',
    category: 'LATICINIOS',
    paymentTerms: 'À vista com 5% de desconto via PIX',
    rating: 4.9
  },
  {
    id: 'sup-3',
    name: 'Peixaria Oceânica & Frutos do Mar',
    tradeName: 'Oceânica Pescados',
    cnpj: '22.881.092/0001-70',
    contactName: 'Eduardo Mar',
    phone: '(11) 96543-2109',
    email: 'contato@oceanicapescados.com.br',
    category: 'CARNES',
    paymentTerms: '14 dias ou PIX',
    rating: 4.5
  },
  {
    id: 'sup-4',
    name: 'HortiVerde Orgânicos & Cogumelos do Vale',
    tradeName: 'HortiVerde Fresh',
    cnpj: '31.902.341/0001-12',
    contactName: 'Tiago Silva',
    phone: '(11) 95432-1098',
    email: 'tiago@hortiverdeorganicos.com.br',
    category: 'HORTIFRUTI',
    paymentTerms: 'Semanal no boleto',
    rating: 4.7
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    orderNumber: 'OC-2026-088',
    supplierId: 'sup-1',
    supplierName: 'Frigorífico Boi Gordo Distribuidora de Carnes',
    issueDate: '2026-10-26',
    deliveryDateExpected: '2026-10-28',
    status: 'APROVADA',
    paymentMethod: 'PIX',
    totalAmount: 5420.00,
    notes: 'Entregar antes das 10h da manhã na entrada de serviço.',
    items: [
      {
        stockItemId: 'stk-1',
        itemName: 'Filé Mignon Bovino Limpo',
        quantity: 50.0,
        unit: 'KG',
        unitPrice: 78.50,
        totalPrice: 3925.00
      },
      {
        stockItemId: 'stk-1',
        itemName: 'Ancho Angus Resfriado',
        quantity: 20.0,
        unit: 'KG',
        unitPrice: 74.75,
        totalPrice: 1495.00
      }
    ]
  },
  {
    id: 'po-2',
    orderNumber: 'OC-2026-089',
    supplierId: 'sup-4',
    supplierName: 'HortiVerde Orgânicos & Cogumelos do Vale',
    issueDate: '2026-10-27',
    deliveryDateExpected: '2026-10-28',
    status: 'ENVIADA_FORNECEDOR',
    paymentMethod: 'BOLETO',
    totalAmount: 950.00,
    notes: 'Pedido urgente para repor estoque crítico de cogumelos!',
    items: [
      {
        stockItemId: 'stk-5',
        itemName: 'Cogumelos Frescos Shimeji & Paris',
        quantity: 25.0,
        unit: 'KG',
        unitPrice: 38.00,
        totalPrice: 950.00
      }
    ]
  }
];

export const INITIAL_QUOTATIONS: PriceQuotation[] = [
  {
    id: 'quot-1',
    title: 'Cotação Semanal de Carnes Nobres (Mignon + Bife de Tira)',
    date: '2026-10-26',
    status: 'FINALIZADA',
    items: [
      { itemName: 'Filé Mignon Bovino Limpo', requiredQty: 50, unit: 'KG' },
      { itemName: 'Ancho Angus Prime', requiredQty: 20, unit: 'KG' }
    ],
    supplierOffers: [
      {
        supplierName: 'Frigorífico Boi Gordo Prime',
        totalOffered: 5420.00,
        deliveryTimeDays: 2,
        isWinner: true
      },
      {
        supplierName: 'Cortes Sul Distribuidora',
        totalOffered: 5780.00,
        deliveryTimeDays: 3,
        isWinner: false
      },
      {
        supplierName: 'Distribuidora Prime Meat',
        totalOffered: 5900.00,
        deliveryTimeDays: 1,
        isWinner: false
      }
    ]
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Rodrigo Moura Ramos',
    cpf: '334.891.029-41',
    role: 'Chef Executivo de Cozinha',
    department: 'COZINHA',
    admissionDate: '2024-03-01',
    baseSalary: 7500.00,
    benefits: {
      mealVoucher: 850.00,
      transportVoucher: 320.00,
      healthInsurance: 450.00
    },
    status: 'ATIVO',
    contact: {
      email: 'chef.rodrigo@misebistro.com.br',
      phone: '(11) 98111-2233'
    }
  },
  {
    id: 'emp-2',
    name: 'Ana Paula Ferreira',
    cpf: '409.112.831-90',
    role: 'Sous Chef & Controle de Mise en Place',
    department: 'COZINHA',
    admissionDate: '2024-06-15',
    baseSalary: 4200.00,
    benefits: {
      mealVoucher: 850.00,
      transportVoucher: 320.00,
      healthInsurance: 450.00
    },
    status: 'ATIVO',
    contact: {
      email: 'anapaula@misebistro.com.br',
      phone: '(11) 97222-3344'
    }
  },
  {
    id: 'emp-3',
    name: 'Lucas Gabriel Silveira',
    cpf: '298.441.590-12',
    role: 'Chefe de Salão / Maître',
    department: 'ATENDIMENTO',
    admissionDate: '2024-04-10',
    baseSalary: 3800.00,
    benefits: {
      mealVoucher: 850.00,
      transportVoucher: 320.00,
      healthInsurance: 450.00
    },
    status: 'ATIVO',
    contact: {
      email: 'lucas.salao@misebistro.com.br',
      phone: '(11) 96333-4455'
    }
  },
  {
    id: 'emp-4',
    name: 'Mariana Santos',
    cpf: '381.902.771-08',
    role: 'Analista de Controladoria & Finanças',
    department: 'FINANCEIRO',
    admissionDate: '2024-02-01',
    baseSalary: 5200.00,
    benefits: {
      mealVoucher: 850.00,
      transportVoucher: 320.00,
      healthInsurance: 450.00
    },
    status: 'ATIVO',
    contact: {
      email: 'mariana.financas@misebistro.com.br',
      phone: '(11) 95444-5566'
    }
  }
];

export const INITIAL_TIME_CLOCK: TimeClockRecord[] = [
  {
    id: 'tc-1',
    employeeId: 'emp-1',
    employeeName: 'Rodrigo Moura Ramos',
    date: '2026-10-26',
    entryTime: '15:00',
    lunchStart: '18:00',
    lunchEnd: '19:00',
    exitTime: '23:45',
    overtimeMinutes: 45,
    status: 'HORA_EXTRA'
  },
  {
    id: 'tc-2',
    employeeId: 'emp-2',
    employeeName: 'Ana Paula Ferreira',
    date: '2026-10-26',
    entryTime: '14:30',
    lunchStart: '17:30',
    lunchEnd: '18:30',
    exitTime: '23:00',
    overtimeMinutes: 0,
    status: 'REGULAR'
  },
  {
    id: 'tc-3',
    employeeId: 'emp-3',
    employeeName: 'Lucas Gabriel Silveira',
    date: '2026-10-26',
    entryTime: '17:15',
    lunchStart: '20:00',
    lunchEnd: '20:30',
    exitTime: '00:30',
    overtimeMinutes: 45,
    status: 'HORA_EXTRA'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pr-1',
    employeeId: 'emp-1',
    employeeName: 'Rodrigo Moura Ramos',
    periodMonthYear: '10/2026',
    baseSalary: 7500.00,
    inssDeduction: 828.38,
    irrfDeduction: 924.12,
    benefitsDeduction: 150.00,
    netSalary: 5597.50,
    totalCostCompany: 10450.00, // Com FGTS 8%, provisão de 13º e férias
    status: 'PREVIA'
  },
  {
    id: 'pr-2',
    employeeId: 'emp-2',
    employeeName: 'Ana Paula Ferreira',
    periodMonthYear: '10/2026',
    baseSalary: 4200.00,
    inssDeduction: 419.45,
    irrfDeduction: 188.70,
    benefitsDeduction: 120.00,
    netSalary: 3471.85,
    totalCostCompany: 5880.00,
    status: 'PREVIA'
  },
  {
    id: 'pr-3',
    employeeId: 'emp-3',
    employeeName: 'Lucas Gabriel Silveira',
    periodMonthYear: '10/2026',
    baseSalary: 3800.00,
    inssDeduction: 367.45,
    irrfDeduction: 128.50,
    benefitsDeduction: 120.00,
    netSalary: 3184.05,
    totalCostCompany: 5320.00,
    status: 'PREVIA'
  },
  {
    id: 'pr-4',
    employeeId: 'emp-4',
    employeeName: 'Mariana Santos',
    periodMonthYear: '10/2026',
    baseSalary: 5200.00,
    inssDeduction: 559.45,
    irrfDeduction: 375.20,
    benefitsDeduction: 130.00,
    netSalary: 4135.35,
    totalCostCompany: 7280.00,
    status: 'PREVIA'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationChannel[] = [
  {
    id: 'int-ifood',
    name: 'iFood Merchant API (Delivery)',
    category: 'ECOMMERCE',
    status: 'CONECTADO',
    lastSync: 'Há 4 minutos',
    description: 'Importação automática de pedidos de delivery e atualização de cardápio.',
    apiEndpoint: 'https://merchant-api.ifood.com.br/v1.0',
    credentialsSet: true
  },
  {
    id: 'int-stone',
    name: 'Maquininhas Stone / Cielo (TEF & POS)',
    category: 'MAQUININHA',
    status: 'CONECTADO',
    lastSync: 'Há 12 minutos',
    description: 'Captura direta de NSU, taxas de adquirência e conciliação de cartões.',
    apiEndpoint: 'https://api.stone.com.br/pos/v2',
    credentialsSet: true
  },
  {
    id: 'int-bank',
    name: 'Open Finance Bancário (Itaú PJ)',
    category: 'BANCO',
    status: 'CONECTADO',
    lastSync: 'Hoje, às 08:30',
    description: 'Sincronização de extratos bancários, recebimento de Pix e liquidação de boletos.',
    apiEndpoint: 'https://api.itau.com.br/open-banking/v1',
    credentialsSet: true
  },
  {
    id: 'int-accounting',
    name: 'Software Contábil (Omie / Domínio)',
    category: 'CONTABILIDADE',
    status: 'CONECTADO',
    lastSync: 'Ontem, às 23:00',
    description: 'Exportação mensal de balancetes, SPED Fiscal e espelhos de NF-e para o contador.',
    apiEndpoint: 'https://app.omie.com.br/api/v1',
    credentialsSet: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-27 09:15',
    userName: 'Carlos Oliveira',
    userRole: 'ADMIN',
    action: 'Backup e Sincronização Geral',
    details: 'Snapshot de dados exportado com sucesso.',
    module: 'SISTEMA'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-27 10:00',
    userName: 'Mariana Santos',
    userRole: 'FINANCEIRO',
    action: 'Emissão de NFS-e 320',
    details: 'Nota de R$ 12.500 emitida para TechSolutions Brasil S/A.',
    module: 'FISCAL'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-26 17:30',
    userName: 'Chef Rodrigo Moura',
    userRole: 'ESTOQUE',
    action: 'Criação de Ordem de Compra OC-2026-089',
    details: 'Solicitação de 25kg de Cogumelos Frescos para evitar ruptura.',
    module: 'COMPRAS'
  }
];

// Exemplo de XML de NF-e real da SEFAZ para teste imediato de upload
export const SAMPLE_NFE_XML_1 = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe35261045109821000130550010000104921000104928" versao="4.00">
      <ide>
        <cUF>35</cUF>
        <nNF>10492</nNF>
        <natOp>VENDA DE MERCADORIA</natOp>
        <dhEmi>2026-10-27T08:30:00-03:00</dhEmi>
        <tpNF>1</tpNF>
      </ide>
      <emit>
        <CNPJ>45109821000130</CNPJ>
        <xNome>FRIGORIFICO BOI GORDO PRIME DISTRIBUIDORA LTDA</xNome>
        <xFant>BOI GORDO PRIME</xFant>
      </emit>
      <dest>
        <CNPJ>34891203000144</CNPJ>
        <xNome>MISE ALIMENTOS E BEBIDAS LTDA</xNome>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>CAR-001</cProd>
          <xProd>FILE MIGNON BOVINO RESFRIADO LIMPO VACUO</xProd>
          <NCM>02013000</NCM>
          <uCom>KG</uCom>
          <qCom>30.0000</qCom>
          <vUnCom>82.9000</vUnCom>
          <vProd>2487.00</vProd>
        </prod>
      </det>
      <det nItem="2">
        <prod>
          <cProd>CAR-009</cProd>
          <xProd>BIFE DE CHORIZO ANGUS SELECIONADO</xProd>
          <NCM>02013000</NCM>
          <uCom>KG</uCom>
          <qCom>15.0000</qCom>
          <vUnCom>76.0000</vUnCom>
          <vProd>1140.00</vProd>
        </prod>
      </det>
      <total>
        <ICMSTot>
          <vProd>3627.00</vProd>
          <vNF>3627.00</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;
