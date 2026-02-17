import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    base: './',
    build: {
        outDir: 'site-dist',
        emptyOutDir: true,
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
