import { createRouter, createWebHistory } from "vue-router";

// Components
import NavbarDefault from "@/layouts/navbars/NavbarDefault.vue";
import FooterDefault from "@/layouts/footers/FooterDefault.vue";
import Index from "@/views/Index.vue";
import Today from "@/views/Today.vue";
import Photos from "@/views/me/Photos.vue";
import Collections from "@/views/me/Collections.vue";
import Drive from "@/views/me/Drive.vue";

// Stores
import { useAuthStore } from "@/store/auth.store";

import accountRoutes from "./accounts.router";

const ifAuthenticated = (to, from, next) => {
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
    { ...accountRoutes },
    {
      path: "/me",
      children: [
        {
          path: "photos",
          components: { default: Photos, header: NavbarDefault },
          beforeEnter: ifAuthenticated,
        },
        {
          path: "collections",
          components: { default: Collections, header: NavbarDefault },
          beforeEnter: ifAuthenticated,
        },
        {
          path: "drive",
          components: { default: Drive, header: NavbarDefault },
          beforeEnter: ifAuthenticated,
        },
      ],
    },
    // catch all redirect to home page
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
export default router;
