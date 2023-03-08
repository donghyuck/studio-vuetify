<template>
    <v-navigation-drawer :rail="rail" permanent @click="rail = false" location="left">
        <v-list-subheader class="ma-5">
            <v-btn prepend-icon="mdi-cloud-upload" variant="outlined" color="primary" block>
                Upload New Photo
            </v-btn>
        </v-list-subheader>
        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-newspaper" title="Home" value="home"></v-list-item>
            <v-list-item prepend-icon="mdi-folder-image" title="My Account" value="account"></v-list-item>
            <v-list-item prepend-icon="mdi-folder-multiple-image" title="Shared Photos" value="users"></v-list-item>
            <v-list-item prepend-icon="mdi-sale" title="Sale" value="sale"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-layout>
        <v-parallax :src="bgPhoto.url" class="h-screen w-auto" />
    </v-layout>
</template>
<script setup lang="ts">
// Utilities
import { useWallpaperStore } from '@/store/wallpaper.store'
import {
    onMounted,
    onUnmounted,
    reactive,
    ref,
} from 'vue'
const rail = ref(false)
const wallpapers = useWallpaperStore()
const bgPhoto = reactive({
    url: 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg',
    visible: false,
    photo: null,
})

const intervalTime: number = 15000
let intervalId: number
onMounted(async () => {
    if (!wallpapers.isLoaded) {
        await wallpapers.fetch()
    }
    updateBgImage()
    intervalId = setInterval(updateBgImage, intervalTime)
})

onUnmounted(() => {
    clearInterval(intervalId)
})

function updateBgImage () {
    if (wallpapers.total > 0) {
        const proxyImage = new Image()
        const photo = wallpapers.getRandomPhoto()
        proxyImage.src = wallpapers.getPhotoUrl(photo)
        proxyImage.onload = function () {
            bgPhoto.url = proxyImage.src
            bgPhoto.photo = photo
            bgPhoto.visible = true
        }
    }
}
</script>
