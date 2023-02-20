<template>
    <v-navigation-drawer :rail="rail" permanent @click="rail = false" location="left">
        <v-list-subheader class="ma-5">
            <v-btn prepend-icon="mdi-cloud-upload" variant="outlined" color="primary" block>
                Upload New Photo
            </v-btn>
        </v-list-subheader>
        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-newspaper" title="Home" value="home"></v-list-item>
            <v-list-item prepend-icon="mdi-folder-image" title="My Account" value="account"></v-list-item>
            <v-list-item prepend-icon="mdi-folder-multiple-image" title="Shared Photos" value="users"></v-list-item>
            <v-list-item prepend-icon="mdi-sale" title="Sale" value="users"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-layout>

    </v-layout>
</template>
<script setup lang="ts">
// Utilities
import {
    ref,
} from 'vue'
const rail = ref(false)
</script>
