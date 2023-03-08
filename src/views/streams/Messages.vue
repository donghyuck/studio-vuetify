<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-menu open-on-hover>
                        <template v-slot:activator="{ props }">
                            <v-toolbar color="rgba(0, 0, 0, 0)">
                                <v-btn icon @click="hasHistory() ? $router.go(-1) : $router.push('/')">
                                    <v-icon>mdi-arrow-left</v-icon>
                                </v-btn>
                                <!-- <v-toolbar-title>{{ streamRef.displayName }}</v-toolbar-title> -->
                                <v-card class="border-0" color="transparent" flat :theme="light">
                                    <v-card-title class="text-h6 text-md-h5 text-lg-h4">{{
                                        threadRef.rootMessage.subject
                                    }}</v-card-title>
                                    <v-card-text>
                                        {{ streamRef.displayName }}
                                    </v-card-text>
                                </v-card>
                                <v-spacer></v-spacer>
                                <template v-slot:append> 
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props }" >
                                            <v-btn icon v-bind="props" @click="onShow(0)" v-if="imgsRef.length > 0">
                                                <v-icon color="grey-lighten-1">
                                                    mdi-play-box-multiple-outline
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Play slideshow.</span>
                                    </v-tooltip>
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-btn icon v-bind="props" :to="{ name: 'postMessage', params: { streamId: streamRef.streamId, threadId: threadRef.threadId } }">
                                                <v-icon color="grey-lighten-1">
                                                    mdi-square-edit-outline
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Edit this post.</span>
                                    </v-tooltip>
                                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                                </template>
                            </v-toolbar>
                        </template>
                        <v-list :lines="false" density="compact" nav class="pa-0">
                            <v-list-item prepend-icon="mdi-square-edit-outline" title="Edit" value="home" color="primary"
                            :to="{ name: 'postMessage', params: { streamId: streamRef.streamId, threadId: threadRef.threadId } }"></v-list-item>
                            <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="threadRef.threadId > 0">
                    <v-card flat class="post">
                        <template v-slot:prepend>
                            <v-avatar color="grey-darken-3" size="32"
                                :image="user.getAvatarUrlByUsername(threadRef.rootMessage.user.username)"
                                :alt="threadRef.rootMessage.user.name"></v-avatar>
                        </template>
                        <template v-slot:title>
                            <v-card-title class="text-subtitle-2">Post by {{ threadRef.rootMessage.user.name
                            }}</v-card-title>
                            <v-card-subtitle>
                                Last updated {{ dayjs(threadRef.modifiedDate).format() }}
                            </v-card-subtitle>
                        </template>
                        <v-card-text>
                            <v-row>
                                <v-col class="d-flex justify-start pa-0">
                                    <v-chip class="ma-2"> Default </v-chip>
                                    <v-chip class="ma-2" color="primary"> Primary </v-chip>
                                    <v-chip class="ma-2" color="secondary"> Secondary </v-chip>
                                    <v-chip class="ma-2" color="red" text-color="white">
                                        Red Chip
                                    </v-chip>
                                    <v-chip class="ma-2" color="green" text-color="white">
                                        Green Chip
                                    </v-chip>
                                </v-col>
                                <v-col class="d-flex justify-end pa-3">
                                    <span class="text-grey-lighten-2 text-caption me-2">
                                        ({{ rating }})
                                    </span>
                                    <v-rating :model-value="rating" color="amber" density="compact" half-increments readonly
                                        size="small"></v-rating>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text class="post-message-body">
                            <article v-html="toHtml(threadRef.rootMessage.body)"></article>
                        </v-card-text>
                        <v-divider inset></v-divider>
                        <v-list lines="two" v-if="threadRef.rootMessage.attachmentsCount > 0">
                            <v-list-subheader inset>Attachments</v-list-subheader>
                            <template v-for="item in attachmentsRef" :key="item.attachmentId">
                                <v-list-item class="pa-0">
                                   <AttachmentCard :attachment="item" @previewEvent="previewMedia" />
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <MediaPreviewDialog v-model="dialog" :media="previewAttachmentRef" @close-event="dialog = false" />
        <v-overlay :model-value="loadingRef" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <vue-easy-lightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" @hide="onHide">
        </vue-easy-lightbox>
    </v-main>
</template>
<script setup lang="ts">
// Utilities
import { onMounted, ref } from 'vue'

import VueEasyLightbox from 'vue-easy-lightbox'

// Components
import AttachmentCard from '@/components/AttachmentCard.vue'
import MediaPreviewDialog from '@/components/MediaPreviewDialog.vue'

// Store
import { useStreamsStore } from '@/store/streams.store'
import { useThreadsStore } from '@/store/threads.store'
import { useUserStore } from '@/store/user.store'
import { useAttachmentsStore } from '@/store/attachments.store'

import * as _dayjs from 'dayjs'
const dayjs = _dayjs

const props = defineProps({
    streamId: String,
    threadId: String,
})

const loadingRef = ref(false)

const streams = useStreamsStore()
const threads = useThreadsStore().init(parseInt(props.streamId || '0'))
const user = useUserStore()

const streamRef = ref({ streamId: 0, displayName: '' })
const threadRef = ref({ threadId: 0, rootMessage: { user: {}, messageId: 0, subject: '' } })

const rating = ref(4.3)

// lightbox
const visibleRef = ref(false)
const indexRef = ref(0)
const imgsRef = ref([])
const onHide = () => (visibleRef.value = false)

onMounted(async () => {
    loadingRef.value = true
    const streamId = parseInt(props.streamId || '0')
    const threadId = parseInt(props.threadId || '0')
    if (streams.isLoaded) {
        streamRef.value = streams.getById(streamId)
    } else {
        streamRef.value = await streams.getStreamById(streamId)
    }
    threadRef.value = await threads.getThreadById(threadId)
    getAttachments(22, threadRef.value.rootMessage.messageId)
    loadingRef.value = false
})

function toHtml (body : string) {
    const el = new DOMParser().parseFromString(body, 'text/html')
    el.querySelectorAll('img').forEach( (value , index:number ) => { 
       let imgSrc:string = value.getAttribute('src') || ''
       if (imgSrc != null && !imgSrc.startsWith('http')) {
        imgSrc = `${import.meta.env.VITE_API_URL}${imgSrc}`
        value.setAttribute('src', imgSrc) 
        value.setAttribute('data-index', index.toString() ) 
        imgsRef.value.push( imgSrc ) 
       }
    })
    el.querySelectorAll('a').forEach( (value , index:number ) => {  
       if( value.getAttribute('target') == null ){
        value.setAttribute('target', "_blank")   
       }
    })
    return el.documentElement.innerHTML
}

function onShow (index:number ) {
    visibleRef.value = true
    indexRef.value = index
    console.log( visibleRef , indexRef )
}

function hasHistory () {
    return window.history.length > 2
}

const attachmentsRef = ref([])
const attachments = useAttachmentsStore()
async function getAttachments (objectType: number, objectId: number) {
    attachments.init(objectType, objectId)
    await attachments.fetch()
    attachmentsRef.value = attachments.attachments
}

/**
 * Preview Media. ( mp3, mp4 )
 */
const previewAttachmentRef = ref({})
const dialog = ref(false)
function previewMedia (attachment:Object) {
    previewAttachmentRef.value = attachment
    dialog.value = true
}

</script>
<style>
.post-message-body figure.image {
    text-align: center;
    margin-top: 1em;
    margin-bottom: 1em;
}

.post-message-body figure.media {
    text-align: center;
    margin-top: 1em;
    margin-bottom: 1em;
}

.post-message-body figure.image>img {
    max-width: 100%;
    height: auto;
}
</style>
