import { resolve } from 'path'
import { defineConfig } from 'vite'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    Sitemap({
      hostname: 'https://www.monerio.cz',
      dynamicRoutes: [
        '/',
        '/sluzby',
        '/o-nas',
        '/blog',
        '/kontakt',
        '/blog/pojisteni-majetku',
        '/blog/pruvodce-hypotekami',
        '/blog/investovani-pro-zacatecniky',
        '/kalkulacky',
        '/kalkulacky/hypoteka',
        '/kalkulacky/investice',
        '/kalkulacky/rentgen-mzdy',
        '/kalkulacky/vypadek-prijmu'
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sluzby: resolve(__dirname, 'sluzby.html'),
        'o-nas': resolve(__dirname, 'o-nas.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
        'blog/index': resolve(__dirname, 'blog/index.html'),
        'blog/pojisteni-majetku': resolve(__dirname, 'blog/pojisteni-majetku.html'),
        'blog/pruvodce-hypotekami': resolve(__dirname, 'blog/pruvodce-hypotekami.html'),
        'blog/investovani-pro-zacatecniky': resolve(__dirname, 'blog/investovani-pro-zacatecniky.html'),
        'kalkulacky/index': resolve(__dirname, 'kalkulacky/index.html'),
        'kalkulacky/hypoteka': resolve(__dirname, 'kalkulacky/hypoteka.html'),
        'kalkulacky/investice': resolve(__dirname, 'kalkulacky/investice.html'),
        'kalkulacky/rentgen-mzdy': resolve(__dirname, 'kalkulacky/rentgen-mzdy.html'),
        'kalkulacky/vypadek-prijmu': resolve(__dirname, 'kalkulacky/vypadek-prijmu.html'),
      },
    },
  },
})
