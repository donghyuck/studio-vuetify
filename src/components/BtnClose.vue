<template>
<v-btn class="btn-close" size="large" icon variant="plain">
    <v-icon icon="mdi-close"></v-icon>
</v-btn>
</template>
<script lang="ts">
export default {
    props: ['close'],
}
</script>
<style>
.btn-close {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 1000;
}
</style>
