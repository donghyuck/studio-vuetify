// Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { authHeader, API_HEADERS } from "@/util/helpers";
import { useAuthStore } from "@/store/auth.store";
import noImage from "@/assets/img/no-image.jpg";

const baseUrl = `${
  import.meta.env.VITE_API_URL
}/data/users/me/albums?fields=contents`;

export const useCollectionsStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "collections",
  state: () => ({
    collections: [] as any,
    isLoaded: false,
    total: 0,
    page: { type: Number, default: 1 },
    skip: 0,
    pageSize: 30,
    take: 30,
    error: null,
    NO_IMAGE: noImage,
  }),
  getters: {
    pageCount: (state) => parseInt(state.total / state.pageSize),
    getById: (state) => (id: Number) => {
      if (typeof id === "string") id = parseInt(id);
      return state.collections.find((item: any) => {
        console.log(
          item.albumId,
          typeof item.albumId,
          id,
          typeof id,
          item.albumId === id
        );
        if (item.albumId === id) return item;
        else return null;
      });
    },
  },
  actions: {
    setPage(newVal: number) {
      this.page = newVal;
      this.skip = (this.page - 1) * this.pageSize;
    },
    async getCollectionById(id: number) {
      const headers = { ...API_HEADERS, ...authHeader() };
      return await axios({
        url: `${import.meta.env.VITE_API_URL}/data/albums/${id}`,
        method: "get",
        headers: headers,
      }).then((response) => {
        const auth = useAuthStore();
        const data = response.data;
        var editable = false;
        if (data.user != null && auth.user.user.userId === data.user.userId) {
          editable = true;
        }
        data.editable = editable;
        return data;
      });
    },
    async fetch() {
      const headers = { ...API_HEADERS, ...authHeader() };
      this.collections = [];
      axios({
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
        var that = this;
        var dataItems = response.data.items;
        that.total = response.data.totalCount;
        const auth = useAuthStore();
        dataItems.forEach(
          (element: { user: { userId: number }; editable: boolean }) => {
            var editable = false;
            if (
              element.user != null &&
              auth.user.user.userId === element.user.userId
            ) {
              editable = true;
            }
            element.editable = editable;
            that.collections.push(element);
          }
        );
        that.isLoaded = true;
        that.total = response.data.totalCount;
      });
    },
    async getContents(id: Number) {
      const headers = { ...API_HEADERS, ...authHeader() };
      return await axios({
        url: `${
          import.meta.env.VITE_API_URL
        }/data/albums/${id}/contents?fields=link`,
        method: "post",
        data: JSON.stringify({}),
        headers: headers,
      }).then((response) => {
        var dataItems = response.data.items;
        //response.data.totalCount;
        return dataItems;
      });
    },
  },
});
