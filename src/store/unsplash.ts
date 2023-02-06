// Utilities
import { defineStore } from 'pinia'

// Install unsplash
import { createApi } from 'unsplash-js'
//import whatwgFetch from "whatwg-fetch";

const unsplash = createApi({
  accessKey: '<<your secret code>>',
  //fetch: whatwgFetch,
})

export const useUnsplashStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: 'unsplash',
  state: () => ({
    photos: [],
    isLoaded: false,
  }),
  getters: {
    total: state => state.photos.length,
  },
  actions: {
    getRandomPhoto () {
      return this.photos[Math.floor(Math.random() * this.photos.length)]
    },
    async fetch (queryString) {
      if (this.isLoaded) return 
      queryString = queryString || 'dark,girls,sexy'
      await unsplash.photos
        .getRandom({ query: queryString, count: 50 })
        .then(result => {
          if (result.type === 'success') {
            this.photos = result.response
            this.isLoaded = true
          }
        })
    },
  },
})
