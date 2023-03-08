//Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { authHeader, API_HEADERS } from "@/util/helpers";
import audioIcon from "@/assets/img/icons8-audio-wave.gif";
import hwpIcon from "@/assets/img/file-hwp-svgrepo-com.svg";

const DEFAULT_DOWNLOAD_OPTIONS = {
  thumbnail: false,
  width: 150,
  height: 150,
  encoding : true
};
const REG_EX_FOR_VIDEO = /^video/i;
const REG_EX_FOR_AUDIO = /^audio/i;
const REG_EX_FOR_EXT = /\.[0-9a-z]+$/i;

export const useAttachmentsStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "attachments",
  state: () => ({
    objectType: 0,
    objectId: 0,
    attachments: [] as any,
    isLoaded: false,
    total: 0,
    error: null,
    thumbnails : { 
      AUDIO : audioIcon,
      HWP : hwpIcon
    } 
  }),
  getters: {},
  actions: {
    init(objectType: number, objectId: number) {
      this.objectType = objectType;
      this.objectId = objectId;
      return this;
    },
    isVideo(attachment: { contentType: string }) {
      return REG_EX_FOR_VIDEO.test(attachment.contentType);
    },
    isAudio(attachment: { contentType: string }) {
      return REG_EX_FOR_AUDIO.test(attachment.contentType);
    },
    isPdf(attachment: { name: string }){
      return this.getExtenstion(attachment.name) === '.pdf' 
    },
    isHwp(attachment: { name: string }){
      return this.getExtenstion(attachment.name) === '.hwp' 
    },
    isAvailableForPreview(attachment: any){
      if( this.isVideo(attachment ) || this.isAudio(attachment) )
        return true;
      return false;  
    },
    getExtenstion( filename : string){
      let ext = filename.match(REG_EX_FOR_EXT);
      ext = ext || ['']
      return ext[0].toLowerCase();
    },
    getAttachmentUrl(attachment: any, options: any) {
      options = { ...DEFAULT_DOWNLOAD_OPTIONS, ...options };
      if (options.thumbnail) { 
        if( this.isHwp(attachment) )
          return hwpIcon;

         const url = `${import.meta.env.VITE_API_URL}/download/files/${
            attachment.attachmentId
          }/${attachment.name}?thumbnail=true&width=${options.width}&height=${
            options.height }&jwt=${ authHeader().Authorization }`;
          if( options.encoding ){
            return encodeURI(url);
          }else {
            return url;
          }
      }else{
        const url = `${import.meta.env.VITE_API_URL}/download/files/${
          attachment.attachmentId
        }/${attachment.name}?jwt=${ authHeader().Authorization }`;
        if( options.encoding ){
          return encodeURI(url);
        }else {
          return url;
        }
      } 
    },
    async fetch() {
      const headers = { ...API_HEADERS, ...authHeader() };
      await axios({
        url: `${import.meta.env.VITE_API_URL}/data/resources/${
          this.objectType
        }/${this.objectId}/files`,
        method: "get",
        headers: headers,
      }).then((response) => {
        const that = this;
        const dataItems = response.data.items;
        that.total = response.data.totalCount;
        that.attachments = [];
        dataItems.forEach((item) => {
          that.attachments.push(item);
        });
        this.isLoaded = true;
      });
    },
  },
});