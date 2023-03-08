
// Components
import NavbarDefault from "@/layouts/navbars/NavbarDefault.vue"; 
import Photos from "@/views/me/Photos.vue";
import Collections from "@/views/me/Collections.vue"; 
import Drive from "@/views/me/Drive.vue"; 

export default {
  path: "/me",
  children: [
    {
      path: "photos",
      components: { default: Photos, header: NavbarDefault }, 
    },
    {
      path: "collections",
      components: { default: Collections, header: NavbarDefault }, 
    },
    {
      path: "drive",
      components: { default: Drive, header: NavbarDefault }, 
    },
  ],
};
