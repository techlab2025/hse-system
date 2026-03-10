<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import mark from '@/assets/images/mark.png'
import type InvestigatingModel from '@/features/Organization/Investigating/Data/models/investigatingModel'
import Galleria from 'primevue/galleria'
import { InvestegationStatusEnum } from '@/features/Organization/Investigating/Core/Enums/InvestegationStatusEnum'
import ShowObservation from '@/features/Organization/ObservationFactory/Presentation/components/Ovservation/ShowObservation.vue'

const visible = ref(false)

const props = defineProps<{
  item: InvestigatingModel
}>()

const staticData = ref({
  title: 'Investigation Details',
  description: 'here are all the observation details and photos the observer add ',
})

const ReturnStatusTitle = (status: InvestegationStatusEnum): string => {
  switch (status) {
    case InvestegationStatusEnum.NEW:
      return 'New'
    case InvestegationStatusEnum.IN_PROGRESS:
      return 'InProgress'
    case InvestegationStatusEnum.CLOSED:
      return 'Closed'
    case InvestegationStatusEnum.COMPLETED:
      return 'Completed'
    case InvestegationStatusEnum.HOLD:
      return 'Hold'
    case InvestegationStatusEnum.OPEN:
      return 'Open'
    default:
      return 'Unknown'
  }
}
</script>

<template>
  <button label="Show" @click="visible = true" class="investigation-show-details-btn">
    show details
  </button>

  <Dialog v-model:visible="visible" modal :dismissableMask="true" :style="{ width: '90vw', maxWidth: '85rem' }">
    <template #header>
      <div class="show-investigation-dialog-header">
        <h3>{{ staticData?.title }}</h3>
        <p>{{ staticData?.description }}</p>
      </div>
    </template>
    <!-- <pre>{{ item }} </pre> -->
    <ShowObservation :ObservationIdFromInvestegation="item.observation.id" />
  </Dialog>
</template>

<!-- <style scoped>
.investigation-show-details{
  border-bottom: 2px dashed #E1E4ED;
  padding-bottom: 1rem;
}
</style> -->
