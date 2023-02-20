<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card class="mx-auto w-100 photo" color="grey-lighten-4" v-bind="props" :class="{ 'on-hover': isHovering }">
            <v-img :src="photos.getImageUrl(image, { thumbnail: true, width: 300, height: 300 })"
                :elevation="isHovering ? 12 : 2" aspect-ratio="1" cover class="bg-grey-lighten-2">
                <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                    </v-row>
                </template>
                <!-- <v-menu open-on-hover>
                        <template v-slot:activator="{ props }">
                            <v-toolbar color="rgba(0, 0, 0, 0)">
                                <template v-slot:append>
                                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                                </template>2
                            </v-toolbar>
                        </template>
                        <v-list :lines="false" density="compact" nav class="pa-0 ma-0">
                            <v-list-item>
                                <v-btn size="small" prepend-icon="mdi-view-gallery-outline" variant="text" block @click="emit('imageViewEvent', image)">
                                    View
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn size="small" prepend-icon="mdi-image-edit" variant="text" block  @click="emit('imageEditEvent', image)">
                                    Edit
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu> -->
                <div class="align-self-center pa-1 photo-actions" v-if="isHovering" style="bottom:0; position: absolute;">
                    <v-btn size="small" color="white" variant="text" icon="mdi-view-gallery-outline"
                        @click="emit('imageViewEvent', image)"></v-btn>
                    <v-btn size="small" color="white" variant="text" icon="mdi-image-edit"
                        @click="emit('imageEditEvent', image)"></v-btn>
                </div>
            </v-img>
        </v-card>
    </v-hover>
</template>
<script setup lang="ts">
// store
import { usePhotosStore } from '@/store/photos.store'

const photos = usePhotosStore()

defineProps({
    image: Object,
})
const emit = defineEmits(['imageEditEvent', 'imageViewEvent'])

</script>
<style>
.v-card.photo {
    transition: opacity .4s ease-in-out;
}

.v-card.photo:not(.on-hover) {
    opacity: 0.9;
}

.v-card.photo .photo-actions {
    background: linear-gradient(45deg, rgba(37, 38, 43, 0.8) 0%, rgba(37, 38, 43, 0) 100%);
    backdrop-filter: blur(13px) saturate(160%);
    box-shadow: rgb(0 0 0 / 16%) 0px -2px 6px 1px;
    width: 100%;
}
</style>
