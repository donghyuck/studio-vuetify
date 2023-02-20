<script setup lang="ts">
// Components
import AppBarThemeToggle from './ThemeToggle.vue'
import AppBarUserProfileMenu from './UserProfileMenu.vue'

// Store
import { useAuthStore } from '@/store/auth.store'

// Utilities
// import { computed } from 'vue'

// Globals
const auth = useAuthStore()

interface MenuItem {
  name: string,
  path: string,
  authenticationRequired: boolean,
}
const links: MenuItem[] = [
  { name: 'Today', path: '/today', authenticationRequired: true },
  { name: 'Me Photos', path: '/me/photos', authenticationRequired: true },
  { name: 'Me Drive', path: '/me/drive', authenticationRequired: true },
]
const items = [
  { title: 'Click Me' },
  { title: 'Click Me' },
]
</script>
<template>
  <v-app-bar class="px-3" color="rgba(0,0,0, .1)" flat density="compact">
    <v-btn variant="text" to="/"><v-avatar color="grey-darken-1" size="32" /></v-btn>
    <v-spacer />
    <v-tabs centered color="primary">
      <template v-for="item in links" :key="item.name">
        <v-tab v-if="!item.authenticationRequired || auth.isLoggedIn" :to="item.path">
          {{ item.name }}
        </v-tab>
      </template>
      <v-menu open-on-hover>
        <template #activator="{ props }">
          <v-btn variant="plain" rounded="0" class="align-self-center me-4" height="100%" v-bind="props">
            Board <v-icon end icon="mdi-chevron-down" size="x-small" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>
    <v-divider vertical />
    <app-bar-theme-toggle />
    <v-divider vertical class="mr-2" />
    <app-bar-user-profile-menu v-if="auth.isLoggedIn" />
    <v-btn v-else variant="plain" to="/accounts/login"><span class="mdi mdi-fingerprint" /> Login </v-btn>
  </v-app-bar>
</template>
