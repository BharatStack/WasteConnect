import { supabase } from '@/integrations/supabase/client';

export interface ESGContext {
  wasteEntries: any[];
  waterStats: any[];
  waterActivities: any[];
  carbonCredits: any[];
  queryPeriod: string;
  generatedAt: string;
}

/**
 * Fetches the authenticated user's last 90 days of ESG data from Supabase
 * and returns a structured context object for injection into the AI prompt.
 */
export async function buildESGContext(userId: string): Promise<ESGContext> {
  const since = new Date();
  since.setDate(since.getDate() - 90);
  const iso = since.toISOString();

  const [wasteRes, waterStatsRes, waterActivitiesRes, carbonRes] = await Promise.all([
    supabase
      .from('waste_data_logs')
      .select('waste_type,quantity,unit,collection_date,location')
      .eq('user_id', userId)
      .gte('created_at', iso)
      .limit(200),

    supabase
      .from('water_user_stats' as any)
      .select('current_score,efficiency_rating,total_credits_earned,total_earnings,last_updated')
      .eq('user_id', userId)
      .limit(10),

    supabase
      .from('water_activities' as any)
      .select('activity_type,water_saved_liters,conservation_method,credits_earned,created_at')
      .eq('user_id', userId)
      .gte('created_at', iso)
      .limit(100),

    supabase
      .from('carbon_credits' as any)
      .select('credits_type,credits_amount,status,earned_date,created_at')
      .eq('user_id', userId)
      .gte('created_at', iso)
      .limit(100),
  ]);

  return {
    wasteEntries: wasteRes.data ?? [],
    waterStats: waterStatsRes.data ?? [],
    waterActivities: waterActivitiesRes.data ?? [],
    carbonCredits: carbonRes.data ?? [],
    queryPeriod: '90 days',
    generatedAt: new Date().toISOString(),
  };
}
