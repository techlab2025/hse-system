<script setup lang="ts">
import CardEquipment from './CardEquipment.vue'
import HistoryLog from './HistoryLog.vue'
import QrCode from './QrCode.vue'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'

import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShowEquipmentController from '../../controllers/showEquipmentController'
import ShowEquipmentParams from '../../../Core/params/showEquipmentParams'

const route = useRoute()
const controller = ShowEquipmentController.getInstance()

const state = ref(controller.state.value)

const fetchEquipmentDetails = async () => {
  const id = Number(route.params.id)
  if (!id) return

  const params = new ShowEquipmentParams(id)
  await controller.showEquipmentType(params)
}

onMounted(async () => {
  await fetchEquipmentDetails()
})

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
)
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="show-equipment">
        <CardEquipment  :equipmentData="state.data!" />
        <div class="history-qr">
          <HistoryLog />
          <QrCode />
        </div>
      </div>
    </template>

    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>

    <template #empty>
      <div class="empty-state">{{ $t('No Equipment Data Found') }}</div>
    </template>
  </DataStatus>
</template>
