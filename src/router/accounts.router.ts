import Login from "@/views/Login.vue";
import NavbarDefault from '@/layouts/navbars/NavbarDefault.vue'
export default {
    path: '/accounts', 
    children: [
        { path: '', redirect: 'login' },
        { path: 'login', components: { default: Login, header: NavbarDefault, }, }, 
    ]
};