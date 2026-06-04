import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})

// Why a config file fix instead of a CLI flag?
// You could also run npm run dev -- --host 127.0.0.1 to do the same thing temporarily. 
// But you'd have to remember to type that every time you start the server, and so would anyone else 
// who clones your project from GitHub. Putting it in vite.config.js makes the setting part of the project 
// itself — anyone running npm run dev automatically gets the right binding. 
// This is what config files are for: making project-specific behavior explicit and persistent.