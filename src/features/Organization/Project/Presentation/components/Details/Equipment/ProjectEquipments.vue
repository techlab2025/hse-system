<script setup lang="ts">
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue';
import EquipmentCard from './EquipmentCard.vue';
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams';
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum';

const route = useRoute()
const id = route.params.project_id

const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const state = ref(projectCustomLocationController.state.value)

const GetProjectLocationsEqipments = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(id, [ProjectCustomLocationEnum.ZOON, ProjectCustomLocationEnum.ZOON_EQUIPMENT])
  const response = await projectCustomLocationController.getData(projectCustomLocationParams)
}

onMounted(() => {
  GetProjectLocationsEqipments()
})
watch(() => projectCustomLocationController.state.value, (newState) => {
  state.value = newState
})
</script>
<template>

  <DataStatus :controller="state">
    <template #success>
      <PagesHeader title="Equipment , tools & Devices by Zone"
        subtitle="View and manage all equipment assigned to each operational zone" />
      <div class="equipments-sections" v-for="(zones, index) in state.data" :key="index">
        <div v-for="(zone, index) in zones.locationZones" :key="index">

          <EquipmentCard :zones="zone" />
        </div>
      </div>
    </template>
    <template #loader>
      <TableLoader :cols="8" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="8" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty :link="`/organization/project/add`" addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project" />
    </template>
    <template #failed>
      <DataFailed :link="`/organization/project/add`" addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project" />
    </template>
  </DataStatus>

</template>
