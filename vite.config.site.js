import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Use relative paths for GitHub Pages
    build: {
        outDir: 'site-dist',
        rollupOptions: {
            input: {
                main: 'index.html',
                demo: 'demo.html',
                demo2: 'demo2.html',
                reveal: 'demo-reveal.html',
            },
        },
    },
});
