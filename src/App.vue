<template>
    <router-view />
</template>
<script setup lang="ts">
/*
=========================================================
* Studio Client - v1.0.0
=========================================================
*/
import { RouterView } from "vue-router";
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
