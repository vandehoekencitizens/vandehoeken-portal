import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// We remove the base44 plugin import if you want total control, 
// but if you keep it, we disable the "Agents" below.

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // This is the CRITICAL part that makes your @/App.jsx work!
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // This helps the Codespace preview work better
    host: true,
    strictPort: true,
  }
})
