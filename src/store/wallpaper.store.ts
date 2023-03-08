// Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { API_HEADERS, authHeader } from "@/util/helpers";

const baseUrl = `${import.meta.env.VITE_API_URL}/data/v1/actions/wallpapers`;

export const useWallpaperStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "wallpapers",
  state: () => ({
    wallpapers: [],
    isLoaded: false,
    totalCount: 0,
    error: null,
  }),
  getters: {
    total: (state) => state.wallpapers.length,
  },
  actions: {
    getPhotoUrl(image) {
      return `${import.meta.env.VITE_API_URL}/download/images/${image.LINK_ID}`;
    },
    getRandomPhoto() {
      return this.wallpapers[
        Math.floor(Math.random() * this.wallpapers.length)
      ];
    },
    async fetch() {
      try {
        const headers = { ...API_HEADERS, ...authHeader() };
        this.wallpapers = [];
        const response = await axios({
          url: baseUrl,
          method: "post",
          data: JSON.stringify({}),
          headers: headers,
        });
        this.totalCount = response.data.totalCount;
        this.wallpapers = response.data.items;
        this.isLoaded = true;
      } catch (error) {
        this.error = error;
      }
    },
  },
});
