<script lang="ts" setup>
import type incidantFactorModel from '@/features/Home/data/Model/incidantFactorModel';

const props = defineProps<{
  incidantFactor: incidantFactorModel
}>()

</script>
<template>
  <div class="incidant-factor-container ">
    <div class="incidant-factor-header-container">
      <div class="incidant-factor-header">
        <span class="static">static</span>
        <p class="static-title">most used incident factors </p>
      </div>
    </div>
    <div class="static-data">
      <p><span>{{ incidantFactor?.Inexperience }}</span>Inexperience</p>
      <p><span>{{ incidantFactor?.NeedsMintenance }}</span>Needs maintenance</p>
      <p><span>{{ incidantFactor?.Misconduct }}</span>Misconduct</p>
    </div>
  </div>
</template>