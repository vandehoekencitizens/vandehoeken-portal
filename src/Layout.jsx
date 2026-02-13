import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils'; // Fixed path
import { base44 } from './api/base44Client'; // Fixed path
import { 
  Shield, 
  Home, 
  Search, 
  ShoppingBag, 
  Landmark, 
  Users,
  Menu,
  X,
  Settings,
  FileText
} from 'lucide-react';
import { Button } from './components/UI/button'; // Fixed path
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './components/ui/dropdown-menu'; // Fixed path
import ChatAgent from './components/ChatAgent'; // Fixed path

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
        setIsLoggedIn(true);
        setIsAdmin(user.role === 'admin');
      } catch {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };
    
    loadUser();
    const interval = setInterval(loadUser, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const allServices = [
    { name: 'Account', icon: Search, page: 'AccountLookup' },
    { name: 'Profile', icon: Users, page: 'Profile' },
    { name: 'Service Requests', icon: FileText, page: 'ServiceRequests' },
    { name: 'Voting', icon: Shield, page: 'Voting' },
    { name: 'Transfer', icon: Shield, page: 'Transfer' },
    { name: 'Marketplace', icon: ShoppingBag, page: 'Marketplace' },
    { name: 'Employment', icon: Users, page: 'Employment' },
    { name: 'Houses', icon: Home, page: 'Houses' },
    { name: 'Cars', icon: Shield, page: 'Cars' },
  ];

  const isActive = (page) => {
    const url = createPageUrl(page);
    return location.pathname === url || location.pathname === url + '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c66aafd5e688e7dc17bdc/c00454b8d_CoatofArms.png" 
                alt="Vandehoeken Citizen Portal logo"
                className="w-10 h-10 object-contain"
              />
              <div className="hidden sm:block">
                <p className="font-bold text-slate-800 text-sm leading-tight">Vandehoeken</p>
                <p className="text-xs text-slate-500">Citizen Portal</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 rounded-full">
                        <Menu className="w-4 h-4" />
                        Services
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Government Services</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {allServices.map((item) => (
                        <DropdownMenuItem key={item.page} onClick={() => navigate(createPageUrl(item.page))}>
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-red-600">
                        <Shield className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Settings className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Admin Portal</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(createPageUrl('Admin'))}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              ) : (
                <Link to={createPageUrl('Home')}>
                  <Button variant="ghost" className="rounded-full">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer with Vandehoeken Slogan */}
      <footer className="bg-gradient-to-br from-[#0f2943] via-[#1a3a52] to-[#0f2943] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c66aafd5e688e7dc17bdc/c00454b8d_CoatofArms.png" 
                alt="Vandehoeken Coat of Arms"
                className="w-16 h-16 object-contain"
              />
              <div>
                <p className="font-bold text-lg">The Democratic Republic of</p>
                <p className="text-[#f59e0b] font-bold text-xl">Vandehoeken</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Official government portal for citizens of Vandehoeken. Death Before Dishonor.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} Vandehoeken</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
