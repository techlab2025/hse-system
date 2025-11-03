<script setup lang="ts">
import LocationColor from '@/shared/icons/locationColor.vue'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateHierarchyForm from './CreateHierarchyForm.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import IndexLocationHierarchyController from '../../../controllers/Hierarchy/LocationHierarchy/indexLocationHierarchiesController'
import IndexLocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/indexLocationHierarchiesParams'

const route = useRoute()
const indexLocationHierarchyController = IndexLocationHierarchyController.getInstance()
const state = ref(indexLocationHierarchyController.state.value)

const fetchProjectLocation = async () => {
  const indexProjectLocationParams = new IndexLocationHierarchyParams(+route.params.project_id)

  indexLocationHierarchyController.getData(indexProjectLocationParams)
}

onMounted(() => {
  fetchProjectLocation()
})

watch(
  () => indexLocationHierarchyController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)
</script>

<template>
  <div class="add-hierarchy">
    <Breadcrumbs />

    <HeaderPage
      :title="'add your hierarchy'"
      :subtitle="'select your hierarchy for each location from your main hierarchy'"
      :number="1"
    />
    <div class="hierarchy-form" v-for="i in 3" :key="i">
      <div class="title">
        <LocationColor />
        <h5>Alexandria</h5>
      </div>
      <CreateHierarchyForm @update:herikaly="fetchProjectLocation" />
    </div>

    <div class="submit-btn">
      <button class="btn btn-cancel">{{ $t('cancel') }}</button>
      <button class="btn btn-ptimary">{{ $t('confirm') }}</button>
    </div>
  </div>
</template>
