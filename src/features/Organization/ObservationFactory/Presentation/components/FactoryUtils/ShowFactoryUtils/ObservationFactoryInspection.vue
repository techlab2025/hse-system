<script lang="ts" setup>
import type InspectionObservatioModel from '@/features/Organization/ObservationFactory/Data/models/InspectionObservationModel';

const props = defineProps<{
  data: InspectionObservatioModel
}>()
</script>
<template>
  <!--  -->
  <div class="observation-inspection-card">
    <div class="observation-inspection-card-header">
      <p class="inspection-name">{{ props?.data?.templateTitle }}</p>
      <p class="inspection-auto">{{ $t('inspection Auto obervation') }}</p>
    </div>
    <div class="observation-inspection-card-content">
      <p class="question-title">{{ props?.data?.templateItemTitle }}</p>

      <div class="answers-choose">
        <span class="choose" v-for="(answer, index) in props.data?.answers">{{ answer?.title
          }}</span>
      </div>
      <div class="text-area">
        <span class="typing-text">{{ $t('typing text') }}</span>
        <span class="text">{{ props?.data?.taskResultItemAnswerTextReply }}</span>
      </div>
    </div>
  </div>
</template>
