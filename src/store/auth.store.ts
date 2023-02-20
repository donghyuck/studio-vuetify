// Utilities
import { defineStore } from "pinia";
import router from "@/router";
import { useAlertStore } from "./alert.store";
import { useUserStore } from "./user.store";
import axios from "axios";

const baseUrl = `${import.meta.env.VITE_API_URL}/data/accounts/signin.json`;

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem("studio@user")),
    returnUrl: null,
  }),
  getters:{
    isLoggedIn(state) {
      return state.user != null ? true : false ;
    }, 
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const user = await axios
          .post(
            baseUrl,
            JSON.stringify({ username: username, password: password }),
            { headers: { "Content-Type": "application/json" } }
          )
          .then((response) => {
            if (typeof response.data !== "undefined") {
              const data = response.data;
              if (typeof data.error !== "undefined") {
                const error = data.error;
                return Promise.reject(error);
              }
              return data;
            }
          });
        this.user = user;
        // update pinia state
        localStorage.setItem("studio@user", JSON.stringify(user));
        
        useUserStore().me();

        router.push(this.returnUrl || "/");
      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.error(error);
      }
    }, 
    logout() {
      this.user = null;
      localStorage.removeItem("studio@user");
      router.push("/");
    },
  },
});
