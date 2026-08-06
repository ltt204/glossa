import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Glossa',
    description: 'Sidebar translator',
    side_panel: {
      default_path: 'sidepanel.html',
    },
    permissions: ['sidePanel', 'storage', 'activeTab'],
  },
});
