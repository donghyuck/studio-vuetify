<template>
    <v-navigation-drawer :rail="rail" permanent @click="rail = false" location="left">
        <v-list-subheader class="ma-5">
            <v-btn prepend-icon="mdi-cloud-upload" variant="tonal" @click="visibleUploadDialog = true" class="w-100">
                Upload Photo
            </v-btn>
        </v-list-subheader>
        <v-list v-model="photos" :lines="false" density="compact" nav>
            <v-list-item prepend-icon="mdi-folder-image" title="Photos" value="photos" active-color="primary" to="/me/photos"></v-list-item>
            <v-list-item prepend-icon="mdi-folder-multiple-image" title="Collections" value="collections" to="/me/collections"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-main v-resize="onResize">
        <PhotoUploadDialog v-model="visibleUploadDialog" @uploadedEvent="refresh" @hideEvent="visibleUploadDialog = false" />
        <splitpanes>
            <pane class="split-pane">
                <v-overlay v-model="overlay" contained class="align-center justify-center">
                    <v-progress-circular color="primary" indeterminate size="64" />
                </v-overlay>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field :loading="loading" density="compact" variant="solo" label="Search"
                                append-inner-icon="mdi-magnify" single-line hide-details
                                @click:append-inner="search"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col :key="index" v-for="(image, index) in images" class="d-flex child-flex" cols="6" xl="1"
                            lg="2" md="3" sm="4">
                            <PhotoCard :image="image" @imageEditEvent="edit" @imageViewEvent="view"></PhotoCard>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-5"></v-divider>
                    <v-pagination v-model="page" :length="photos.pageCount" :total-visible="10" rounded="circle"
                        theme="light"></v-pagination>
                </v-container>
            </pane>
            <pane size="30" max-size="50" min-size="20" v-if="!hideRightPane" class="split-pane">
                <v-sheet class="h-100">
                    <v-container class="h-100">
                        <v-row style="min-height:300px;">
                            <PhotoEditCard v-bind:image="image" @hideEvent="hideRightPane = true"></PhotoEditCard>
                        </v-row>
                    </v-container>
                </v-sheet>
            </pane>
        </splitpanes>
        <vue-easy-lightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" @hide="onHide">
        </vue-easy-lightbox>
    </v-main>
</template>
<script setup lang="ts">
// Utilities
import {
    onMounted, ref, watch,
} from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

// Components
import PhotoCard from '@/components/PhotoCard.vue'
import PhotoEditCard from '@/components/PhotoEditCard.vue'
import PhotoUploadDialog from '@/components/PhotoUploadDialog.vue'

// store
import { usePhotosStore } from '@/store/photos.store'

const photos = usePhotosStore()
const images = ref([])
const image = ref({})
const overlay = ref(false)

// value for naviagtion drawere shrink
const rail = ref(false)

const loading = ref(false)

// value for pagination
const page = ref(1)

// value for upload window visible
const visibleUploadDialog = ref(false)

// lightbox
const visibleRef = ref(false)
const indexRef = ref(0)
const imgsRef = ref([])
const onHide = () => (visibleRef.value = false)

// splitpanes
const hideRightPane = ref(true)

async function refresh () {
    loading.value = true
    await photos.fetch()
    images.value = photos.photos
    loading.value = false
}

function search () {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 2000)
}

function edit (photo: any) {
    image.value = photo
    hideRightPane.value = false
}

function view (photo: any) {
    visibleRef.value = true
    imgsRef.value = photos.getImageUrl(photo, {})
}

function onResize () {
    if (window.innerWidth < 600) {
        if (!rail.value) { rail.value = true }
    } else {
        console.log(rail.value)
        if (rail.value) { rail.value = false }
    }
}

watch(page, async (newVal, oldVal) => {
    page.value = newVal
    photos.setPage(page.value)
    await photos.fetch()
    images.value = photos.photos
})

onMounted(async () => {
    if (!photos.isLoaded) {
        overlay.value = true
        photos.setPage(1)
        await photos.fetch()
        overlay.value = false
    }
    images.value = photos.photos
})

</script>
<style>
.split-pane {
    /* background-color: var(--v-theme-on-surface); */
    border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    font-size: 1em;
}
</style>
