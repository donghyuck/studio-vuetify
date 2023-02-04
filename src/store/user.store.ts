import { defineStore } from "pinia";
import { useAuthStore } from "@/store/auth.store";
import Image from "@/assets/img/no-avatar.png" 

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user: {},
  }),
  getters:{
    currentUser : state =>  state.user == null ? null : state.user 
  },
  actions: {
    getAvatarUrl() {  
        const authStore = useAuthStore();
        if ( authStore.isLoggedIn ){
            return this.getAvatarUrlByUsername( authStore.user.user.username )
        } 
        return Image
    },
    getAvatarUrlByUsername(username:string) {
        return `${import.meta.env.VITE_API_URL}/download/avatars/${username}/thumbnail?width=100&height=100`;
    }
  },
});
