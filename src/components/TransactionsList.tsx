import { useEffect, useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface TransactionsListProps {
  userId: string;
  refresh: number;
}

export function TransactionsList({ userId, refresh }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [userId, refresh]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);

      if (error) throw error;
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <ArrowUpCircle size={20} className="text-green-600" />;
      case 'expense':
        return <ArrowDownCircle size={20} className="text-red-600" />;
      case 'budget':
        return <Wallet size={20} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'budget':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {transactions.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No transactions yet. Add your first transaction to get started!
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getTypeIcon(transaction.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {transaction.label}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs font-medium ${getTypeColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type.toUpperCase()}
                          </span>
                          {transaction.category && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {transaction.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div
                          className={`font-semibold ${
                            transaction.type === 'revenue'
                              ? 'text-green-600'
                              : transaction.type === 'expense'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {transaction.type === 'expense' ? '-' : '+'}
                          {formatCurrency(Number(transaction.amount))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
