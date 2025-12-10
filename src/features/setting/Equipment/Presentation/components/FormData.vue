<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import Tabs from './tabs.vue'
import EquipmentForm from './EquipmentForm.vue'
import DeviceForm from './deviceForm.vue'
import ToolsForm from './ToolsForm.vue'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'

import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ShowEquipmentParams from '../../Core/params/showEquipmentParams'
import ShowEquipmentController from '../controllers/showEquipmentController'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'

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
  if (route.params.id) {
    await fetchEquipmentDetails()
  }
})

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
)

const activeTab = ref<string>('equipment')

watch(
  () => state.value.data?.type,
  (newType) => {
    switch (newType) {
      case EquipmentTypesEnum.TOOL:
        activeTab.value = 'tools'
        break
      case EquipmentTypesEnum.EQUIPMENT:
        activeTab.value = 'equipment'
        break
      default:
        activeTab.value = 'devices'
    }
  },
  { immediate: true },
)

</script>

<template>
  <HeaderPage :title="route.params.id ? $t('Edit & Manage Assets') : $t('Add & Manage Assets')" />
  <Tabs @update:activeTab="activeTab = $event" :activeTabData="activeTab" />

  <DataStatus :controller="state">
    <template #success>
      <EquipmentForm v-if="activeTab === 'equipment'" :equipmentData="state.data!" />
      <DeviceForm v-if="activeTab === 'devices'" :deviceData="state.data!" />
      <ToolsForm v-if="activeTab === 'tools'" :toolData="state.data!" />
    </template>

    <template #initial>
      <EquipmentForm v-if="activeTab === 'equipment'" />
      <DeviceForm v-if="activeTab === 'devices'" />
      <ToolsForm v-if="activeTab === 'tools'" />
    </template>

    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>

    <template #empty>
      <div class="empty-state">{{ $t('No Equipment Data Found') }}</div>
    </template>
  </DataStatus>
</template>
