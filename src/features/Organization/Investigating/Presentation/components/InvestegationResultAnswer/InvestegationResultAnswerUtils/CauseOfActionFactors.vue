<script setup lang="ts">
import SidebarVector from '@/shared/icons/SidebarVector.vue';
import type InvestegationFactorModel from '@/features/Organization/Investigating/Data/models/InvestigationFactorsModel';

const props = defineProps<{
  factor: InvestegationFactorModel
}>()
</script>
<template>
    <div class="accident-answer-factors">
    <p class="main-factor">main factor : <span>{{ factor.factory?.title }}</span></p>
    <p class="sub-factor" v-for="(subfactor, index2) in factor.investigation_factor_items" :key="index2">
      <SidebarVector class="sub-factor-icon" />
      factor : <span>{{ subfactor }}</span>
    </p>
  </div>
</template>
