<template>
    <v-navigation-drawer :rail="rail" permanent @click="rail = false" location="left">
        <v-list-subheader class="ma-5">
            <v-btn prepend-icon="mdi-folder-plus" variant="tonal" class="w-100"
                :to="{ name: 'collectionById', params: { id: 0 } }">
                New Collections
            </v-btn>
        </v-list-subheader>
        <v-list v-model="collections" :lines="false" density="compact" nav>
            <v-list-item prepend-icon="mdi-folder-image" title="Photos" value="photos" to="/me/photos"></v-list-item>
            <v-list-item prepend-icon="mdi-folder-multiple-image" title="Collections" active-color="primary"
                value="collections" to="/me/collections"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-main v-resize="onResize">
        <v-container>
            <v-row class="mb-2">
                <v-col cols="12">
                    <v-text-field :loading="loading" density="compact" variant="solo" label="Search"
                        append-inner-icon="mdi-magnify" single-line hide-details
                        @click:append-inner="search"></v-text-field>
                </v-col>
            </v-row>
            <v-row v-masonry transition-duration="0.3s" item-selector=".item" justify="center" style="min-height:300px;">
                <div v-masonry-tile class="item" :key="index" v-for="(item, index) in collectionsOfPhotos" >
                    <CollectionCard :collection="item" :highQuality="highQuality" />
                </div>
            </v-row>
            <v-divider class="mt-5"></v-divider>
            <v-pagination v-model="page" :length="collections.pageCount" :total-visible="10" rounded="circle"
                theme="light"></v-pagination>
        </v-container>
    </v-main>
</template>
<script setup lang="ts">
// Utilities
import {
    onMounted, ref, watch,
} from 'vue'

// Components
import CollectionCard from '@/components/CollectionCard.vue'

// store
import { useCollectionsStore } from '@/store/collections.store'
const collections = useCollectionsStore()

// value for naviagtion drawere shrink
const rail = ref(false)

// value for collection of photos
const collectionsOfPhotos = ref([])

// value for high res image
const highQuality = ref(true)

// value for pagination
const page = ref(1)

// value for searching
const loading = ref(false)

function onResize () {
    if (window.innerWidth < 600) {
        if (!rail.value) { rail.value = true }
    } else {
        if (rail.value) { rail.value = false }
    }
}

function search () { }

watch(page, async (newVal, oldVal) => {
    page.value = newVal
    collections.setPage(page.value)
    await collections.fetch()
    collectionsOfPhotos.value = collections.collections
})

onMounted(async () => {
    if (!collections.isLoaded) {
        collections.setPage(1)
        await collections.fetch()
    }
    collectionsOfPhotos.value = collections.collections
})

</script>
