<script setup lang="ts">
import LocationColor from '@/shared/icons/locationColor.vue'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateHierarchyForm from './CreateHierarchyForm.vue'
import { useRoute } from 'vue-router'
import IndexProjectLocationController from '../../../controllers/Hierarchy/ProjectLocations/indexProjectLocationController'
import { onMounted, ref, watch } from 'vue'
import IndexProjectLocationParams from '@/features/Organization/Project/Core/params/Hierarchy/ProjectLocations/indexProjectLocationParams'

const route = useRoute()
const indexProjectLocationController = IndexProjectLocationController.getInstance()
const state = ref(indexProjectLocationController.state.value)


const fetchProjectLocation = async () => {
  const indexProjectLocationParams = new IndexProjectLocationParams(+route.params.project_id)

  indexProjectLocationController.getData(indexProjectLocationParams)
}


onMounted(() => {
  fetchProjectLocation()

})

watch(
  () => indexProjectLocationController.state.value,
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
