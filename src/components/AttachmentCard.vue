<template>
    <v-hover>
        <template v-slot:default="{ isHovering, props }">
            <v-card v-bind="props">
                <v-list-item class="w-100">
                    <template v-slot:prepend>
                        <v-img width="64" height="64" cover class="mr-3" :src="thumbnailUrl">
                            <template v-slot:placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                </div>
                            </template>
                            <div v-if="isHovering && attachments.isAvailableForPreview(attachment)"
                                class="align-self-center mt-2">
                                <v-btn class="ms-2" icon="mdi-play" variant="text" color="#F50057"
                                    @click="emit('previewEvent', attachment)"></v-btn>
                            </div>
                        </v-img>
                    </template>
                    <v-list-item-title>{{ attachment.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ attachment.size }} bytes </v-list-item-subtitle>
                    <template v-slot:append>
                        <div class="justify-self-end">
                            <v-icon class="me-1" icon="mdi-heart"></v-icon>
                            <span class="subheading me-2">{{ attachment.downloadCount }}</span>
                            <span class="me-1">·</span>
                            <v-btn color=" grey-lighten-1" icon="mdi-download" variant="text"
                                :href="attachments.getAttachmentUrl(attachment)" target="_blank"></v-btn>
                        </div>
                    </template>
                </v-list-item>
            </v-card>
        </template>
    </v-hover>
</template>
<script setup lang="ts">
// Utilities 
import { computed, } from 'vue'
// Store
import { useAttachmentsStore } from '@/store/attachments.store'
const attachments = useAttachmentsStore()
const props = defineProps({ attachment: Object })
const emit = defineEmits(['previewEvent'])
const thumbnailUrl = computed(() => {
    return attachments.isAudio(props.attachment) ? attachments.thumbnails.AUDIO : attachments.getAttachmentUrl(props.attachment, { thumbnail: true, width: 300, height: 300 });
})
</script>
