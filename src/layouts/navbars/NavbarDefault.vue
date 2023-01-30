<script setup lang="ts">
// Utilities
import { computed } from 'vue'
const links = computed(() => ([
  'Dashboard',
  'Messages',
  'Profile',
  'Updates',
]))
</script>
<template>
  <v-app-bar class="px-3" color="rgba(0,0,0, .1)" flat density="compact">
    <v-avatar color="grey-darken-1" size="32"></v-avatar>
    <v-spacer></v-spacer>
    <v-tabs centered color="grey-darken-2">
      <v-tab v-for="link in links" :key="link">
        {{ link }}
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <v-avatar class="hidden-sm-and-down" color="grey-darken-1" size="32"></v-avatar>
  </v-app-bar>
</template>
