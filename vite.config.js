import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      // Polling is required in Docker bind mounts where inotify events
      // don't propagate reliably from the host filesystem.
      usePolling: true,
      interval: 500,
    },
  },
})
