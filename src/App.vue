<template>
  <v-app>
    <router-view name="header" />
    <router-view />
    <back-to-top></back-to-top>
    <router-view name="footer" />
  </v-app>
</template>
<script setup lang="ts">
/*
=========================================================
* Studio Client - v1.0.0
=========================================================
*/
import { RouterView } from 'vue-router'
import { usePrefsStore } from '@/store/prefs.store'
import { useTheme } from 'vuetify'
import BackToTop from '@/components/BackToTop.vue'

// Utilities
import { ref, watch, watchEffect } from 'vue'
import { getMatchMedia, IN_BROWSER } from '@/util/helpers'

// Globals
const prefs = usePrefsStore()
const theme = useTheme()

const systemTheme = ref('light')

if (IN_BROWSER) {
  const fn = function onThemeChange() {
    systemTheme.value = media!.matches ? 'dark' : 'light'
  }

  let media: MediaQueryList
  watch(() => prefs.theme, val => {
    if (val === 'system') {
      media = getMatchMedia()!
      media.addListener(fn)
      fn()
    } else if (media) {
      media.removeListener(fn)
    }
  }, { immediate: true })

  watchEffect(() => {
    theme.global.name.value = (
      prefs.theme === 'system' ? systemTheme.value : prefs.theme
    )
  })
}
</script>
<style lang="sass">
  a:not(:hover)
    text-decoration: none
  p
    margin-bottom: 1rem
    a, a:visited
      color: rgb(var(--v-theme-primary))
  h1
    + p
      font-size: 1.25rem
      font-weight: 300
  ul:not([class]),
  ol:not([class])
    padding-left: 20px
    margin-bottom: 16px
</style>

<style lang="sass" scoped>
  .pwa-loader
    position: fixed
    top: 0
    left: 0
    right: 0
    z-index: 1010
</style>
