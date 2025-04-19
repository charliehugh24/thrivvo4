import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export function useSupabase(): { supabase: SupabaseClient<Database> } {
  return { supabase };
} 