<template>
  <v-parallax :style="headerStyle" class="h-screen w-auto">
    <div class="d-flex flex-column fill-height justify-end align-start text-white">
      <v-card v-if="bgPhoto.visible" color="transparent creater fadein" theme="dark" max-width="450" flat
        class="mb-10 ml-10">
        <v-card-text class="text-h7 py-2">{{
          bgPhoto.unsplash.description ||
          bgPhoto.unsplash.alt_description
        }}</v-card-text>
        <v-card-actions>
          <v-list-item class="w-100">
            <template #prepend>
              <v-avatar color="grey-darken-3">
                <v-img :src="bgPhoto.unsplash.user.profile_image.small" alt="{{ bgPhoto.unsplash.user.username }}" />
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
  </v-parallax>
</template>
<script setup lang="ts">
// Utilities
import { useUnsplashStore } from '@/store/unsplash'
import {
  computed,
  onMounted,
  onUnmounted,
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

const intervalTime: number = 50000
let intervalId: number

onMounted(async () => {
  if (!unsplash.isLoaded) {
    await unsplash.fetch()
  }
  updateBgImage()
  intervalId = setInterval(updateBgImage, intervalTime)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

function updateBgImage () {
  if (unsplash.total > 0) { 
    const unsplashPhoto = unsplash.getRandomPhoto()
    if( unsplashPhoto ){
      const proxyImage = new Image()
      proxyImage.src = unsplashPhoto.urls.raw
      proxyImage.onload = function () {
        bgPhoto.url = proxyImage.src
        bgPhoto.unsplash = unsplashPhoto
        bgPhoto.visible = true
      }
    }
  }
}
</script>
<style scoped>
.creater {
  animation: fadein 2s;
  -moz-animation: fadein 2s;
  /* Firefox */
  -webkit-animation: fadein 2s;
  /* Safari and Chrome */
  -o-animation: fadein 2s;
  /* Opera */
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-moz-keyframes fadein {
  /* Firefox */
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes fadein {
  /* Safari and Chrome */
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-o-keyframes fadein {
  /* Opera */
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}</style>
