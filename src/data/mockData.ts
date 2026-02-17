export type ConnectionStatus = "connected" | "error";

export type SupplierOrder = {
  id: string;
  date: string;
  product: string;
  quantity: number;
  total: number;
  status: "completed" | "pending";
};

export type Supplier = {
  id: string;
  name: string;
  logo: string;
  saldo: number;
  invertido: number;
  codigosComprados: number;
  connectionStatus?: ConnectionStatus;
  lastOrders?: SupplierOrder[];
};

export type Sale = {
  id: string;
  date: string;
  product: string;
  platform: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  soldOn: string;
  status: "completed" | "pending" | "refunded";
};

export type MonthlyStat = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
};

const bambooOrders: SupplierOrder[] = [
  { id: "o1", date: "2026-02-10", product: "PS Plus 12M", quantity: 5, total: 212.5, status: "completed" },
  { id: "o2", date: "2026-02-09", product: "Steam $20", quantity: 20, total: 330, status: "completed" },
  { id: "o3", date: "2026-02-08", product: "Xbox Game Pass 3M", quantity: 10, total: 280, status: "pending" },
];
const cardOneOrders: SupplierOrder[] = [
  { id: "o4", date: "2026-02-10", product: "Nintendo eShop $50", quantity: 8, total: 304, status: "completed" },
  { id: "o5", date: "2026-02-09", product: "iTunes $25", quantity: 15, total: 292.5, status: "completed" },
  { id: "o6", date: "2026-02-07", product: "Crunchyroll Premium", quantity: 50, total: 375, status: "completed" },
];
const ezOrders: SupplierOrder[] = [
  { id: "o7", date: "2026-02-09", product: "Battle.net $20", quantity: 12, total: 192, status: "completed" },
  { id: "o8", date: "2026-02-08", product: "Minecraft Java", quantity: 6, total: 108, status: "completed" },
  { id: "o9", date: "2026-02-06", product: "Steam $10", quantity: 30, total: 240, status: "pending" },
];

export const suppliers: Supplier[] = [
  { id: "1", name: "Bamboo", logo: "🎮", saldo: 10000, invertido: 45200, codigosComprados: 890, connectionStatus: "connected", lastOrders: bambooOrders },
  { id: "2", name: "CardOne", logo: "🍄", saldo: 7000, invertido: 32100, codigosComprados: 645, connectionStatus: "connected", lastOrders: cardOneOrders },
  { id: "3", name: "EZ", logo: "🎵", saldo: 4000, invertido: 18700, codigosComprados: 1240, connectionStatus: "error", lastOrders: ezOrders },
];

export const salesPlatforms = [
  "Eneba", "G2A", "Kinguin", "CDKeys", "MercadoLibre", "Facebook Marketplace", "Tienda propia"
];

export const recentSales: Sale[] = [
  { id: "1", date: "2026-02-10", product: "PS Plus 12 Meses", platform: "PlayStation", supplier: "PlayStation", costPrice: 42.5, salePrice: 54.99, soldOn: "Eneba", status: "completed" },
  { id: "2", date: "2026-02-10", product: "Nintendo eShop $50", platform: "Nintendo", supplier: "Nintendo", costPrice: 38.0, salePrice: 47.5, soldOn: "G2A", status: "completed" },
  { id: "3", date: "2026-02-09", product: "Steam Wallet $20", platform: "Steam", supplier: "Steam", costPrice: 16.5, salePrice: 21.99, soldOn: "Kinguin", status: "completed" },
  { id: "4", date: "2026-02-09", product: "Xbox Game Pass 3M", platform: "Xbox", supplier: "Xbox", costPrice: 28.0, salePrice: 36.99, soldOn: "CDKeys", status: "completed" },
  { id: "5", date: "2026-02-09", product: "iTunes $25", platform: "iTunes", supplier: "iTunes", costPrice: 19.5, salePrice: 24.99, soldOn: "MercadoLibre", status: "pending" },
  { id: "6", date: "2026-02-08", product: "Crunchyroll Premium", platform: "Crunchyroll", supplier: "Crunchyroll", costPrice: 7.5, salePrice: 11.99, soldOn: "Tienda propia", status: "completed" },
  { id: "7", date: "2026-02-08", product: "Minecraft Java Edition", platform: "Minecraft", supplier: "Minecraft", costPrice: 18.0, salePrice: 25.99, soldOn: "Facebook Marketplace", status: "completed" },
  { id: "8", date: "2026-02-08", product: "Battle.net $20", platform: "Battle.net", supplier: "Battle.net", costPrice: 16.0, salePrice: 22.5, soldOn: "Eneba", status: "completed" },
  { id: "9", date: "2026-02-07", product: "PS Store $100", platform: "PlayStation", supplier: "PlayStation", costPrice: 82.0, salePrice: 95.99, soldOn: "G2A", status: "refunded" },
  { id: "10", date: "2026-02-07", product: "Steam Wallet $50", platform: "Steam", supplier: "Steam", costPrice: 41.0, salePrice: 52.99, soldOn: "Eneba", status: "completed" },
  { id: "11", date: "2026-02-07", product: "Xbox Live Gold 12M", platform: "Xbox", supplier: "Xbox", costPrice: 45.0, salePrice: 58.99, soldOn: "CDKeys", status: "completed" },
  { id: "12", date: "2026-02-06", product: "Nintendo eShop $20", platform: "Nintendo", supplier: "Nintendo", costPrice: 15.5, salePrice: 19.99, soldOn: "Kinguin", status: "completed" },
  { id: "13", date: "2026-02-06", product: "PS Plus 3 Meses", platform: "PlayStation", supplier: "PlayStation", costPrice: 18.0, salePrice: 24.99, soldOn: "G2A", status: "completed" },
  { id: "14", date: "2026-02-06", product: "Steam Wallet $10", platform: "Steam", supplier: "Steam", costPrice: 8.0, salePrice: 11.99, soldOn: "Eneba", status: "completed" },
  { id: "15", date: "2026-02-05", product: "Xbox Game Pass 1M", platform: "Xbox", supplier: "Xbox", costPrice: 10.0, salePrice: 14.99, soldOn: "CDKeys", status: "pending" },
  { id: "16", date: "2026-02-05", product: "iTunes $50", platform: "iTunes", supplier: "iTunes", costPrice: 39.0, salePrice: 48.99, soldOn: "MercadoLibre", status: "completed" },
  { id: "17", date: "2026-02-05", product: "Crunchyroll Mega Fan", platform: "Crunchyroll", supplier: "Crunchyroll", costPrice: 9.0, salePrice: 14.99, soldOn: "Tienda propia", status: "completed" },
  { id: "18", date: "2026-02-04", product: "Minecraft Bedrock Edition", platform: "Minecraft", supplier: "Minecraft", costPrice: 20.0, salePrice: 28.99, soldOn: "Facebook Marketplace", status: "completed" },
  { id: "19", date: "2026-02-04", product: "Battle.net $50", platform: "Battle.net", supplier: "Battle.net", costPrice: 40.0, salePrice: 52.99, soldOn: "Eneba", status: "completed" },
  { id: "20", date: "2026-02-04", product: "PS Store $50", platform: "PlayStation", supplier: "PlayStation", costPrice: 40.0, salePrice: 49.99, soldOn: "Eneba", status: "completed" },
  { id: "21", date: "2026-02-03", product: "Nintendo eShop $35", platform: "Nintendo", supplier: "Nintendo", costPrice: 27.0, salePrice: 34.99, soldOn: "G2A", status: "completed" },
  { id: "22", date: "2026-02-03", product: "Steam Wallet $100", platform: "Steam", supplier: "Steam", costPrice: 82.0, salePrice: 99.99, soldOn: "Kinguin", status: "refunded" },
  { id: "23", date: "2026-02-03", product: "Xbox Gift Card $25", platform: "Xbox", supplier: "Xbox", costPrice: 20.0, salePrice: 26.99, soldOn: "CDKeys", status: "completed" },
  { id: "24", date: "2026-02-02", product: "iTunes $15", platform: "iTunes", supplier: "iTunes", costPrice: 11.5, salePrice: 15.99, soldOn: "MercadoLibre", status: "completed" },
  { id: "25", date: "2026-02-02", product: "PS Plus 1 Mes", platform: "PlayStation", supplier: "PlayStation", costPrice: 8.0, salePrice: 12.99, soldOn: "G2A", status: "completed" },
  { id: "26", date: "2026-02-02", product: "Steam Wallet $5", platform: "Steam", supplier: "Steam", costPrice: 4.0, salePrice: 6.99, soldOn: "Eneba", status: "completed" },
  { id: "27", date: "2026-02-01", product: "Minecraft Dungeons", platform: "Minecraft", supplier: "Minecraft", costPrice: 15.0, salePrice: 21.99, soldOn: "Facebook Marketplace", status: "pending" },
  { id: "28", date: "2026-02-01", product: "Crunchyroll Fan", platform: "Crunchyroll", supplier: "Crunchyroll", costPrice: 6.0, salePrice: 9.99, soldOn: "Tienda propia", status: "completed" },
  { id: "29", date: "2026-02-01", product: "Battle.net $10", platform: "Battle.net", supplier: "Battle.net", costPrice: 8.0, salePrice: 11.99, soldOn: "Eneba", status: "completed" },
  { id: "30", date: "2026-01-31", product: "Xbox Game Pass Ultimate", platform: "Xbox", supplier: "Xbox", costPrice: 35.0, salePrice: 44.99, soldOn: "CDKeys", status: "completed" },
];

export const monthlyStats: MonthlyStat[] = [
  { month: "Sep", revenue: 18200, expenses: 13800, profit: 4400 },
  { month: "Oct", revenue: 22500, expenses: 17100, profit: 5400 },
  { month: "Nov", revenue: 31200, expenses: 23400, profit: 7800 },
  { month: "Dic", revenue: 42800, expenses: 32100, profit: 10700 },
  { month: "Ene", revenue: 28900, expenses: 21700, profit: 7200 },
  { month: "Feb", revenue: 12400, expenses: 9300, profit: 3100 },
];

export const salesByPlatform = [
  { name: "Eneba", value: 35 },
  { name: "G2A", value: 22 },
  { name: "Kinguin", value: 15 },
  { name: "CDKeys", value: 12 },
  { name: "MercadoLibre", value: 8 },
  { name: "FB Marketplace", value: 5 },
  { name: "Tienda propia", value: 3 },
];

export const salesBySupplier = [
  { name: "Steam", sales: 1560, revenue: 52300 },
  { name: "PlayStation", sales: 890, revenue: 45200 },
  { name: "Xbox", sales: 720, revenue: 38900 },
  { name: "Nintendo", sales: 645, revenue: 32100 },
  { name: "iTunes", sales: 1240, revenue: 18700 },
  { name: "Minecraft", sales: 780, revenue: 15600 },
  { name: "Battle.net", sales: 310, revenue: 12400 },
  { name: "Crunchyroll", sales: 890, revenue: 8900 },
];

// --- Reportes: rentabilidad por producto y comparativa plataformas ---
export type ProductProfitability = {
  product: string;
  platform: string;
  revenue: number;
  cost: number;
  profit: number;
  marginPct: number;
  unitsSold: number;
};

export const productProfitability: ProductProfitability[] = [
  { product: "PS Plus 12 Meses", platform: "PlayStation", revenue: 2749.5, cost: 2125, profit: 624.5, marginPct: 22.7, unitsSold: 50 },
  { product: "Steam Wallet $20", platform: "Steam", revenue: 2199, cost: 1650, profit: 549, marginPct: 25, unitsSold: 100 },
  { product: "Nintendo eShop $50", platform: "Nintendo", revenue: 2375, cost: 1900, profit: 475, marginPct: 20, unitsSold: 50 },
  { product: "Xbox Game Pass 3M", platform: "Xbox", revenue: 3699, cost: 2800, profit: 899, marginPct: 24.3, unitsSold: 100 },
  { product: "iTunes $25", platform: "iTunes", revenue: 1249.5, cost: 975, profit: 274.5, marginPct: 22, unitsSold: 50 },
  { product: "Crunchyroll Premium", platform: "Crunchyroll", revenue: 599.5, cost: 375, profit: 224.5, marginPct: 37.4, unitsSold: 50 },
  { product: "Minecraft Java Edition", platform: "Minecraft", revenue: 1299.5, cost: 900, profit: 399.5, marginPct: 30.8, unitsSold: 50 },
  { product: "Battle.net $20", platform: "Battle.net", revenue: 1125, cost: 800, profit: 325, marginPct: 28.9, unitsSold: 50 },
  { product: "Steam Wallet $50", platform: "Steam", revenue: 2649.5, cost: 2050, profit: 599.5, marginPct: 22.6, unitsSold: 50 },
  { product: "PS Plus 3 Meses", platform: "PlayStation", revenue: 1249.5, cost: 900, profit: 349.5, marginPct: 28, unitsSold: 50 },
];

export type PlatformComparison = {
  platform: string;
  revenue: number;
  profit: number;
  marginPct: number;
};

export const platformComparison: PlatformComparison[] = [
  { platform: "Eneba", revenue: 45200, profit: 11200, marginPct: 24.8 },
  { platform: "G2A", revenue: 28900, profit: 7200, marginPct: 24.9 },
  { platform: "Kinguin", revenue: 15600, profit: 3900, marginPct: 25 },
  { platform: "CDKeys", revenue: 12400, profit: 3100, marginPct: 25 },
  { platform: "MercadoLibre", revenue: 8900, profit: 2100, marginPct: 23.6 },
  { platform: "Tienda propia", revenue: 4200, profit: 1050, marginPct: 25 },
];

// --- Catálogo: productos marketplace, proveedores, mapeos ---
export type MarketplaceProduct = {
  id: string;
  name: string;
  platform: string;
  category: string;
};

export type SupplierProduct = {
  id: string;
  supplierId: string;
  name: string;
  sku: string;
  cost: number;
  stock: number;
};

export type CatalogMapping = {
  id: string;
  marketplaceProductId: string;
  marketplaceProductName: string;
  marketplacePlatform: string;
  supplierId: string;
  supplierName: string;
  supplierSku: string;
  cost: number;
  salePrice: number;
  marginPct: number;
  autoFulfillment: boolean;
};

export const marketplaceProducts: MarketplaceProduct[] = [
  { id: "mp1", name: "PS Plus 12 Meses", platform: "PlayStation", category: "Suscripciones" },
  { id: "mp2", name: "Steam Wallet $20", platform: "Steam", category: "Wallet" },
  { id: "mp3", name: "Nintendo eShop $50", platform: "Nintendo", category: "Wallet" },
  { id: "mp4", name: "Xbox Game Pass 3M", platform: "Xbox", category: "Suscripciones" },
  { id: "mp5", name: "Crunchyroll Premium", platform: "Crunchyroll", category: "Streaming" },
  { id: "mp6", name: "iTunes $25", platform: "iTunes", category: "Wallet" },
  { id: "mp7", name: "Minecraft Java", platform: "Minecraft", category: "Juegos" },
  { id: "mp8", name: "Battle.net $20", platform: "Battle.net", category: "Wallet" },
];

export const supplierProducts: SupplierProduct[] = [
  { id: "sp1", supplierId: "1", name: "PS Plus 12M", sku: "BAM-PS12", cost: 42.5, stock: 120 },
  { id: "sp2", supplierId: "1", name: "Steam $20", sku: "BAM-ST20", cost: 16.5, stock: 500 },
  { id: "sp3", supplierId: "2", name: "Nintendo eShop $50", sku: "CO-NE50", cost: 38, stock: 80 },
  { id: "sp4", supplierId: "2", name: "iTunes $25", sku: "CO-IT25", cost: 19.5, stock: 200 },
  { id: "sp5", supplierId: "3", name: "Crunchyroll 1M", sku: "EZ-CR1", cost: 7.5, stock: 1000 },
  { id: "sp6", supplierId: "3", name: "Battle.net $20", sku: "EZ-BN20", cost: 16, stock: 150 },
  { id: "sp7", supplierId: "1", name: "Xbox Game Pass 3M", sku: "BAM-XGP3", cost: 28, stock: 90 },
  { id: "sp8", supplierId: "2", name: "Minecraft Java", sku: "CO-MJ", cost: 18, stock: 60 },
];

export const catalogMappings: CatalogMapping[] = [
  { id: "cm1", marketplaceProductId: "mp1", marketplaceProductName: "PS Plus 12 Meses", marketplacePlatform: "PlayStation", supplierId: "1", supplierName: "Bamboo", supplierSku: "BAM-PS12", cost: 42.5, salePrice: 54.99, marginPct: 29.4, autoFulfillment: true },
  { id: "cm2", marketplaceProductId: "mp2", marketplaceProductName: "Steam Wallet $20", marketplacePlatform: "Steam", supplierId: "1", supplierName: "Bamboo", supplierSku: "BAM-ST20", cost: 16.5, salePrice: 21.99, marginPct: 33.3, autoFulfillment: true },
  { id: "cm3", marketplaceProductId: "mp3", marketplaceProductName: "Nintendo eShop $50", marketplacePlatform: "Nintendo", supplierId: "2", supplierName: "CardOne", supplierSku: "CO-NE50", cost: 38, salePrice: 47.5, marginPct: 25, autoFulfillment: false },
  { id: "cm4", marketplaceProductId: "mp5", marketplaceProductName: "Crunchyroll Premium", marketplacePlatform: "Crunchyroll", supplierId: "3", supplierName: "EZ", supplierSku: "EZ-CR1", cost: 7.5, salePrice: 11.99, marginPct: 59.9, autoFulfillment: true },
];

// --- Automatización ---
export type AutomationLogEntry = {
  id: string;
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
};

export type PendingOrder = {
  id: string;
  product: string;
  platform: string;
  salePrice: number;
  createdAt: string;
  status: "queued" | "fulfilling" | "sent";
};

export type AutomationAlert = {
  id: string;
  type: "error" | "warning";
  title: string;
  message: string;
  timestamp: string;
};

export const automationLogMock: AutomationLogEntry[] = [
  { id: "l1", timestamp: new Date().toISOString(), level: "info", message: "Sistema activo. Escuchando ventas." },
  { id: "l2", timestamp: new Date(Date.now() - 60000).toISOString(), level: "success", message: "Venta recibida: Steam $20 en Eneba. Orden creada en cola." },
  { id: "l3", timestamp: new Date(Date.now() - 120000).toISOString(), level: "info", message: "Proveedor Bamboo: compra completada. Código enviado al comprador." },
  { id: "l4", timestamp: new Date(Date.now() - 180000).toISOString(), level: "warning", message: "Proveedor EZ: alta latencia (3.2s). Reintentando." },
  { id: "l5", timestamp: new Date(Date.now() - 240000).toISOString(), level: "error", message: "Proveedor EZ: error de conexión. Orden en cola pendiente." },
];

export const pendingOrdersMock: PendingOrder[] = [
  { id: "po1", product: "iTunes $25", platform: "MercadoLibre", salePrice: 24.99, createdAt: new Date(Date.now() - 30000).toISOString(), status: "fulfilling" },
  { id: "po2", product: "Crunchyroll Premium", platform: "Tienda propia", salePrice: 11.99, createdAt: new Date(Date.now() - 90000).toISOString(), status: "queued" },
  { id: "po3", product: "Nintendo eShop $50", platform: "G2A", salePrice: 47.5, createdAt: new Date(Date.now() - 150000).toISOString(), status: "sent" },
];

export const automationAlertsMock: AutomationAlert[] = [
  { id: "a1", type: "error", title: "Conexión EZ", message: "API no responde. Revisar credenciales o estado del proveedor.", timestamp: new Date(Date.now() - 240000).toISOString() },
  { id: "a2", type: "warning", title: "Stock bajo", message: "Minecraft Java (CardOne): quedan 8 unidades.", timestamp: new Date(Date.now() - 360000).toISOString() },
];
