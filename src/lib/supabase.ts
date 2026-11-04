import { createClient } from '@supabase/supabase-js';

const url = 'https://aufdsjzbypdvjuyhbesw.supabase.co';
const key = 'sb_publishable_lO_IefJs1L6WXc2LCHRuaQ_wXAzxu26';

export const isSupabaseConfigured = Boolean(url && key);
export const supabase = createClient(url, key);
