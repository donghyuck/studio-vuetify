import { useAuthStore } from "@/store/auth.store";
const IN_BROWSER = typeof window !== "undefined";
const API_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export function getMatchMedia() {
  if (!IN_BROWSER) return;
  return window.matchMedia("(prefers-color-scheme: light)");
}
export { IN_BROWSER, API_HEADERS };
export function authHeader() {
  // return authorization header with jwt token
  const auth = useAuthStore();
  if (auth.user != null && auth.user.jwtToken) {
    let user = auth.user;
    return { Authorization: "Bearer " + user.jwtToken };
  } else {
    return {};
  }
}
export function isAdultOnly ( item : { properties :{ audltOnly:boolean}} ){
  if( item.hasOwnProperty('properties') && item.properties.hasOwnProperty( 'adultOnly')){
    return item.properties.hasOwnProperty( 'adultOnly')
  }
  return false
}
