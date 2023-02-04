<script setup>
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/store/alert.store'
const alertStore = useAlertStore()
const { alert } = storeToRefs(alertStore)
</script>
<template>
    <v-alert v-if="alert"
      density="comfortable"
      :type="alert.type"
      variant="tonal"
      flat>
      {{ alert.message }}
    </v-alert>
</template>
