import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CalculationHistory {
  id: string;
  user_id: string;
  calculation_type: string;
  input_data: any;
  result_data: any;
  created_at: string;
  is_favorite: boolean;
  title?: string;
  notes?: string;
}

interface UserPreferences {
  language: string;
  ad_frequency: number;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  calculation_notifications: boolean;
  favorite_calculations: string[];
}

interface UserStats {
  total_calculations: number;
  favorite_count: number;
  last_activity: string;
  most_used_calculation: string;
  user_level: 'beginner' | 'intermediate' | 'expert' | 'professional';
}

export const useUserData = (userId?: string) => {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Kullanıcı verilerini yükle
  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Paralel olarak tüm verileri yükle
      const [historyResult, preferencesResult, statsResult] = await Promise.all([
        loadCalculationHistory(),
        loadUserPreferences(),
        loadUserStats()
      ]);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hesaplama geçmişini yükle
  const loadCalculationHistory = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('calculation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setCalculationHistory(data || []);
      return data;
    } catch (error) {
      console.error('Error loading calculation history:', error);
      return [];
    }
  };

  // Kullanıcı tercihlerini yükle
  const loadUserPreferences = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is OK
        throw error;
      }
      
      const preferences: UserPreferences = {
        language: data?.language || 'tr',
        ad_frequency: data?.ad_frequency || 3,
        theme: (data?.theme === 'light' || data?.theme === 'dark' || data?.theme === 'system') ? data.theme : 'system',
        email_notifications: data?.email_notifications ?? true,
        calculation_notifications: data?.calculation_notifications ?? true,
        favorite_calculations: data?.favorite_calculations || []
      };
      
      setUserPreferences(preferences);
      return preferences;
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return null;
    }
  };

  // Kullanıcı istatistiklerini yükle
  const loadUserStats = async () => {
    if (!userId) return;

    try {
      // İstatistikleri hesapla
      const { data: historyData, error } = await supabase
        .from('calculation_history')
        .select('calculation_type, created_at, is_favorite')
        .eq('user_id', userId);

      if (error) throw error;

      const stats: UserStats = {
        total_calculations: historyData.length,
        favorite_count: historyData.filter(item => item.is_favorite).length,
        last_activity: historyData[0]?.created_at || new Date().toISOString(),
        most_used_calculation: getMostUsedCalculation(historyData),
        user_level: getUserLevel(historyData.length)
      };

      setUserStats(stats);
      return stats;
    } catch (error) {
      console.error('Error loading user stats:', error);
      return null;
    }
  };

  // Hesaplama kaydet
  const saveCalculation = async (
    calculationType: string,
    inputData: any,
    resultData: any,
    title?: string,
    notes?: string
  ) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('calculation_history')
        .insert({
          user_id: userId,
          calculation_type: calculationType,
          input_data: inputData,
          result_data: resultData,
          title: title || `${calculationType} Calculation`,
          notes: notes || '',
          is_favorite: false
        })
        .select()
        .single();

      if (error) throw error;

      // Yerel state'i güncelle
      setCalculationHistory(prev => [data, ...prev]);
      
      return data;
    } catch (error) {
      console.error('Error saving calculation:', error);
      throw error;
    }
  };

  // Favoriye ekle/çıkar
  const toggleFavorite = async (calculationId: string) => {
    try {
      const calculation = calculationHistory.find(c => c.id === calculationId);
      if (!calculation) return;

      const { error } = await supabase
        .from('calculation_history')
        .update({ is_favorite: !calculation.is_favorite })
        .eq('id', calculationId);

      if (error) throw error;

      // Yerel state'i güncelle
      setCalculationHistory(prev =>
        prev.map(calc =>
          calc.id === calculationId
            ? { ...calc, is_favorite: !calc.is_favorite }
            : calc
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  // Kullanıcı tercihlerini güncelle
  const updateUserPreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...userPreferences,
          ...newPreferences
        })
        .select()
        .single();

      if (error) throw error;

      const validatedData: UserPreferences = {
        language: data?.language || 'tr',
        ad_frequency: data?.ad_frequency || 3,
        theme: (data?.theme === 'light' || data?.theme === 'dark' || data?.theme === 'system') ? data.theme : 'system',
        email_notifications: data?.email_notifications ?? true,
        calculation_notifications: data?.calculation_notifications ?? true,
        favorite_calculations: data?.favorite_calculations || []
      };
      
      setUserPreferences(validatedData);
      return validatedData;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  // Yardımcı fonksiyonlar
  const getMostUsedCalculation = (history: any[]) => {
    if (!history.length) return 'none';
    
    const counts = history.reduce((acc, item) => {
      acc[item.calculation_type] = (acc[item.calculation_type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    );
  };

  const getUserLevel = (totalCalculations: number): UserStats['user_level'] => {
    if (totalCalculations < 5) return 'beginner';
    if (totalCalculations < 25) return 'intermediate';
    if (totalCalculations < 100) return 'expert';
    return 'professional';
  };

  // Favorileri getir
  const getFavorites = () => {
    return calculationHistory.filter(calc => calc.is_favorite);
  };

  // Son hesaplamaları getir
  const getRecentCalculations = (limit = 10) => {
    return calculationHistory.slice(0, limit);
  };

  return {
    calculationHistory,
    userPreferences,
    userStats,
    loading,
    saveCalculation,
    toggleFavorite,
    updateUserPreferences,
    getFavorites,
    getRecentCalculations,
    loadUserData
  };
};