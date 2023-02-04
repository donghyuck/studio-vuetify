<template>
  <v-btn :icon="icon" color="medium-emphasis" path="theme" @click="onClick" />
</template>
<script setup>
// Composables
// import { useRoute } from 'vue-router'
import { usePrefsStore } from '@/store/prefs.store'

// Utilities
import { computed } from 'vue'

const prefs = usePrefsStore()

// const { name } = useRoute()

const icon = computed(() => prefs.theme === 'dark'
    ? 'mdi-weather-night'
    : 'mdi-weather-sunny'
)

function onClick () {
  prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark'
}
</script>
