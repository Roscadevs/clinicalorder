import { defineConfig } from 'vite'; // Define configuración de Vite
import react from '@vitejs/plugin-react'; // Plugin oficial de React para Vite
import path from 'path'; // Manejo de rutas

export default defineConfig({
  plugins: [react()], // Habilita Fast Refresh y JSX en React
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' para importaciones limpias
    },
  },
  server: {
    port: 5173, // Puerto local de desarrollo
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080', // Redirige peticiones de API al backend Spring Boot
        changeOrigin: true,
      },
    },
  },
});
