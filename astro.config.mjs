import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import react from '@astrojs/react';

export default defineConfig({
  // Cambia de 'static' (predeterminado) a 'server' para SSR
  output: 'server',

  adapter: node({
    mode: 'standalone' // O 'middleware' si integras con otro framework
  }),

  integrations: [react()],
});