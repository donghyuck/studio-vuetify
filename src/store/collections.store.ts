// Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { authHeader } from "@/util/helpers";
import { useAuthStore } from "@/store/auth.store";
import noImage from "@/assets/img/no-image.jpg";

const baseUrl = `${import.meta.env.VITE_API_URL}/data/users/me/albums?fields=contents`;

export const useCollectionsStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "collections",
  state: () => ({
    collections: [] as any,
    isLoaded: false,
    total: 0,
    page: 1,
    skip: 0,
    pageSize: 30,
    take: 30,
    error: null,
    NO_IMAGE: noImage,
  }),
  getters:{
    pageCount:(state) => ( parseInt( state.total/state.pageSize ) )
  },
  actions: {
    setPage( newVal : number ){
      this.page = newVal;
      this.skip = (this.page - 1) * this.pageSize;
    },
    async fetch() {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      Object.assign(headers, authHeader());
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
  },
});
