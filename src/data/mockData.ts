export type Supplier = {
  id: string;
  name: string;
  logo: string;
  totalSpent: number;
  totalCodes: number;
  avgCost: number;
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

export const suppliers: Supplier[] = [
  { id: "1", name: "PlayStation", logo: "🎮", totalSpent: 45200, totalCodes: 890, avgCost: 50.79 },
  { id: "2", name: "Nintendo", logo: "🍄", totalSpent: 32100, totalCodes: 645, avgCost: 49.77 },
  { id: "3", name: "iTunes", logo: "🎵", totalSpent: 18700, totalCodes: 1240, avgCost: 15.08 },
  { id: "4", name: "Steam", logo: "🎯", totalSpent: 52300, totalCodes: 1560, avgCost: 33.53 },
  { id: "5", name: "Xbox", logo: "🟢", totalSpent: 38900, totalCodes: 720, avgCost: 54.03 },
  { id: "6", name: "Battle.net", logo: "⚔️", totalSpent: 12400, totalCodes: 310, avgCost: 40.0 },
  { id: "7", name: "Crunchyroll", logo: "🍥", totalSpent: 8900, totalCodes: 890, avgCost: 10.0 },
  { id: "8", name: "Minecraft", logo: "⛏️", totalSpent: 15600, totalCodes: 780, avgCost: 20.0 },
];

export const salesPlatforms = [
  "Eneba",
  "G2A",
  "Kinguin",
  "CDKeys",
  "MercadoLibre",
  "Facebook Marketplace",
  "Tienda propia",
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
