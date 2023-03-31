<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-menu open-on-hover>
                        <template v-slot:activator="{ props }">
                            <v-toolbar color="rgba(0, 0, 0, 0)" density="compact">
                                <v-btn icon @click="hasHistory()
                                    ? $router.go(-1)
                                    : $router.push('/')">
                                    <v-icon>mdi-arrow-left</v-icon>
                                </v-btn>
                                <v-toolbar-title>{{ streamRef.displayName }}<small class="ml-5 font-weight-thin">{{ streamRef.description }}</small></v-toolbar-title>
                                <v-spacer></v-spacer>
                                <template v-slot:append>
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-btn icon v-bind="props"
                                                :to="{ name: 'postMessage', params: { streamId: streamRef.streamId, threadId: 0 } }">
                                                <v-icon color="grey-lighten-1">
                                                    mdi-pen-plus
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>New post</span>
                                    </v-tooltip>
                                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
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
            <v-row style="min-height:300px;">
                <v-col>
                    <v-table density="compact">
                        <thead>
                            <tr>
                                <th class="text-center">
                                    ID
                                </th>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-center">
                                    User
                                </th>
                                <th class="text-center">
                                    Reply
                                </th>
                                <th class="text-center">
                                    Views
                                </th>
                                <th class="text-center">
                                    Created
                                </th>
                                <th class="text-center">
                                    Last Modified
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in threadsRef" :key="item.threadId">
                                <td class="text-center">{{ item.threadId }}</td>
                                <td>
                                    <div class="d-flex align-center ma-1">
                                        <v-sheet v-if="item.coverImgSrc != null">
                                            <v-img :width="80" :height="80" aspect-ratio="1/1" cover
                                                :src="photos.getImageUrl(item.coverImgSrc, { thumbnail: true, width: 300, height: 300 })"
                                                class="mr-5">
                                                <template v-slot:placeholder>
                                                    <div class="d-flex align-center justify-center fill-height">
                                                        <v-progress-circular color="grey-lighten-4"
                                                            indeterminate></v-progress-circular>
                                                    </div>
                                                </template>
                                            </v-img>
                                        </v-sheet>
                                        <v-sheet>
                                            <router-link :to="`/streams/${item.objectId}/threads/${item.threadId}`">{{
                                                item.rootMessage.subject }}</router-link>
                                            <v-badge :content="item.embedMediaCount" v-if="item.embedMediaCount > 0"
                                                color="primary">
                                                <v-icon icon="mdi-multimedia"></v-icon>
                                            </v-badge>
                                            <v-badge :content="item.rootMessage.attachmentsCount"
                                                v-if="item.rootMessage.attachmentsCount > 0" color="primary">
                                                <v-icon icon="mdi-paperclip"></v-icon>
                                            </v-badge>
                                        </v-sheet>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <v-avatar size="24">
                                        <v-img :src="user.getAvatarUrlByUsername(item.rootMessage.user.username)"
                                            alt="{{ item.rootMessage.user.name}}"></v-img>
                                    </v-avatar>
                                </td>
                                <td class="text-center">{{ item.rootMessage.replyCount }}</td>
                                <td class="text-center">{{ item.viewCount }}</td>
                                <td class="text-center text-body-2">{{ dayjs(item.creationDate).format('YYYY-MM-DD HH:MM')
                                }}</td>
                                <td class="text-center text-body-2">{{ dayjs(item.modifiedDate).format('YYYY-MM-DD HH:MM')
                                }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-pagination v-model="page" :length="threads.pageCount" :total-visible="10" rounded="circle"
                        theme="light"></v-pagination>
                </v-col>
            </v-row>
        </v-container>
        <v-overlay :model-value="loadingRef" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-main>
</template>
<script setup lang="ts">
// Utilities
import {
    onMounted, ref, watch,
} from 'vue'

// Components

// Store
import { useStreamsStore } from '@/store/streams.store'
import { useThreadsStore } from '@/store/threads.store'
import { useUserStore } from '@/store/user.store'
import { usePhotosStore } from '@/store/photos.store'

// Fix for dayjs - cannot call a namespace error..
import * as _dayjs from 'dayjs'
const dayjs = _dayjs

const props = defineProps({
    id: String,
})

const loadingRef = ref(false)
const streamRef = ref({ streamId: 0, displayName: '' })
const streams = useStreamsStore()
const threads = useThreadsStore().init(parseInt(props.id || '0'))
const photos = usePhotosStore()
const user = useUserStore()

// value for pagination
const page = ref(1)

const threadsRef = ref([])

watch(() => props.id, (newVal, oldVal) => {
    loadThreads()
})

watch(page, async (newVal, oldVal) => {
    page.value = newVal
    threads.setPage(page.value)
    loadingRef.value = true
    await threads.fetch()
    loadingRef.value = false
    threadsRef.value = threads.threads
})

async function loadThreads () {
    const streamId = parseInt(props.id || '0')
    if (streams.isLoaded) { streamRef.value = streams.getById(streamId) } else { streamRef.value = await streams.getStreamById(streamId) }
    if (threads.streamId !== streamId || !threads.isLoaded) {
        threads.init(streamId)
        threads.setPage(page.value)
        loadingRef.value = true
        await threads.fetch()
        loadingRef.value = false
    }
    threadsRef.value = threads.threads
}

onMounted(async () => {
    loadThreads()
})

function hasHistory () { return window.history.length > 2 }
</script>
