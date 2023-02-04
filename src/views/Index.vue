<template>
      <v-parallax :style="headerStyle" class="h-screen w-auto" />
      <div class="mr-auto ml-10 mb-50" style="position:absolute; bottom:150px; font-size: .8rem;">
        <v-card v-if="bgPhoto.visible" color="transparent" theme="dark" max-width="450" flat>
          <v-card-text class="text-h7 py-2">{{
            bgPhoto.unsplash.description ||
              bgPhoto.unsplash.alt_description
          }}</v-card-text>
          <v-card-actions>
            <v-list-item class="w-100">
              <template #prepend>
                <v-avatar color="grey-darken-3">
                  <v-img
                    :src="bgPhoto.unsplash.user.profile_image.small"
                    alt="{{ bgPhoto.unsplash.user.username }}" />
                </v-avatar>
              </template>
              <v-list-item-title style="font-size: .8rem;">{{
                bgPhoto.unsplash.user.name
              }}</v-list-item-title>
              <v-list-item-subtitle><small>{{
                bgPhoto.unsplash.location.name
              }}</small></v-list-item-subtitle>
              <template #append>
                <div class="justify-self-end ml-5">
                  <v-icon class="me-1" icon="mdi-thumb-up" />
                  <span class="subheading me-2">{{ bgPhoto.unsplash.likes }}</span>
                  <span class="me-1">·</span>
                  <v-icon class="me-1" icon="mdi-account-eye" />
                  <span class="subheading">{{ bgPhoto.unsplash.views }}</span>
                </div>
              </template>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </div>
</template>
<script setup lang="ts">
// Utilities
import { useUnsplashStore } from '@/store/unsplash'
import {
    computed,
    onMounted,
    reactive,
} from 'vue'

// Globals
const unsplash = useUnsplashStore()
const bgPhoto = reactive({
    url: 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg',
    visible: false,
    unsplash: null,
})
const headerStyle = computed(() => {
    return {
        backgroundImage: `url(${bgPhoto.url})`,
        transition: 'background 1000ms ease-in 500ms',
        backgroundSize: 'cover',
    }
})
onMounted(async () => {
    if (!unsplash.isLoaded) {
        await unsplash.fetch()
    }
    bgUpdateFromUnsplash()
})
function bgUpdateFromUnsplash () {
    console.log(`show bg image from unsplash : ${unsplash.total}`)
    if (unsplash.total > 0) {
        setTimeout(function () {
            const proxyImage = new Image()
            const unsplashPhoto = unsplash.getRandomPhoto()
            proxyImage.src = unsplashPhoto.urls.regular
            proxyImage.onload = function () {
                bgPhoto.url = proxyImage.src
                bgPhoto.unsplash = unsplashPhoto
                bgPhoto.visible = true
                // console.log(`image loaded : ${bgPhoto.url}`)
                bgUpdateFromUnsplash()
            }
        }, 15000)
    }
}
</script>
<style scoped>

</style>
