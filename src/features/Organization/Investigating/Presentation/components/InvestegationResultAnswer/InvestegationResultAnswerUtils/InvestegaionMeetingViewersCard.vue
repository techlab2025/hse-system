<script setup lang="ts">
import type witnessStatementsModel from '@/features/Organization/Investigating/Data/models/InvestegationwitnessStatementsModel';
import { ref } from 'vue';

const props = defineProps<{
  viewer: witnessStatementsModel
  index: number
}>()



</script>
<template>
  <div class="investegaion-viewers-card-conatiner">
    <p class="viewer-number"> Viewer.{{ index + 1 }}</p>
    <div class="investegaion-viewers-card">

      <div class="view">
        <div class="view-header">
          <span>result</span>
          <hr class="hr">
        </div>
        <p class="view-content">{{ viewer?.note }}</p>
      </div>
      <div class="person">
        <!-- <img :src="viewer?.ResponsablePerson?.img" alt="person"> -->
        <div class="person-data">
          <p class="person-name">{{ viewer?.organization_employee?.name }}</p>


          <p class="person-title">{{viewer?.organization_employee?.hierarchy.map((el) => el?.titles).flat().map((el) =>
            el.title).join(', ')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
