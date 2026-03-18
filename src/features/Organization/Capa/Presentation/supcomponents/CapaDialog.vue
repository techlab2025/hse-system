<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import Dialog from 'primevue/dialog'
import { onMounted, ref, watch } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import ObservationCapaDestails from '@/features/Organization/ObservationFactory/Presentation/components/FactoryUtils/ShowFactoryUtils/ObservationCapaDestails.vue'
import ShowHazardController from '@/features/Organization/ObservationFactory/Presentation/controllers/showHazardController'
import ShowHazardParams from '@/features/Organization/ObservationFactory/Core/params/showHazardParams'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'

const props = defineProps<{
  observationId?: number
}>()

const visible = ref(false)

const showHazardController = ShowHazardController.getInstance()
const state = ref(showHazardController.state.value)

const ShowData = async () => {
  const showHazardParams = new ShowHazardParams(props.observationId, true)
  await showHazardController.showHazard(showHazardParams)
}

// onMounted(() => {
//   ShowData()
// })

watch(
  () => showHazardController.state.value,
  (newVal) => {
    state.value = newVal
  },
)

const GetCapaDetails = () => {
  visible.value = true
  ShowData()
}
</script>
<template>
  <button class="observation-details" @click="GetCapaDetails">
    <p>{{ $t('capa_result') }}</p>
  </button>
  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
    <template #header>
      <HeaderSection title="CAPA" subtitle="If you want to Show the CAPA" />
    </template>
    <DataStatus :controller="state">
      <template #success>
        <div class="show-observation-container">
          <ObservationCapaDestails
            class="show-observation-container"
            v-if="state?.data?.capa && state?.data?.type == Observation.HazardType"
            :data="state.data?.capa"
          />
        </div>
      </template>
      <template #loader> </template>
      <template #failed> </template>
    </DataStatus>
  </Dialog>
</template>
<style scoped>
.observation-details {
  background-color: rgba(72, 110, 246, 0.1);
  padding: 0.6rem 0.8rem;
  border-radius: 20px;

  border-bottom: 2px solid #1f41bb;

  &:hover {
    cursor: pointer;
  }
  p {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    font-family: 'bold';
    font-weight: 700;
    font-size: 16px;
    color: #1f41bb;
  }
}
</style>
