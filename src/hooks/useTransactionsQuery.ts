"use client";

import { useQuery } from '@tanstack/react-query';
import { createClient } from '../lib/supabase/client';
import type { Transaction } from '../types/models';

async function fetchTransactions(): Promise<Transaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data as unknown as Transaction[]) ?? [];
}

export function useTransactionsQuery() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 300000, // 5 minutos de caché (SWR)
  });
}


