import { createRouter, createWebHistory } from "vue-router";
// Components
import NavbarDefault from "@/layouts/navbars/NavbarDefault.vue";
import FooterDefault from "@/layouts/footers/FooterDefault.vue";
import Index from "@/views/Index.vue";
import Today from "@/views/Today.vue";
import Collection from "@/views/Collection.vue";
import Threads from "@/views/streams/Threads.vue";
import Messages from "@/views/streams/Messages.vue";
import Post from "@/views/streams/Post.vue";

// Stores
import { useAuthStore } from "@/store/auth.store";
import accountsRoutes from "./accounts.router";
import meRoutes from "./me.router";

const ifAuthenticated = (to:any, from:any, next:any) => {
  const auth = useAuthStore();
  if (auth.isLoggedIn) {
    next();
    return;
  }
  next("/accounts/login");
};

/** Vue Router */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      components: {
        default: Index,
        header: NavbarDefault,
        footer: FooterDefault,
      },
    },
    {
      path: "/today",
      name: "today",
      components: { default: Today, header: NavbarDefault },
      beforeEnter: ifAuthenticated,
    },
    { ...accountsRoutes },
    {
      ...meRoutes,
      beforeEnter: ifAuthenticated,
    },
    {
      name: "streamById",
      path: "/streams/:id(\\d+)",
      components: { default: Threads, header: NavbarDefault },
      props: { default: true },
    },
    {
      name: "threadById",
      path: "/streams/:streamId(\\d+)/threads/:threadId(\\d+)",
      components: { default: Messages, header: NavbarDefault },
      props: { default: true },
    },
    {
      name: "postMessage",
      path: "/streams/:streamId(\\d+)/threads/:threadId(\\d+)/post",
      components: { default: Post, header: NavbarDefault },
      props: { default: true },
    },
    {
      name: "collectionById",
      path: "/collections/:id",
      components: { default: Collection, header: NavbarDefault },
      props: { default: true },
      beforeEnter: ifAuthenticated,
    },
    // catch all redirect to home page
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
export default router;
