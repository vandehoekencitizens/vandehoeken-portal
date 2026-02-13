import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function LoginStateWatcher() {
  useEffect(() => {
    let isLoggedIn = false;
    
    const checkAuthStatus = async () => {
      try {
        await base44.auth.me();
        // User is logged in
        if (!isLoggedIn) {
          isLoggedIn = true;
          // Notify parent window
          if (window.parent !== window) {
            window.parent.postMessage('login-success', '*');
          }
        }
      } catch {
        // User is not logged in
        isLoggedIn = false;
      }
    };

    // Check immediately
    checkAuthStatus();

    // Check every 2 seconds to detect login changes
    const interval = setInterval(checkAuthStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
