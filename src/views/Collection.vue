<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-menu open-on-hover>
                        <template v-slot:activator="{ props }">
                            <v-toolbar color="rgba(0, 0, 0, 0)">
                                <v-btn icon @click="hasHistory()
                                    ? $router.go(-1)
                                    : $router.push('/')">
                                    <v-icon>mdi-arrow-left</v-icon>
                                </v-btn>
                                <v-toolbar-title v-if="!isEditing">{{ collection.name }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon @click="editing = !editing" v-if="!isNew">
                                    <v-fade-transition leave-absolute>
                                        <v-icon v-if="isEditing">mdi-close</v-icon>
                                        <v-icon v-else>mdi-pencil</v-icon>
                                    </v-fade-transition>
                                </v-btn>
                                <template v-slot:append>
                                    <v-btn icon="mdi-dots-vertical" v-bind="props" v-if="!isNew"></v-btn>
                                </template>
                            </v-toolbar>
                        </template>
                        <v-list :lines="false" density="compact" nav class="pa-2">
                            <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
                            <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="8">
                    <v-row>
                        <v-col>
                            <v-text-field v-if="isEditing" label="Title" hint="Enter the title of the collection."
                                :model-value="collection.name"></v-text-field>
                            <v-textarea v-if="isEditing" variant="filled" label="Description" auto-grow
                                :model-value="collection.description"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row v-if="isEditing">
                        <v-col>
                            <v-btn @click="editing = !editing" class="mr-5">
                                Cancle
                            </v-btn>
                            <v-btn @click="save" class="mr-5">
                                Save
                            </v-btn>
                            <v-btn variant="outlined" color="primary" prepend-icon="mdi-view-grid-plus" v-if="!isNew">
                                Upload a content
                            </v-btn>
                        </v-col>
                    </v-row>
                    <span v-if="!isEditing">{{ collection.description }}</span>
                </v-col>
                <v-col cols="4">
                    <v-card class="mx-auto" variant="tonal">
                        <v-card-text>
                            <v-list-item class="w-100">
                                <template v-slot:prepend>
                                    <v-avatar color="grey-darken-3"
                                        :image="user.getAvatarUrlByUsername(collection.user.username)"></v-avatar>
                                </template>
                                <v-list-item-title>{{ collection.user.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ collection.user.username }}</v-list-item-subtitle>
                                <template v-slot:append>
                                    <div class="justify-self-end">
                                        <v-icon class="me-1" icon="mdi-heart"></v-icon>
                                        <span class="subheading me-2">256</span>
                                        <span class="me-1">·</span>
                                        <v-icon class="me-1" icon="mdi-share-variant"></v-icon>
                                        <span class="subheading">45</span>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-card-text>
                        <v-snackbar v-model="hasSaveOrUpdated" :timeout="2000" attach position="absolute"
                            location="bottom left">
                            Collection has been save or updated
                        </v-snackbar>
                    </v-card>
                </v-col>
            </v-row>
            <v-divider class="my-5"></v-divider>
            <div v-if="!isEditing" v-masonry transition-duration="0.3s" item-selector=".item">
                <div v-masonry-tile class="item" :key="index" v-for="(content, index) in contents">
                    <v-card class="mr-2 mb-2" width="280" height="100%" style="min-height: 150px;" @click="show(index)">
                        <v-img class="mx-auto" height="100%" cover
                            :src="photos.getImageUrl(content.image, { thumbnail: !highQuality, width: 300, height: 300 })"
                            @load="this.$redrawVueMasonry()">
                            <template v-slot:placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                </div>
                            </template>
                            <v-label :text="`${content.order + 1}`" class="ml-2"></v-label>
                            <v-card-item class="content-body">
                            </v-card-item>
                        </v-img>
                    </v-card>
                </div>
            </div>
        </v-container>
    </v-main>
    <vue-easy-lightbox :visible="lightboxRef.visible" :imgs="lightboxRef.imgs" :index="lightboxRef.index"
        @hide="lightboxRef.visible = false">
    </vue-easy-lightbox>
</template>
<script setup lang="ts">
// Utilities
import {
    computed, onMounted, ref,
} from 'vue'

// components
import VueEasyLightbox from 'vue-easy-lightbox'

// store
import { useAuthStore } from '@/store/auth.store'
import { useUserStore } from '@/store/user.store'
import { usePhotosStore } from '@/store/photos.store'
import { useCollectionsStore } from '@/store/collections.store'
const auth = useAuthStore()
const user = useUserStore()
const photos = usePhotosStore()
const collections = useCollectionsStore()
const props = defineProps({
    id: { type: String, default: '0' },
})
const highQuality = ref(false)
const collection = ref({ albumId: 0, name: '', editable: false, description: '', user: Object })
const contents = ref([])

// lightbox
const lightboxRef = ref({ visible: false, imgs: [], index: 0 })
function show(index: number) {
    lightboxRef.value.index = index;
    lightboxRef.value.visible = true;
}
const editing = ref(false)
const hasSaveOrUpdated = ref(false)
const isNew = ref(false)
const isEditing = computed(() => {
    return (isNew.value || editing.value) && collection.value.editable
})

function save() {
    editing.value = !editing.value
    hasSaveOrUpdated.value = true
}
function hasHistory() { return window.history.length > 2 }

onMounted(async () => {
    let idToUse: number = 0
    if (typeof props.id === 'string') idToUse = parseInt(props.id)
    else idToUse = props.id
    if (idToUse > 0) {
        if (collections.isLoaded) { collection.value = collections.getById(idToUse) } else { collection.value = await collections.getCollectionById(idToUse) }
        contents.value = await collections.getContents(collection.value.albumId)
        contents.value.forEach((item) => {
            lightboxRef.value.imgs.push({
                src: photos.getImageUrl(item.image),
                title: item.image.name
            })
        })
    } else {
        collection.value.editable = true
        collection.value.user = auth.user.user
        isNew.value = true
    }
})
</script>
<style>
.profile {
    background: linear-gradient(45deg, rgba(37, 38, 43, 0.8) 0%, rgba(37, 38, 43, 0) 100%);
    backdrop-filter: blur(13px) saturate(160%);
    box-shadow: rgb(0 0 0 / 16%) 0px -2px 6px 1px;
}

.v-card .content-body {
    min-height: 150px;
}
</style>
