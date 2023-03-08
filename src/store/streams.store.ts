//Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { authHeader, API_HEADERS } from "@/util/helpers";

const baseUrl = `${import.meta.env.VITE_API_URL}/data/streams/list.json`;

export const useStreamsStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "streams",
  state: () => ({
    streams: [] as any,
    isLoaded: false,
    total: 0,
    page: 1,
    skip: 0,
    pageSize: 30,
    take: 30,
    error: null,
  }),
  getters: {
    getById: (state) => (streamId: number) => {
      return state.streams.find((item) =>  item.streamId === streamId);
    },
  },
  actions: {
    setPage(newVal: number) {
      this.page = newVal;
      this.skip = (this.page - 1) * this.pageSize;
    },
    async getStreamById(streamId: number) {
        const headers = { ...API_HEADERS, ...authHeader() };
        const response = await axios({
          url: `${import.meta.env.VITE_API_URL}/data/streams/${streamId}`,
          method: "get",
          headers: headers,
        });
        return response.data;
    },
    async fetch() {
      const headers = { ...API_HEADERS, ...authHeader() };
      await axios({
        url: baseUrl,
        method: "post",
        data: JSON.stringify({
          page: this.page,
          pageSize: this.pageSize,
          skip: this.skip,
          take: this.take,
        }),
        headers: headers,
      }).then((response) => {
        const that = this;
        const dataItems = response.data.items;
        that.total = response.data.totalCount;
        that.streams = [];
        dataItems.forEach((item) => { 
          that.streams.push(item);
        });
        this.isLoaded = true;
      });
    },
  },
});
