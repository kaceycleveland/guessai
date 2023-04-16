import { createClient } from '@supabase/supabase-js';

import { Database } from './database.types';

export const SupabaseAdminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ADMIN_KEY!
);
