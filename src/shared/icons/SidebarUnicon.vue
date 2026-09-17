<script setup lang="ts">
import { addCollection, Icon } from '@iconify/vue'
import uilIcons from '@iconify-json/uil/icons.json'

addCollection(uilIcons)

defineProps<{
  name: string
}>()
</script>

<template>
  <Icon class="sidebar-unicon" :icon="`uil:${name}`" aria-hidden="true" />
</template>

<style scoped>
.sidebar-unicon {
  display: block;
  width: 1em;
  height: 1em;
  color: currentColor;
}
</style>
