import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    mui: ['@mui/material', '@mui/icons-material'],
                },
            },
        },
    },
    server: {
        watch: {
            usePolling: false,
        },
        hmr: {
            overlay: false,
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material'],
    },
}); 