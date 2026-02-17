import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './', // Use relative paths for GitHub Pages
    build: {
        outDir: 'site-dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                demo: resolve(__dirname, 'demo.html'),
                demo2: resolve(__dirname, 'demo2.html'),
                reveal: resolve(__dirname, 'demo-reveal.html'),
            },
        },
    },
});
