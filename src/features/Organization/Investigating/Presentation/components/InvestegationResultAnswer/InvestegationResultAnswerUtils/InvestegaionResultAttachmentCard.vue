<script setup lang="ts">
import AssignedToicon from '@/shared/icons/AssignedToicon.vue';
import { ref, watch } from 'vue';

const props = defineProps<{
  attachment: any
}>()




</script>
<template>
  <div class="investegaion-attachment-card">
    <p class="title">{{ attachment?.title }}</p>
    <div class="investegaion-attachment-card-media">
      <img v-for="(img, index) in attachment?.images" :key="index" :src="img" alt="img">
    </div>
  </div>
</template>
