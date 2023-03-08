<template>
    <v-dialog width="auto" transition="dialog-bottom-transition" location="bottom">
        <v-responsive min-width="300" min-height="250">
        <v-card class="w-100 h-100" theme="dark">
            <BtnClose @click="emit('closeEvent')" />
            <v-card-title>{{ media.name }}</v-card-title>
            <v-card-text v-if="isVideo||isAudio">
                <video-player :src="mediaSource" :poster="mediaPosterUrl" :autoplay="true" controls :loop="false"
:audioOnlyMode="isAudio"
                    :volume="6" />
            </v-card-text>
            <v-card-actions>
            </v-card-actions>
        </v-card>
        </v-responsive>
    </v-dialog>
</template>
<script setup lang="ts">
// Utilities
import { computed } from 'vue'

// Store
import { useAttachmentsStore } from '@/store/attachments.store'

// Components
import BtnClose from './BtnClose.vue'
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

const attachments = useAttachmentsStore()
const props = defineProps({ media: {} })
const emit = defineEmits(['closeEvent'])

const isVideo = computed(() => {
    return attachments.isVideo(props.media)
})
const isAudio = computed(() => {
    return attachments.isAudio(props.media)
})
const mediaPosterUrl = computed(() => {
    if (attachments.getExtenstion(props.media.name) === '.hwp') { return attachments.thumbnails.HWP }
    return attachments.isAudio(props.media) ? attachments.thumbnails.AUDIO : attachments.getAttachmentUrl(props.media, { thumbnail: true, width: 300, height: 300 })
})

const mediaSource = computed(() => { return attachments.getAttachmentUrl(props.media) })

</script>
