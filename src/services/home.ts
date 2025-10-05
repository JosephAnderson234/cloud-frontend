import type { 
  HealthStatus, 
  UserHistoryState, 
  UserTotalSpent, 
  CategoryRanking, 
  TotalSpentParams 
} from "@interfaces/analytics";

const API_URL = import.meta.env.VITE_API_URL + ":8005"; // Assuming analytics API runs on port 8002

// Health check endpoint
export const getHealthStatus = async (): Promise<HealthStatus> => {
  const response = await fetch(`${API_URL}/health`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get health status');
  }
  
  return response.json();
};

// Get user's order history state
export const getUserHistoryState = async (userId: number): Promise<UserHistoryState> => {
  const response = await fetch(`${API_URL}/estado_historial/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user history state');
  }
  
  return response.json();
};

// Get total amount spent by user in date range
export const getUserTotalSpent = async (
  userId: number, 
  params: TotalSpentParams
): Promise<UserTotalSpent> => {
  const searchParams = new URLSearchParams({
    fecha_inicio: params.fecha_inicio,
    fecha_fin: params.fecha_fin
  });
  
  const response = await fetch(`${API_URL}/total_gastado/${userId}?${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user total spent');
  }
  
  return response.json();
};

// Get category ranking
export const getCategoryRanking = async (): Promise<CategoryRanking[]> => {
  const response = await fetch(`${API_URL}/ranking_categorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get category ranking');
  }
  
  return response.json();
};
