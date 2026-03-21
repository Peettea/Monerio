import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sluzby: resolve(__dirname, 'sluzby.html'),
        'o-nas': resolve(__dirname, 'o-nas.html'),
        blog: resolve(__dirname, 'blog.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
        'pojisteni-majetku': resolve(__dirname, 'pojisteni-majetku.html'),
        'pruvodce-hypotekami': resolve(__dirname, 'pruvodce-hypotekami.html'),
        'investovani-pro-zacatecniky': resolve(__dirname, 'investovani-pro-zacatecniky.html'),
      },
    },
  },
})
