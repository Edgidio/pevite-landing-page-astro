import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  server: {
    host: "0.0.0.0", // Escucha en todas las interfaces de red
    port: 4321,       // Puerto personalizado
  },
  // Cambia de 'static' (predeterminado) a 'server' para SSR
  output: 'server',
  adapter: node({
    mode: 'standalone' // O 'middleware' si integras con otro framework
  }),
  integrations: [react()],
});
