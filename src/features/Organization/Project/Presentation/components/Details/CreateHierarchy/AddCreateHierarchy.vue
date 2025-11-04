<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateHierarchyForm from './CreateHierarchyForm.vue'
import LocationColor from '@/shared/icons/locationColor.vue'
import IndexLocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/indexLocationHierarchiesParams'
import AddLocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/addLocationHierarchyParams'
import LocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/locationHierarchyParams'
import type TitleInterface from '@/base/Data/Models/title_interface'
import AddLocationHierarchyController from '../../../controllers/Hierarchy/LocationHierarchy/addLocationHierarchyController'
import IndexProjectLocationController from '../../../controllers/Hierarchy/ProjectLocations/indexProjectLocationController'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'

const route = useRoute()
const router = useRouter()

const projectLocationController = IndexProjectLocationController.getInstance()
const addHierarchyController = AddLocationHierarchyController.getInstance()
const state = ref(projectLocationController.state.value)

const hierarchies = ref<Record<number, TitleInterface[]>>({})




const fetchProjectLocations = async () => {
  try {
    const params = new IndexLocationHierarchyParams(+route.params.project_id)
    await projectLocationController.getData(params)
  } catch (error) {
    console.error('Error fetching project locations:', error)
  }
}

onMounted(fetchProjectLocations)

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
    await addHierarchyController.addLocationHierarchy(params, router)
  } catch (error) {
    console.error('Error adding hierarchies:', error)
  }
}

watch(() => projectLocationController.state.value, (newState) => {
  if(!newState)return
  state.value = newState
})
</script>

<template>
  <div class="add-hierarchy">
    <Breadcrumbs />
<!--    {{ state.data }}-->

    <HeaderPage
      title="Add your hierarchy"
      subtitle="Select your hierarchy for each location from your main hierarchy"
      :number="1"
    />
    <DataStatus :controller="state">
      <template #success>

    <div v-for="item in state.data" :key="item.locationId" class="hierarchy-form">
      <div class="title">
        <LocationColor />
        <h5>{{ item.location?.title }}</h5>
      </div>

      <CreateHierarchyForm
        @update:herikaly="(value) => handleHierarchyUpdate(item.projectLocationId, value)"
      />
    </div>

    <div class="submit-btn">
      <RouterLink
        :to="`/organization/employee-details/${route.params.project_id}`"
        class="btn btn-cancel"
      >
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
