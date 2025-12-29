<script setup lang="ts">
import type InvestigatingDocumentModel from '@/features/Organization/Investigating/Data/models/InvestegationDocumentModel';
import AssignedToicon from '@/shared/icons/AssignedToicon.vue';
import { ref, watch } from 'vue';

const props = defineProps<{
  attachment: InvestigatingDocumentModel
}>()




</script>
<template>
  <div class="investegaion-attachment-card">
    <p class="title">{{ attachment?.title }}</p>
    <div class="investegaion-attachment-card-media">
      <img v-for="(img, index) in attachment?.media" :key="index" :src="img?.url" alt="img">
    </div>
  </div>
</template>
