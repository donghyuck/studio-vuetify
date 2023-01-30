import { createRouter, createWebHistory } from "vue-router";

// Components
import Index from "@/views/Index.vue";

/** Vue Router */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
    },
  ],
});

export default router;
