import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingCart,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { format, isValid } from 'date-fns'; // Added isValid

export default function TransactionHistory({ userEmail }) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', userEmail],
    queryFn: async () => {
      if (!userEmail) return []; // Safety check
      
      const sent = await base44.entities.Transaction.filter({ from_email: userEmail });
      const received = await base44.entities.Transaction.filter({ to_email: userEmail });
      
      // Safety: Ensure we have arrays before spreading to avoid "r.map" errors
      const sentArr = Array.isArray(sent) ? sent : [];
      const receivedArr = Array.isArray(received) ? received : [];
      
      return [...sentArr, ...receivedArr].sort((a, b) => 
        new Date(b.created_date || 0) - new Date(a.created_date || 0)
      );
    },
    enabled: !!userEmail
  });

  // Safety: Ensure transactions is always an array for the .map() below
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const getIcon = (type) => {
    switch(type) {
      case 'purchase': return ShoppingCart;
      case 'transfer_sent': return ArrowUpRight;
      case 'transfer_received': return ArrowDownLeft;
      default: return CheckCircle;
    }
  };

  const getColor = (type, fromEmail) => {
    if (type === 'purchase' || type === 'transfer_sent' || fromEmail === userEmail) {
      return 'text-red-600';
    }
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {safeTransactions.length > 0 ? (
          <div className="space-y-3">
            {safeTransactions.map((txn, idx) => {
              const Icon = getIcon(txn.type);
              const isDebit = txn.from_email === userEmail;
              
              // Safety: Fix "Invalid Time" error
              const txnDate = new Date(txn.created_date);
              const displayDate = isValid(txnDate) 
                ? format(txnDate, 'MMM d, yyyy h:mm a')
                : 'Pending Date...';
              
              return (
                <motion.div
                  key={txn.id || idx} // Fallback key
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDebit ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${getColor(txn.type, txn.from_email)}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {txn.description || txn.item_name || 'Transaction'}
                      </p>
                      <p className="text-xs text-slate-500">{displayDate}</p>
                      {txn.to_vnt_id && txn.from_vnt_id && (
                        <p className="text-xs text-slate-500">
                          {isDebit ? `To: ${txn.to_vnt_id}` : `From: ${txn.from_vnt_id}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      isDebit ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {/* Safety: toLocaleString() check */}
                      {isDebit ? '-' : '+'}{(txn.amount || 0).toLocaleString()} VHS
                    </p>
                    <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {txn.status || 'pending'}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No transaction history yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
