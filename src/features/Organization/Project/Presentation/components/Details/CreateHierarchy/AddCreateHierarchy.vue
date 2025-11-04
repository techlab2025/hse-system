<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

const route = useRoute()
const router = useRouter()

const projectLocationController = IndexProjectLocationController.getInstance()
const addHierarchyController = AddLocationHierarchyController.getInstance()

const hierarchies = ref<Record<number, TitleInterface[]>>({})

const projectLocationsState = computed(() => projectLocationController.state.value)

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
</script>

<template>
  <div class="add-hierarchy">
    <Breadcrumbs />

    <HeaderPage
      title="Add your hierarchy"
      subtitle="Select your hierarchy for each location from your main hierarchy"
      :number="1"
    />

    <div v-for="item in projectLocationsState.data" :key="item.locationId" class="hierarchy-form">
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
  </div>
</template>
