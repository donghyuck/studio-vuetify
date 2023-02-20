import { defineStore } from "pinia";
import { useAuthStore } from "@/store/auth.store";
import noImageUrl from "@/assets/img/no-avatar.png";
 
import axios from "axios";
import { authHeader } from "@/util/helpers";

const meApiUrl = `${import.meta.env.VITE_API_URL}/data/users/me.json`;

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user: {},
  }),
  getters: {
    currentUser: (state) => (state.user == null ? null : state.user),
    curretnUserAvatarUrl(state) {
      const authStore = useAuthStore();
      if (authStore.isLoggedIn) {
        return this.getAvatarUrlByUsername(authStore.user.user.username)
      }
      return Image;
    },
  },
  actions: {
    getAvatarUrlByUsername(username: string) {
      if ( username == null )
        return noImageUrl
      return `${ import.meta.env.VITE_API_URL }/download/avatars/${username}/thumbnail?width=100&height=100`;
    },
    async me () {
      const headers = { Accept: "application/json", "Content-Type": "application/json", };
      Object.assign(headers, authHeader());
      const user = await axios.get(meApiUrl, { headers: headers })
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
      return user;
    },
  },
});
