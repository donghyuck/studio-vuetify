<template>
  <v-menu min-width="200px" rounded :close-on-content-click="false">
    <template #activator="{ props }">
      <div v-bind="props">
        <v-avatar color="grey-darken-1" size="32" :image="user.getAvatarUrl()" />
        <v-icon end icon="mdi-chevron-down" size="x-small" />
      </div>
    </template>
    <v-card min-width="200">
      <v-list>
        <v-list-item :title="auth.user.user.name" :subtitle="auth.user.user.email">
          <template v-slot:append>
            <v-btn variant="text" icon="mdi-menu-down" @click="fav = !fav" size="small"></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list :lines="false" density="compact" nav>
        <v-list-item>
          <v-btn block prepend-icon="mdi-account-circle" variant="text" rounded="xl" size="small"
            class="justify-start font-weight-light">
            Edit Profile
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block prepend-icon="mdi-logout-variant" variant="text" rounded="xl" size="small"
            class="justify-start font-weight-light" @click="auth.logout()">
            Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script setup>
// Store
import { useAuthStore } from '@/store/auth.store'
import { useUserStore } from '@/store/user.store'

// Utilities

// Globals
const auth = useAuthStore()
const user = useUserStore()
</script>
