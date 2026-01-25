<script lang="ts" setup>
import { InvestegationStatusEnum } from '@/features/Organization/Investigating/Core/Enums/InvestegationStatusEnum';
import InvestegationResultDetailsModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationResulDetailsModel';
import NewObservationInvestegation from './ObservationInvestegationFactory/NewObservationInvestegation.vue';
import InprogressObservationInvestegation from './ObservationInvestegationFactory/InprogressObservationInvestegation.vue';
import ClosedObservationInvestegation from './ObservationInvestegationFactory/ClosedObservationInvestegation.vue';

const props = defineProps<{
  data: InvestegationResultDetailsModel
}>()
</script>

<template>
  <!-- New Investigation -->
  <NewObservationInvestegation v-if="data?.status == InvestegationStatusEnum.NEW" :data="data" />


  <!-- In Progress Investigation -->
  <InprogressObservationInvestegation v-else-if="data?.status == InvestegationStatusEnum.IN_PROGRESS" :data="data" />


  <!-- Colsed Investigation -->
  <ClosedObservationInvestegation v-else-if="data?.status == InvestegationStatusEnum.CLOSED" :data="data" />
</template>
