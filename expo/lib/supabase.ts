import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key: string) => {
        // Use expo-secure-store or async-storage based on platform
        return Promise.resolve(null);
      },
      setItem: (key: string, value: string) => {
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        return Promise.resolve();
      },
    },
  },
});