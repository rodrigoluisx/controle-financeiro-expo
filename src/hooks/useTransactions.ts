import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Transaction, TransactionType } from '@/types/transaction';

export function useTransactions() {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.user.id) { setTransactions([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.from('transactions').select('*')
      .eq('user_id', session.user.id)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) Alert.alert('Erro ao carregar', error.message);
    else setTransactions((data ?? []) as Transaction[]);
    setLoading(false);
  }, [session?.user.id]);

  useEffect(() => { load(); }, [load]);

  async function add(description: string, amount: number, type: TransactionType, date: string) {
    if (!session?.user.id) return { error: new Error('Usuário não autenticado') };
    const { error } = await supabase.from('transactions').insert({ user_id:session.user.id, description, amount, type, transaction_date:date });
    if (!error) await load();
    return { error };
  }

  async function remove(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) Alert.alert('Erro', error.message); else await load();
  }

  const income = transactions.filter(t => t.type === 'income').reduce((sum,t) => sum + Number(t.amount),0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum,t) => sum + Number(t.amount),0);
  return { transactions, loading, income, expenses, balance:income-expenses, add, remove, refresh:load };
}
