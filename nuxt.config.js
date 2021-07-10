import webpack from 'webpack'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'custom-mech-kbd',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/app',
    'quill/dist/quill.core.css',
    // for snow theme
    'quill/dist/quill.snow.css',
    // for bubble theme
    'quill/dist/quill.bubble.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/utils',
    '@/plugins/mq',
    { src: '@/plugins/quill-editor', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/firebase'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],

  pwa: {
    workbox: {
      importScripts: ['/firebase-auth-sw.js'],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: process.env.NODE_ENV === 'development',
    },
  },

  firebase: {
    config: {
      apiKey: 'AIzaSyCDxbQpSD5-u1EshT5ABWynN-B6OwK5P94',
      authDomain: 'custom-mkbd.firebaseapp.com',
      projectId: 'custom-mkbd',
      storageBucket: 'custom-mkbd.appspot.com',
      messagingSenderId: '123631546775',
      appId: '1:123631546775:web:3fd7380cb6f570f92494d2',
    },
    services: {
      persistence: 'local',
      auth: {
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChanged',
        },
        ssr: true,
      },
      firestore: true,
      storage: true,
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // extend(config, { isDev, isClient }) {
    //   config.module.rules.push({
    //     test: /\.js$/,
    //     exclude:
    //       /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
    //     loader: 'babel-loader',
    //   })
    // },
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     'window.quill': 'quill',
    //   }),
    // ],
    transpile: [/^element-ui/],
  },
  router: {
    'exact-active-class': 'is-active',
  },
}
