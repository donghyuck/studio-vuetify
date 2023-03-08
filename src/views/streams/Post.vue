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
                                        <template v-slot:activator="{ props }">
                                            <v-btn icon v-bind="props" @click="hideRightPane = !hideRightPane">
                                                <v-icon color="grey-lighten-1">
                                                    mdi-file-cog
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Attributes</span>
                                    </v-tooltip>
                                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                                </template>
                            </v-toolbar>
                        </template>
                        <v-list :lines="false" density="compact" nav class="pa-1">
                            <v-list-item prepend-icon="mdi-file-cog" value="setting" @click="hideRightPane = !hideRightPane">
                                <v-list-item-title>Setting</v-list-item-title>
                            </v-list-item>
                            <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <splitpanes>
                        <pane class="split-pane">
                            <v-card flat class="post mx-auto overflow-visible">
                                <v-card-title>
                                    <v-text-field clearable label="Subject" v-model="threadRef.rootMessage.subject"
                                        hint="Enter Subject." variant="underlined"></v-text-field>
                                </v-card-title>
                                <v-card-text>
                                    <ckeditor :editor="editor" v-model="threadRef.rootMessage.body" :config="editorConfig">
                                    </ckeditor>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                    <v-btn @click="hasHistory() ? $router.go(-1) : $router.push('/')" variant="text" >Close</v-btn>
                                    <v-btn color="primary" prepend-icon="mdi-content-save" variant="text" @click="saveOrUpdate">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </pane>
                        <pane size="30" max-size="50" min-size="20" class="split-pane" v-if="!hideRightPane">
                            <v-expansion-panels variant="accordion" density="compact">
                                <v-expansion-panel>
                                    <v-expansion-panel-title>Security</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <v-switch label="Private" color="indigo" value="indigo" hide-details
                                            inset></v-switch>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                    <v-expansion-panel-title>Content</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        Some content
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" @click="hideRightPane = true">
                                    Cancel
                                </v-btn>
                                <v-btn variant="text"  prepend-icon="mdi-content-save" color="primary" @click="saveOrUpdate">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </pane>
                    </splitpanes>

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
import { onMounted, ref } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ImageUploadAdapterPlugin } from '@/plugins/ImageUploadAdapter'
import router from '@/router'

import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

// Store
import { useStreamsStore } from '@/store/streams.store'
import { useThreadsStore } from '@/store/threads.store'

const props = defineProps({
    streamId: String,
    threadId: String,
})

const editor = ClassicEditor
const ckeditor = CKEditor.component

const streams = useStreamsStore()
const threads = useThreadsStore().init(parseInt(props.streamId || '0'))
const loadingRef = ref(false)

const streamRef = ref({ streamId: 0, displayName: '' })
const threadRef = ref({ threadId: 0, rootMessage: { objectType: 20, objectId: 0, threadId: 0, messageId: 0, subject: '', body: '' } })
const editorConfig = ref({
    // The configuration of the editor.
    height: '600px',
    mediaEmbed: {
        previewsInData: true,
        extraProviders: [
            {
                name: 'extraProvider',
                url: /^andang\.duckdns\.org\/downlaod\/files\/(\w+)/,
                html: `The HTML representing the media with ID=${[1]}.`,
            },
        ],
    },
    extraPlugins: [ImageUploadAdapterPlugin],
    placeholder: 'Type or paste your content here.',
})

// splitpanes
const hideRightPane = ref(true)

onMounted(async () => {
    loadingRef.value = true
    const streamId = parseInt(props.streamId || '0')
    const threadId = parseInt(props.threadId || '0')
    if (streams.isLoaded) {
        streamRef.value = streams.getById(streamId)
    } else {
        streamRef.value = await streams.getStreamById(streamId)
    }
    if (threadId > 0) { threadRef.value = await threads.getThreadById(threadId) } else { threadRef.value.rootMessage.objectId = streamRef.value.streamId }
    loadingRef.value = false
})

/**
 * Save or Update Message
 */

async function saveOrUpdate () {
    loadingRef.value = true
    const data = await threads.saveOrUpdate(threadRef.value.rootMessage)
    loadingRef.value = false
    router.replace({
        name: 'threadById',
        params: { streamId: data.objectId, threadId: data.threadId },
    })
}

function hasHistory () {
    return window.history.length > 2
}
</script>
<style>
.post .ck-content {
    min-height: 500px;
}

.v-table .v-text-field .v-input__details {
    display: none;
}

.v-table .v-text-field .v-input__control {
    margin-top: 2px;
    margin-bottom: 2px;
}
</style>
