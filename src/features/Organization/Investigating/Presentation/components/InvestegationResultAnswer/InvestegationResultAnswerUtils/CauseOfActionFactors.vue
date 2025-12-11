<script setup lang="ts">
import SidebarVector from '@/shared/icons/SidebarVector.vue';

const props = defineProps<{
  factor: any
}>()
</script>
<template>
  <div class="accident-answer-factors" >
    <p class="main-factor">main factor : <span>{{ factor.mainFactor }}</span></p>
    <p class="sub-factor" v-for="(subfactor, index2) in factor.subFactors" :key="index2">
      <SidebarVector class="sub-factor-icon" />
      factor : <span>{{ subfactor.factor }}</span>
    </p>
  </div>
</template>
