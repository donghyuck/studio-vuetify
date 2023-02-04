<template>
  <v-app>
    <router-view name="header" />
    <router-view />
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

// Utilities
import { ref, watch, watchEffect } from 'vue'
import { getMatchMedia, IN_BROWSER } from '@/util/helpers'

// Globals
const prefs = usePrefsStore()
const theme = useTheme()

const systemTheme = ref('light')

if (IN_BROWSER) {
  const fn = function onThemeChange () {
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

  // watch(theme.global.name, themeTransition)

  // function themeTransition() {
  //   const x = performance.now()
  //   for (let i = 0; i++ < 1e7; i << 9 & 9 % 9 * 9 + 9);
  //   if (performance.now() - x > 10) return
  //   const el: HTMLElement = document.querySelector('[data-v-app]')!
  //   const children = el.querySelectorAll('*') as NodeListOf<HTMLElement>
  //   children.forEach(el => {
  //     if (hasScrollbar(el)) {
  //       el.dataset.scrollX = String(el.scrollLeft)
  //       el.dataset.scrollY = String(el.scrollTop)
  //     }
  //   })
  //   const copy = el.cloneNode(true) as HTMLElement
  //   copy.classList.add('app-copy')
  //   const rect = el.getBoundingClientRect()
  //   copy.style.top = rect.top + 'px'
  //   copy.style.left = rect.left + 'px'
  //   copy.style.width = rect.width + 'px'
  //   copy.style.height = rect.height + 'px'
  //   const targetEl = document.activeElement as HTMLElement
  //   const targetRect = targetEl.getBoundingClientRect()
  //   const left = targetRect.left + targetRect.width / 2 + window.scrollX
  //   const top = targetRect.top + targetRect.height / 2 + window.scrollY
  //   el.style.setProperty('--clip-pos', `${left}px ${top}px`)
  //   el.style.removeProperty('--clip-size')
  //   nextTick(() => {
  //     el.classList.add('app-transition')
  //     requestAnimationFrame(() => {
  //       requestAnimationFrame(() => {
  //         el.style.setProperty('--clip-size', Math.hypot(window.innerWidth, window.innerHeight) + 'px')
  //       })
  //     })
  //   })
  //   document.body.append(copy)
  //     ; (copy.querySelectorAll('[data-scroll-x], [data-scroll-y]') as NodeListOf<HTMLElement>).forEach(el => {
  //       el.scrollLeft = +el.dataset.scrollX!
  //       el.scrollTop = +el.dataset.scrollY!
  //     })
  //   function onTransitionend(e: TransitionEvent) {
  //     if (e.target === e.currentTarget) {
  //       copy.remove()
  //       el.removeEventListener('transitionend', onTransitionend)
  //       el.removeEventListener('transitioncancel', onTransitionend)
  //       el.classList.remove('app-transition')
  //       el.style.removeProperty('--clip-size')
  //       el.style.removeProperty('--clip-pos')
  //     }
  //   }
  //   el.addEventListener('transitionend', onTransitionend)
  //   el.addEventListener('transitioncancel', onTransitionend)
  // }
  // function hasScrollbar(el?: Element | null) {
  //   if (!el || el.nodeType !== Node.ELEMENT_NODE) return false
  //   const style = window.getComputedStyle(el)
  //   return style.overflowY === 'scroll' || (style.overflowY === 'auto' && el.scrollHeight > el.clientHeight)
  // }
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
