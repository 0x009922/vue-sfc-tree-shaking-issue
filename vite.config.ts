import { defineConfig } from "vite";
import vue from'@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/bundle-entry.ts',
            formats: ['es'],
            fileName: 'output'
        },
    },
    clearScreen: false,
})
