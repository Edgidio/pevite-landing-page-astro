import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // Cambia de 'static' (predeterminado) a 'server' para SSR
  adapter: node({
    mode: 'standalone' // O 'middleware' si integras con otro framework
  }),
});
