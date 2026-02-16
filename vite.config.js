import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'TkaSlider',
      fileName: (format) => `tka-slider.${format}.js`,
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled
      external: (id) => id.startsWith('gsap'),
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          gsap: 'gsap',
          'gsap/Draggable': 'Draggable',
        },
      },
    },

  },
});
