// Health check interface
export interface HealthStatus {
  status: string;
  message: string;
}

// User history state interface
export interface UserHistoryState {
  id_usuario: number;
  nombre: string;
  correo: string;
  productos_completados: number;
  productos_pendientes: number;
  productos_cancelados: number;
  porcentaje_completados: number;
  porcentaje_pendientes: number;
  porcentaje_cancelados: number;
}

// User total spent interface
export interface UserTotalSpent {
  id_usuario: number;
  nombre: string;
  correo: string;
  total_gastado: number;
}

// Category ranking interface
export interface CategoryRanking {
  ranking: number;
  id_categoria: number;
  nombre_categoria: string;
  total_compras: number;
}

// Query parameters for total spent
export interface TotalSpentParams {
  fecha_inicio: string; // YYYY-MM-DD format
  fecha_fin: string;    // YYYY-MM-DD format
}