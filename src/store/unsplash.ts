// Utilities
import { defineStore } from 'pinia'

// Install unsplash
import { createApi } from 'unsplash-js'
//import whatwgFetch from "whatwg-fetch";

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_API_KEY,
  //fetch: whatwgFetch,
})

export const useUnsplashStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: 'unsplash',
  state: () => ({
    photos: [],
    isLoaded: false,
    queryString: 'dark,girls,sexy',
  }),
  getters: {
    total: state => state.photos.length,
  },
  actions: {
    getRandomPhoto () {
      return this.photos[Math.floor(Math.random() * this.photos.length)]
    },
    async fetch () {
      if (this.isLoaded) return  
      await unsplash.photos
        .getRandom({ query: this.queryString, featured: true, count: 50 })
        .then(result => {
          if (result.type === 'success') {
            this.photos = result.response
            this.isLoaded = true
          }
        })
    },
  },
})
