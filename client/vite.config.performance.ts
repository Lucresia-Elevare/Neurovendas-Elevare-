import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';

/**
 * Production-Optimized Vite Configuration
 * 
 * Performance Targets:
 * - Initial load: <3s
 * - First Contentful Paint: <1.5s
 * - Time to Interactive: <3.5s
 * - Bundle size: <1MB gzipped
 */
export default defineConfig({
  plugins: [
    react(),
    
    // Gzip compression
    compression({
      algorithm: 'gzip',
      threshold: 1024, // Only compress files >1KB
    }),
    
    // Brotli compression (better than gzip)
    compression({
      algorithm: 'brotliCompress',
      threshold: 1024,
    }),
    
    // Bundle size visualization
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  build: {
    // Production optimizations
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
    },
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          'vendor-utils': ['date-fns', 'clsx'],
          
          // Feature chunks (lazy loaded)
          'quickcreate': [
            './src/flows/quick-create/QuickCreateFlow',
            './src/flows/quick-create/useQuickCreateMachine',
          ],
          'neuropresets': ['../shared/neuroPresets'],
          'analytics': ['./src/lib/analytics'],
        },
        
        // Asset naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500, // Warn if chunk >500KB
    
    // Source maps for production debugging
    sourcemap: true,
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  
  // Server config
  server: {
    port: 5000,
    strictPort: true,
    host: true,
  },
  
  // Preview config
  preview: {
    port: 5000,
    strictPort: true,
    host: true,
  },
});
