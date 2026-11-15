import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Listen on IPv4 and IPv6 so http://localhost:5173 and http://127.0.0.1:5173 both work.
  server: { host: true, port: 5173, strictPort: true },
})
