<template>
    <v-dialog :scrim="false" transition="dialog-bottom-transition" width="1024" persistent>
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Upload</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon dark @click="closeUploadDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar-items>
                <template v-slot:extension>
                    <v-tabs v-model="tab" centered>
                        <v-tab :value="1">File</v-tab>
                        <v-tab :value="2">URL</v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            <v-window v-model="tab">
                <v-window-item :value="1" class="mx-10">
                    <v-card>
                        <v-card-text>
                            <v-container>
                                <v-row no-gutters>
                                    <v-col cols="12" sm="8" md="6">
                                        <file-pond name="myFiles" ref="pond" v-bind:files="myFiles"
                                            label-idle="Drop Images here..." v-bind:allow-multiple="false"
                                            accepted-file-types="image/jpeg, image/png" v-bind:server="pondServerSettings"
                                            v-on:init="handleFilePondInit" v-on:processfile="handleFilePondProcess" />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-window-item>
                <v-window-item :value="2" class="mx-10">
                    <v-card>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col sm="5" md="3">
                                        <v-img class="mx-auto" height="300" :src="previewImageUrl"
                                            @load="previewImageLoaded">
                                            <template v-slot:placeholder>
                                                <div class="d-flex align-center justify-center fill-height">
                                                    <v-progress-circular color="grey-lighten-4"
                                                        indeterminate></v-progress-circular>
                                                </div>
                                            </template>
                                        </v-img>
                                    </v-col>
                                    <v-col>
                                        <v-row no-gutters>
                                            <v-col>
                                                <v-text-field clearable label="URL"
                                                    hint="Enter URL where upload image exist."
                                                    v-model.lazy="uploadDialog.photo.imageUrl"
                                                    @focusout="previewImage"></v-text-field></v-col>
                                        </v-row>
                                        <v-row no-gutters>
                                            <v-col>
                                                <v-textarea label="Description" v-model="uploadDialog.photo.description"
                                                    hint="Tell me about this photo."></v-textarea></v-col>
                                        </v-row>
                                        <v-divider class="py-5"></v-divider>
                                        <v-row no-gutters>
                                            <v-col>
                                                <v-switch label="Share for everyone." v-model="uploadDialog.photo.share"
                                                    color="red-darken-3" hide-details></v-switch>
                                                <v-switch label="Publish as wallpaper."
                                                    v-model="uploadDialog.photo.wallpaper" color="red-darken-3"
                                                    hide-details></v-switch>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-btn variant="tonal" @click="previewImage" class="mr-5">
                                                    Preview
                                                </v-btn>
                                                <v-btn variant="tonal" @click="uploadImageByUrl"
                                                    prepend-icon="mdi-cloud-upload" v-if="uploadDialog.uploadable"
                                                    :loading="uploadDialog.uploading" :disabled="uploadDialog.uploading">
                                                    Upload
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-window-item>
            </v-window>
            <!-- <v-spacer></v-spacer>
                                <v-card-actions>
                                    <v-btn variant="text">
                                        Back
                                    </v-btn>
                                </v-card-actions> -->
        </v-card>
</v-dialog>
</template>
<script setup lang="ts">
// Utilities
import {
    reactive, ref,
} from 'vue'

// Image
import noImageUrl from '@/assets/img/no-image.jpg' // => or relative path

// store
import { usePhotosStore } from '@/store/photos.store'

// FilePond Install --------------------------
import vueFilePond from 'vue-filepond'

// Import the plugin styles
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

// Import the FilePond plugin code
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
const photos = usePhotosStore()

const emit = defineEmits(['hideEvent', 'uploadedEvent'])

const tab = ref(null)
const previewImageUrl = ref(noImageUrl)
const uploadDialog = reactive({
    uploadable: false,
    uploading: false,
    photo: {
        objectType: 0,
        objectId: 0,
        imageId: 0,
        imageUrl: null,
        description: null,
        share: false,
        wallpaper: false,
    },
})

function closeUploadDialog () {
    reset()
    emit('hideEvent')
}

function reset () {
    uploadDialog.photo.imageUrl = null
    uploadDialog.photo.description = null
    uploadDialog.photo.share = false
    uploadDialog.photo.wallpaper = false
    uploadDialog.uploadable = false
    uploadDialog.uploading = false
    previewImageUrl.value = noImageUrl
}

async function previewImage () {
    uploadDialog.uploadable = false
    if (await photos.isImgUrl(uploadDialog.photo.imageUrl)) {
        previewImageUrl.value = uploadDialog.photo.imageUrl
    }
}

function previewImageLoaded () {
    if (uploadDialog.photo.imageUrl != null) {
        uploadDialog.uploadable = true
    }
}

async function uploadImageByUrl () {
    uploadDialog.uploading = true
    await photos.uploadByUrl(uploadDialog.photo)
    uploadDialog.uploading = false
    reset()
}

// Create FilePond FilePond
const FilePond = vueFilePond(
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
)

const pondServerSettings = photos.getFilePondServerSettings()
const myFiles = ref([])
function handleFilePondInit () {
    // FilePond instance methods are available on `this.$refs.pond`
    /* eslint-disable */
    console.log("FilePond has initialized");
}
function handleFilePondProcess() {
    console.log("FilePond processed.");
    // this.refresh();
    myFiles.value = [];
    emit('uploadedEvent')
}



</script>