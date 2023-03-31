<template>
    <v-card class="collections mr-3 mb-3" color="grey-lighten-4" width="280">
        <v-img cover :src="photos.getImageUrl(collection.coverImage, { thumbnail: !highQuality, width: 300, height: 300 })"
            @load="this.$redrawVueMasonry()">
            <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
            </template>
            <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-toolbar color="rgba(0, 0, 0, 0)">
                        <template v-slot:append>
                            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>
                    </v-toolbar>
                </template>
                <v-list :lines="false" density="compact" nav class="pa-2">
                    <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
                    <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
                    <v-list-item>
                        <v-btn size="small" prepend-icon="mdi-view-gallery-outline" variant="text" block>
                            View
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn size="small" prepend-icon="mdi-image-edit" variant="text" block>
                            Edit
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
            <router-link :to="{ name: 'collectionById', params: { id: collection.albumId } }">
                <v-card-item class="collections-body">
                </v-card-item>
            </router-link>
            <v-card-item class="collections-footer">
                <v-card-title>{{ collection.name }}</v-card-title>
                <v-card-subtitle class="font-weight-light"> {{ collection.description }} </v-card-subtitle>
                <v-card-actions>
                    <v-list-item class="w-100 pa-0">
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
                            </div>
                        </template>
                    </v-list-item>
                </v-card-actions>
            </v-card-item>
        </v-img>
    </v-card>
</template>
<script setup lang="ts">
// store
import { useUserStore } from '@/store/user.store'
import { usePhotosStore } from '@/store/photos.store'
const user = useUserStore()
const photos = usePhotosStore()

const props = defineProps({
    highQuality: Boolean,
    collection: Object,
})

console.log(props)

</script>
<style>
.v-card.collections .collections-body {
    margin-top: -64px;
    height: 230px;
}

.v-card.collections .collections-footer {
    /* margin-top: 250px; */
    gap: 6px;
    background: linear-gradient(45deg, rgba(37, 38, 43, 0.8) 0%, rgba(37, 38, 43, 0) 100%);
    backdrop-filter: blur(13px) saturate(160%);
    /* box-shadow: rgb(0 0 0 / 16%) 0px -2px 6px 1px; */
    padding: 10px;
}

.v-card.collections.v-theme--light .collections-footer {
    color: #fff;
}
.v-card.collections.v-theme--light .v-toolbar .mdi-dots-vertical{
    color: #fff;
}

.v-card.collections .v-card-title {
    font-size: 1.0rem;
}

.v-card.collections .v-card-text {
    font-size: 0.95rem;
    font-weight: 350;
}

.v-card.collections .collections-footer .v-card-actions {
    padding: 0;
}

.v-card.collections .collections-footer .v-list-item-title {
    font-size: .9em;
}

.v-card.collections .collections-footer .v-list-item-subtitle {
    font-size: .8em;
}
</style>
