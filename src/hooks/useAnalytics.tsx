import { useState, useEffect } from 'react';
import { 
  getHealthStatus, 
  getUserHistoryState, 
  getUserTotalSpent, 
  getCategoryRanking 
} from '@services/home';
import type { 
  HealthStatus, 
  UserHistoryState, 
  UserTotalSpent, 
  CategoryRanking, 
  TotalSpentParams 
} from '@interfaces/analytics';

export const useHealthStatus = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        setLoading(true);
        const data = await getHealthStatus();
        setHealthStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();
  }, []);

  return { healthStatus, loading, error };
};

export const useUserHistoryState = (userId: number | null) => {
  const [userHistoryState, setUserHistoryState] = useState<UserHistoryState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserHistoryState = async () => {
      try {
        setLoading(true);
        const data = await getUserHistoryState(userId);
        setUserHistoryState(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistoryState();
  }, [userId]);

  return { userHistoryState, loading, error };
};

export const useUserTotalSpent = (userId: number | null, params: TotalSpentParams | null) => {
  const [userTotalSpent, setUserTotalSpent] = useState<UserTotalSpent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !params) return;

    const fetchUserTotalSpent = async () => {
      try {
        setLoading(true);
        const data = await getUserTotalSpent(userId, params);
        setUserTotalSpent(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTotalSpent();
  }, [userId, params]);

  const refetch = async () => {
    if (!userId || !params) return;
    
    try {
      setLoading(true);
      const data = await getUserTotalSpent(userId, params);
      setUserTotalSpent(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { userTotalSpent, loading, error, refetch };
};

export const useCategoryRanking = () => {
  const [categoryRanking, setCategoryRanking] = useState<CategoryRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryRanking = async () => {
      try {
        setLoading(true);
        const data = await getCategoryRanking();
        setCategoryRanking(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryRanking();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await getCategoryRanking();
      setCategoryRanking(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { categoryRanking, loading, error, refetch };
};