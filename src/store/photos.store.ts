// Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { authHeader } from "@/util/helpers";
import { useAuthStore } from "@/store/auth.store";
import noImage from "@/assets/img/no-image.jpg";

const baseUrl = `${
  import.meta.env.VITE_API_URL
}/data/users/me/images/list.json?fields=link,tags`;

const uploadByUrllUrl = `${
  import.meta.env.VITE_API_URL
}/data/users/me/images/upload_by_url`;

const filepondServerUrl = `${import.meta.env.VITE_API_URL}/data/images/0/filepond`

const DEFAULT_DOWNLOAD_OPTIONS = {
  thumbnail: false,
  width: 150,
  height: 150,
};

export const usePhotosStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "photos",
  state: () => ({
    photos: [] as any,
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
    isShared(image: any) {
      if (
        image != null &&
        typeof image.imageLink != "undefined" &&
        image.imageLink != null
      )
        return true;
      else return false;
    },
    isImgUrl(url: string) {
      return fetch(url, { method: "HEAD" }).then((res) => {
        if (res == null) return false;
        return res.headers.get("Content-Type").startsWith("image");
      });
    },
    getImageUrl(image: any, options: any) {
      options = { ...DEFAULT_DOWNLOAD_OPTIONS, ...options };
      if (image != null && image.imageId > 0) {
        if (options.thumbnail) {
          return encodeURI(
            `${import.meta.env.VITE_API_URL}/download/images/${
              image.imageId
            }/thumbnail?height=${options.height}&width=${options.width}`
          );
        }
        if (this.isShared(image)) {
          return encodeURI(
            `${import.meta.env.VITE_API_URL}/download/images/${
              image.imageLink.linkId
            }`
          );
        } else {
          return encodeURI(
            `${import.meta.env.VITE_API_URL}/download/images/${image.imageId}/${
              image.name
            }?jwt=${authHeader().Authorization}`
          );
        }
      }
      return this.NO_IMAGE;
    },
    getFilePondServerSettings() {
      return {
        url: filepondServerUrl,
        process: {
          withCredentials: false,
          headers: authHeader(),
        },
      };
    },
    async uploadByUrl(data: object) {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      Object.assign(headers, authHeader());
      axios({
        url: uploadByUrllUrl,
        method: "post",
        headers: headers,
        data: JSON.stringify(data),
      })
        .then((response) => {
          //
        })
        .catch((error) => {
          //$this.$toasted.error(error.message, { icon: "error" }).goAway(3000);
        });
    },
    async fetch() {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      Object.assign(headers, authHeader());
      this.photos = [];
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
            that.photos.push(element);
          }
        );
        that.isLoaded = true;
        that.total = response.data.totalCount;
      });
    },
  },
});
