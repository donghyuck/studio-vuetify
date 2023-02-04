import { createRouter, createWebHistory } from "vue-router";

// Components
import NavbarDefault from '@/layouts/navbars/NavbarDefault.vue'
import FooterDefault from '@/layouts/footers/FooterDefault.vue'
import Index from "@/views/Index.vue";
import Today from "@/views/Today.vue"; 

// Stores
import { useAuthStore } from '@/store/auth.store'

import accountRoutes from './accounts.router';

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
      components: { default: Index, header: NavbarDefault, footer:FooterDefault },
    },
    {
      path: "/today",
      name: "today",
      components: { default: Today, header: NavbarDefault, footer: FooterDefault }, 
      beforeEnter: ifAuthenticated,
    },    
    {...accountRoutes},
    // catch all redirect to home page
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
});
export default router;
