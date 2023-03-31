<template>
  <v-app-bar class="px-3" color="rgba(0,0,0, .3)" flat density="compact" theme="dark">
    <v-btn variant="text" to="/"><v-avatar color="grey-darken-1" size="32" /></v-btn>
    <v-spacer />
    <template v-for="item in linksRef" :key="item.title">
      <v-btn v-if="!item.authenticationRequired || auth.isLoggedIn" :to="item.path" rounded="0"
        class="text-body-2 text-capitalize px-3" color="medium-emphasis" :text="item.title" variant="text" />
    </template>
    <v-menu open-on-hover>
      <template #activator="{ props }">
        <v-btn variant="text" rounded="0" class="text-body-2 text-capitalize px-3 align-self-center me-4"
          color="medium-emphasis" height="100%" v-bind="props" :disabled="!isLoaded" :loading="!isLoaded">
          Community <v-icon end icon="mdi-chevron-down" size="x-small" />
        </v-btn>
      </template>
      <v-list density="compact">
        <templage v-for="(item, index) in streamsRef" :key="index">
          <v-list-item :to="{ name: 'streamById', params: { id: item.streamId } }" v-if="(isAllowed(item))">
            <v-list-item-title class="text-body-2"><span v-if="isAdultOnly(item)" class="label-adult">18+</span>{{
              item.displayName }}</v-list-item-title>
          </v-list-item>
        </templage>
      </v-list>
    </v-menu>
    <v-divider vertical />
    <theme-toggle />
    <v-divider vertical class="mr-2" />
    <user-profile-menu v-if="auth.isLoggedIn" />
    <v-btn v-else variant="plain" to="/accounts/login"><span class="mdi mdi-fingerprint" /> Login </v-btn>
  </v-app-bar>
</template>
<style>
.label-adult {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  -webkit-tap-highlight-color: transparent;
  color: inherit;
  font-size: 8pt;
  line-height: 1.55;
  text-decoration: none;
  font-weight: bold;
  white-space: nowrap;
  border-right: 1px solid rgba(0, 0, 0, 0.15);
  background: rgba(201, 42, 42, 0.4);
  padding-left: 2px;
  padding-right: 3px;
  margin-right: 5px;
}
</style>
<script setup lang="ts">
// Components
import ThemeToggle from './ThemeToggle.vue'
import UserProfileMenu from './UserProfileMenu.vue'

// Store
import { useAuthStore } from '@/store/auth.store'
import { useStreamsStore } from '@/store/streams.store'
// Utilities
import { onMounted, ref } from 'vue'
import { isAdultOnly } from '@/util/helpers'

// Globals
const auth = useAuthStore()
const streams = useStreamsStore()

interface MenuItem {
  name: string,
  title: string,
  path: string,
  authenticationRequired: boolean,
}

const linksRef: MenuItem[] = [
  { name: 'today', title: 'Today', path: '/today', authenticationRequired: true },
  { name: 'photos', title: 'Me Photos', path: '/me/photos', authenticationRequired: true },
  { name: 'drive', title: 'Me Drive', path: '/me/drive', authenticationRequired: true },
]

const streamsRef = ref([])
const isLoaded = ref(false)
onMounted(async () => {
  if (!streams.isLoaded) {
    await streams.fetch()
  }
  streamsRef.value = streams.streams
  isLoaded.value = true
})

function isAllowed (item:any) {
  const adultOnly = isAdultOnly(item)
  if (adultOnly && !auth.isLoggedIn) { return false }
  return true
}

</script>
