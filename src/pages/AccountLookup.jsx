import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { 
  User, 
  Wallet, 
  CreditCard,
  Shield,
  Loader2,
  Send,
  ShoppingCart,
  Home as HomeIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '../components/UI/button';
import { Card, CardContent } from '../components/UI/card';
import TransactionHistory from '../components/UI/TransactionHistory';
import PersonalizedDashboard from '../components/UI/PersonalizedDashboard';

export default function AccountLookup() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // 1. Improved Auth Loader
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (err) {
        console.error('Not authenticated');
      } finally {
        setAuthChecked(true);
      }
    };
    loadUser();
  }, []);

  // 2. Defensive Query Logic
  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['my-account', currentUser?.email],
    queryFn: async () => {
      // Safety: Don't run if user is missing
      if (!currentUser?.email) return null;

      const accounts = await base44.entities.Account.filter({ user_email: currentUser.email });
      
      // Fix for "r.map" type errors: Ensure accounts is an array
      if (!Array.isArray(accounts) || accounts.length === 0) {
        const vntId = `VNT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const newAccount = await base44.entities.Account.create({
          vnt_id: vntId,
          user_email: currentUser.email,
          balance: 0
        });
        return newAccount;
      }
      
      return accounts[0];
    },
    enabled: !!currentUser?.email // Only run if we have an email
  });

  // 3. Loading Screen (Using your VH Blue)
  if (!authChecked || accountLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f2943] text-white">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
        <p className="text-slate-300 animate-pulse">Accessing Treasury Records...</p>
      </div>
    );
  }

  // 4. Fallback if user is not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Session Expired</h2>
        <Link to="/">
          <Button className="bg-[#1e3a5f]">Return to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors group">
            <HomeIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#c9a227] to-[#e8c547] rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-7 h-7 text-[#1e3a5f]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">My Account</h1>
              <p className="text-slate-300">VNT ID: <span className="font-mono text-white">{account?.vnt_id || 'Generating...'}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Added fallback object to prevent crashing PersonalizedDashboard */}
        <PersonalizedDashboard 
          user={currentUser || {}} 
          account={account || { balance: 0 }} 
        />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Transaction History</h2>
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-0">
               {/* Ensure we only render if we have an email */}
              {currentUser?.email && <TransactionHistory userEmail={currentUser.email} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
