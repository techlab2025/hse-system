<script setup lang="ts">
import { useRoute } from 'vue-router';


const route = useRoute()
const props = defineProps<{
  img: string,
  title: string,
  subtitle: string
  link?: string
}>()

</script>
<template>
  <router-link :to="link || route.path" class="empty-teams">
    <img :src="img" alt="empty">
    <div class="empty-text">
      <p class="title">{{ title }}</p>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </router-link>
</template>
