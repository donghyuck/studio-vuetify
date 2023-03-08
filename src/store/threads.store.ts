//Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { authHeader, API_HEADERS } from "@/util/helpers";
import router from "@/router";

export const useThreadsStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "threads",
  state: () => ({
    streamId: 0,
    threads: [] as any,
    isLoaded: false,
    total: 0,
    page: 1,
    skip: 0,
    pageSize: 30,
    take: 30,
    error: null,
  }),
  getters: {
    pageCount: (state) => parseInt(state.total / state.pageSize + 1),
    getById: (state) => (threadId: number) => {
      return state.threads.find((item) => item.streamId === threadId);
    },
  },
  actions: {
    init(streamId: number) {
      if (this.streamId !== streamId) {
        this.streamId = streamId;
        this.isLoaded = false;
      }
      return this;
    },
    setPage(newVal: number) {
      this.page = newVal;
      this.skip = (this.page - 1) * this.pageSize;
    },
    async getThreadById(threadId: number) {
      const headers = { ...API_HEADERS, ...authHeader() };
      const response = await axios({
        url: `${import.meta.env.VITE_API_URL}/data/threads/${threadId}`,
        method: "get",
        headers: headers,
      });
      return response.data;
    },
    async saveOrUpdate(message: { messageId: number; threadId: number }) {
      const headers = { ...API_HEADERS, ...authHeader() };
      if (message.messageId > 0) {
        let response = await axios({
          url: `${import.meta.env.VITE_API_URL}/data/messages/${ message.messageId }`,
          method: "POST",
          data: JSON.stringify(message),
          headers: headers,
        });
        return response.data;
      } else {
        let response = await axios({
          url: `${import.meta.env.VITE_API_URL}/data/threads/${message.threadId}`,
          method: "POST",
          data: JSON.stringify(message),
          headers: headers,
        });
        return response.data;
      }
    },
    async fetch() {

      const headers = { ...API_HEADERS, ...authHeader() };
      await axios({
        url: `${import.meta.env.VITE_API_URL}/data/streams/${
          this.streamId
        }/threads`,
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
        that.threads = [];
        dataItems.forEach((item) => {
          that.threads.push(item);
        });
        this.isLoaded = true;
      });
    },
  },
});
