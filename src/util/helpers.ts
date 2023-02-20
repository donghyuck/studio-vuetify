import { useAuthStore } from "@/store/auth.store";
const IN_BROWSER = typeof window !== 'undefined'
export function getMatchMedia () {
    if (!IN_BROWSER) return
  
    return window.matchMedia('(prefers-color-scheme: dark)')
}
export {
    IN_BROWSER,
}
export function authHeader() {
    // return authorization header with jwt token
    const auth = useAuthStore();  
    if ( auth.user != null && auth.user.jwtToken ) {
      let user = auth.user;
      return { Authorization: "Bearer " + user.jwtToken };
    } else {
      return { };
    }
  }
