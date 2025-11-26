<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateHierarchyForm from './CreateHierarchyForm.vue'
import LocationColor from '@/shared/icons/locationColor.vue'
import AddLocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/addLocationHierarchyParams'
import LocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/locationHierarchyParams'
import type TitleInterface from '@/base/Data/Models/title_interface'
import AddLocationHierarchyController from '../../../controllers/Hierarchy/LocationHierarchy/addLocationHierarchyController'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'

const route = useRoute()
const router = useRouter()
const id = route.params.project_id

const projectCustomLocationController = ProjectCustomLocationController.getInstance()

const addHierarchyController = AddLocationHierarchyController.getInstance()
const state = ref(projectCustomLocationController.state.value)

const hierarchies = ref<Record<number, TitleInterface[]>>({})



const GetProjectLocationsHirarchy = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(id, [ProjectCustomLocationEnum.HIERARCHY])
  const response = await projectCustomLocationController.getData(projectCustomLocationParams)
}

onMounted(
  async () => {
    await GetProjectLocationsHirarchy();
  }
)

const handleHierarchyUpdate = (projectLocationId: number, value: TitleInterface[]) => {
  hierarchies.value[projectLocationId] = value || []
}

const handleAddAllHierarchies = async () => {
  try {
    const hierarchyList = Object.entries(hierarchies.value).map(
      ([projectLocationId, selected]) =>
        new LocationHierarchyParams(
          +projectLocationId,
          selected.map((h) => h.id),
        ),
    )

    const params = new AddLocationHierarchyParams(+route.params.project_id, hierarchyList)
     await addHierarchyController.addLocationHierarchy(params, router ,id )

  } catch (error) {
    console.error('Error adding hierarchies:', error)
  }
}

watch(() => projectCustomLocationController.state.value, (newState) => {
  if (!newState) return
  state.value = newState
})
</script>

<template>
  <div class="add-hierarchy">
    <Breadcrumbs />
    <HeaderPage title="Add your hierarchy" subtitle="Select your hierarchy for each location from your main hierarchy"
      :number="1" />
    <DataStatus :controller="state">
      <template #success>
        <div v-for="(item, index) in state.data" :key="index" class="hierarchy-form">
          <div class="title">
            <LocationColor />
            <h5>{{ item.title }}</h5>
          </div>
          <CreateHierarchyForm @update:herikaly="(value) => handleHierarchyUpdate(item.projectLocationId, value)" :selectedHirarchy="item.locationHierarchy" />
        </div>

        <div class="submit-btn">
          <RouterLink :to="`/organization/employee-details/${route.params.project_id}`" class="btn btn-cancel">
            {{ $t('cancel') }}
          </RouterLink>

          <button class="btn btn-primary" @click="handleAddAllHierarchies">
            {{ $t('confirm') }}
          </button>
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
  </div>
</template>
