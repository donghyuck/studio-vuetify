<template>
    <v-app>
        <NavbarDefault></NavbarDefault>
        <v-main>
            <v-parallax height="100vh" :style="headerStyle">
                <!-- <div class="d-flex flex-column fill-height justify-center align-center text-white">
                    <h1 class="text-h4 font-weight-thin mb-4">Vuetify</h1>
                    <h4 class="subheading">Build your application today!</h4>
                </div> -->
            </v-parallax>
            <div class="mr-auto ml-10 mb-50" style="position:absolute; bottom:100px; font-size: .9rem;">
                <v-card color="transparent" theme="dark" max-width="450" v-if="bgPhoto.visible" flat>
                    <v-card-text class="text-h7 py-2">{{ bgPhoto.unsplash.alt_description }}</v-card-text>
                    <v-card-actions>
                        <v-list-item class="w-100">
                            <template v-slot:prepend>
                                <v-avatar color="grey-darken-3">
                                    <v-img :src="bgPhoto.unsplash.user.profile_image.small" alt="{{ bgPhoto.unsplash.user.username }}"></v-img>
                                </v-avatar>
                            </template>
                            <v-list-item-title style="font-size: .8rem;">{{ bgPhoto.unsplash.user.name }}</v-list-item-title>
                            <!-- <v-list-item-subtitle>{{ bgPhoto.unsplash.user.name }}</v-list-item-subtitle> -->
                            <template v-slot:append>
                                <div class="justify-self-end">
                                    <v-icon class="me-1" icon="mdi-thumb-up"></v-icon>
                                    <span class="subheading me-2">{{ bgPhoto.unsplash.likes }}</span>
                                    <span class="me-1">·</span>
                                    <v-icon class="me-1" icon="mdi-account-eye"></v-icon>
                                    <span class="subheading">{{ bgPhoto.unsplash.views }}</span>
                                </div>
                            </template>
                        </v-list-item>
                    </v-card-actions>
                </v-card>
            </div>
        </v-main>
        <FooterDefault></FooterDefault>
    </v-app>
</template>
<script setup lagn="ts">
// Composables
import NavbarDefault from "../layouts/navbars/NavbarDefault.vue";
import FooterDefault from "../layouts/footers/FooterDefault.vue";

// Utilities
import { useUnsplashStore } from "@/store/unsplash";
import {
    onMounted,
    computed,
    ref,
    reactive
} from "vue";

// Globals
const unsplash = useUnsplashStore();
 
const bgPhoto = reactive({
    url: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
    visible: false,
    unsplash: null,
});

const headerStyle = computed(() => {
    return {
        backgroundImage: `url(${bgPhoto.url})`,
        transition: "background 1000ms ease-in 500ms",
        backgroundSize: "cover",
    };
})

onMounted(async () => {
    if (!unsplash.isLoaded) {
        await unsplash.fetch();
    }
    bgUpdateFromUnsplash();
});

function bgUpdateFromUnsplash() {
    console.log(`show bg image from unsplash : ${unsplash.total}`);
    if (unsplash.total > 0) {
        setTimeout(function () {
            var proxyImage = new Image();
            let unsplashPhoto = unsplash.getRandomPhoto();
            proxyImage.src = unsplashPhoto.urls.regular;
            proxyImage.onload = function () {
                bgPhoto.url = proxyImage.src;
                bgPhoto.unsplash = unsplashPhoto;
                bgPhoto.visible = true;
                console.log(`image loaded : ${bgPhoto.url}`);
                bgUpdateFromUnsplash();
            };
        }, 15000);
    }
}
</script>