<template>
    <v-card class="mx-auto w-100 h-100 rounded-0" variant="tonal">
        <btn-close @click="emit('hideEvent')"></btn-close>
        <v-img class="align-end text-white" max-height="300" :aspect-ratio="1"
            :src="photos.getImageUrl(localImage, { thumbnail: true, width: 300, height: 300 })" cover>
            <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
            </template>
            <v-card-title>
                <v-list-item class="w-100">
                    <template v-slot:prepend>
                        <v-avatar color="grey-darken-3" size="32"
                            :image="user.getAvatarUrlByUsername(localImage.user.username)"></v-avatar>
                    </template>
                    <v-list-item-title>{{ localImage.user.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ localImage.user.username }}</v-list-item-subtitle>
                </v-list-item>
            </v-card-title>
        </v-img>
        <v-card-subtitle class="pt-4">
            <v-text-field label="Name" v-model="localImage.name"></v-text-field>
        </v-card-subtitle>
        <v-card-text class="py-0">
            <v-chip class="ma-2" color="pink" label text-color="white" :key="index" v-for="(tag, index) in tags">
                <v-icon start icon="mdi-label"></v-icon>
                {{ tag }}
            </v-chip>
        </v-card-text>
        <v-card-text>
            <v-textarea clearable label="Description" v-model="localImage.description"></v-textarea>
            <v-table height="300px">
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, index) in Object.entries(localImage.properties)" :key="index">
                        <td>{{ value[0] }}</td>
                        <td>{{ value[1] }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-card-actions>
            <v-btn variant="tonal">
                Share
            </v-btn>
            <v-btn cvariant="tonal">
                Explore
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup lang="ts">
import {
    ref, watch,
} from 'vue'

// Components
import BtnClose from '@/components/BtnClose.vue'

// store
import { useUserStore } from '@/store/user.store'
import { usePhotosStore } from '@/store/photos.store'
const user = useUserStore()
const photos = usePhotosStore()

const props = defineProps({
    image: Object
})

const localImage = ref(props.image)
const tags = ref([])
setTags(props.image)

watch(() => props.image, (newVal, oldVal) => {
    localImage.value = newVal
    setTags(newVal)
});

function setTags(image: Object) {
    if (image.tags.length > 0)
        tags.value = image.tags.split(',')
    else
        tags.value = []
}

const emit = defineEmits(['hideEvent'])

</script>
