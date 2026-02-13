import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText,
  Loader2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoginStateWatcher from '@/components/LoginStateWatcher';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          // User is logged in, redirect to account
          navigate(createPageUrl('AccountLookup'));
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2943] via-[#1a3a52] to-[#0f2943] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }
  const services = [
    {
      icon: Search,
      title: "Account Services",
      description: "Check your VNT account balance and manage transactions",
      link: "AccountLookup",
      color: "from-blue-600 to-blue-800"
    },
    {
      icon: ShoppingBag,
      title: "Government Marketplace",
      description: "Browse official government goods and services",
      link: "Marketplace",
      color: "from-emerald-600 to-emerald-800"
    },
    {
      icon: Users,
      title: "Employment Services",
      description: "Browse government job opportunities",
      link: "Employment",
      color: "from-purple-600 to-purple-800"
    },
    {
      icon: FileText,
      title: "Citizenship Application",
      description: "Apply for Vandehoeken citizenship",
      link: "Citizenship",
      color: "from-amber-600 to-amber-800"
    },
    {
      icon: HomeIcon,
      title: "Housing Market",
      description: "Browse available properties",
      link: "Houses",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: Shield,
      title: "Vehicle Market",
      description: "Find your next vehicle",
      link: "Cars",
      color: "from-slate-700 to-slate-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2943] via-[#1a3a52] to-[#0f2943]">
      <LoginStateWatcher />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md w-full"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c66aafd5e688e7dc17bdc/c00454b8d_CoatofArms.png" 
              alt="Vandehoeken Coat of Arms"
              className="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-3">
            Vandehoeken Portal
          </h1>
          <p className="text-slate-400 mb-12 text-lg">
            Republic of Vandehoeken Citizen Services
          </p>
          
          {/* Auth Card */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome</h2>
              <p className="text-slate-600 mb-6">Access your citizen account</p>
              
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  onClick={() => base44.auth.redirectToLogin('/')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-12 rounded-xl"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
                
                <Link to={createPageUrl('Citizenship')} className="block">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Apply for Citizenship
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>




    </div>
  );
}
