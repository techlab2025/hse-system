<script lang="ts" setup>
import InspectionStartTemplate from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/InspectionStartTemplate.vue'
import type InspectionObservatioModel from '@/features/Organization/ObservationFactory/Data/models/InspectionObservationModel'

const props = defineProps<{
  data: InspectionObservatioModel
  templateId: number
  taskId: number
}>()
</script>
<template>
  <!--  -->
  <div class="observation-inspection-card">
    <div class="inspection-start-template btn btn-primary">
      <InspectionStartTemplate
        :templateId="templateId"
        :status="1"
        :taskId="taskId"
        :show-result="true"
        :autoObservation="true"
      />
    </div>
    <!-- :showResult="false" -->
    <!-- :status="task?.status" -->
    <div class="observation-inspection-card-content">
      <p class="question-title">{{ props?.data?.templateItemTitle }}</p>

      <div class="answers-choose">
        <span class="choose" v-for="(answer, index) in props.data?.answers">{{
          answer?.title
        }}</span>
      </div>
      <!-- <div class="text-area">
        <span class="typing-text">{{ $t('typing text') }}</span>
        <span class="text">{{ props?.data?.taskResultItemAnswerTextReply }}</span>
      </div> -->
    </div>
  </div>
</template>
<style scoped>
.inspection-start-template {
  padding: 12px;
  border: 1px solid #1d4ed8;
  border-radius: 12px;
}
</style>
