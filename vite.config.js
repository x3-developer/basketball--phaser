import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
export default defineConfig({
    base: '/basketball/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
            '@src': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 4173,
        allowedHosts: true,
    },
});
