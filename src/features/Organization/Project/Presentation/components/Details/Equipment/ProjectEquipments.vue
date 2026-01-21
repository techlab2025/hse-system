<script setup lang="ts">
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue';
import EquipmentCard from './EquipmentCard.vue';
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams';
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum';
import EmptyEquimentsProjectZones from '../PorjectUtils/EmptyEquimentsProjectZones.vue';
import ProjectEquipmentCard from './ProjectEquipmentCard.vue';

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

const EmptyZones = computed(() => state.value.data?.map((el) => el.locationZones?.filter((el) => !(el.projectZoonEquipments.length > 0)))?.flat())

watch(() => projectCustomLocationController.state.value, (newState) => {
  state.value = newState
})
</script>
<template>

  <DataStatus :controller="state">
    <template #success>
      <PagesHeader title="Equipment_tools_&_devices_by_zone"
        subtitle="view_and_manage_all_equipment_assigned_to_each_operational_zone" />
      <div class="equipments-sections" v-for="(zones, index) in state.data" :key="index">
        <EmptyEquimentsProjectZones :zonesNumber="EmptyZones?.length" :zones="EmptyZones" />
        <div class="project-equipment-card-container grid grid-cols-2 gap-4"
          v-for="(zone, index) in zones.locationZones" :key="index">
          <ProjectEquipmentCard v-for="(tool, index) in zone.projectZoonEquipments" :key="index" :tool="tool" />
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
