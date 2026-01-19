<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ShowHazardParams from '../../../Core/params/showHazardParams';
import ShowHazardController from '../../controllers/showHazardController';
import { onMounted, ref, watch } from 'vue';
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import HazardImage from '@/assets/images/alert 2.png'
import ObservationCard from '../FactoryUtils/ObservationCard.vue';
import { Observation } from '../../../Core/Enums/ObservationTypeEnum';

const route = useRoute()
const id = route.params?.id

const showHazardController = ShowHazardController.getInstance()
const state = ref(showHazardController.state.value)

const ShowData = async () => {
  const showHazardParams = new ShowHazardParams(id, true)
  await showHazardController.showHazard(showHazardParams)
}

onMounted(() => {
  ShowData()
})

watch(() => showHazardController.state.value, (newVal) => {
  state.value = newVal
})
const GetHeader = (value: number) => {
  return Observation[value] == 'ObservationType'
    ? 'Observation'
    : Observation[value] == 'HazardType'
      ? 'Hazard'
      : 'incident'
}

</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="show-observation-container">

        <HeaderPage :title="`create ${GetHeader(state.data?.type)}`"
          :subtitle="'Identify and report potential Incedants before they cause harm'" :img="HazardImage" />


        <ObservationCard :data="state.data" />


      </div>
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <PermissionBuilder :code="[
        PermissionsEnum?.ORGANIZATION_EMPLOYEE,
        PermissionsEnum?.ORG_OBSERVATION_CREATE,
      ]">
        <DataEmpty :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
          description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Observation" />
      </PermissionBuilder>
    </template>
    <template #failed>
      <PermissionBuilder :code="[
        PermissionsEnum?.ORGANIZATION_EMPLOYEE,
        PermissionsEnum?.ORG_OBSERVATION_CREATE,
      ]">
        <DataFailed :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
          description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Observation" />
      </PermissionBuilder>
    </template>
  </DataStatus>
</template>

<style scoped>
.index-table-card-container {
  margin-top: 20px;
}
</style>
