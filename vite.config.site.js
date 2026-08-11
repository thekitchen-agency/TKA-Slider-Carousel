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
                360: resolve(__dirname, 'demo-360.html'),
                demo_circular: resolve(__dirname, 'demo_circular.html'),
                demo_thumbs: resolve(__dirname, 'demo_thumbs.html'),
            },
        },
    },
});
