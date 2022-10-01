import { fileURLToPath, URL } from 'url'

import { defineConfig, optimizeDeps } from 'vite'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // plugins: [
      //   NodeModulesPolyfills(),
      //   GlobalsPolyfills({
      //     process: true,
      //     buffer: true,
      //   }),
      // ],
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    // host: true,
    port: 8080,
    hmr:false,
    // https: true,
    // open: true,
    // fs: {
    //   strict: false,
    //   allow: ['..'],
    // }
  }
})
