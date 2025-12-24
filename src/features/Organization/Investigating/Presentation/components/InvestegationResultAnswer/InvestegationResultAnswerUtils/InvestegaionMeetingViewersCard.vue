<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  viewer: any
}>()



</script>
<template>
  <div class="investegaion-viewers-card-conatiner">
    <p class="viewer-number"> Viewer.{{ viewer?.id }}</p>
    <div class="investegaion-viewers-card">

      <div class="view">
        <div class="view-header">
          <span>result</span>
          <hr class="hr">
        </div>
        <p class="view-content">{{ viewer?.description }}</p>
      </div>
      <div class="person">
        <img :src="viewer?.ResponsablePerson?.img" alt="person">
        <div class="person-data">
          <p class="person-name">{{ viewer?.ResponsablePerson?.name }}</p>
          <p class="person-title">{{ viewer?.ResponsablePerson?.heirarchy }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
