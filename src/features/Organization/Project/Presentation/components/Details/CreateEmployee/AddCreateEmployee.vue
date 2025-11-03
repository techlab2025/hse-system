<script setup lang="ts">
import DashedLine from '@/shared/icons/dashedLine.vue'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateEmployeeForm from './CreateEmployeeForm.vue'
import Person from '@/shared/icons/person.vue'
import ArtLine from '@/shared/icons/artLine.vue'
import IndexLocationHierarchyController from '../../../controllers/Hierarchy/LocationHierarchy/indexLocationHierarchiesController'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { watch, ref } from 'vue'
import IndexLocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeParams'

const route = useRoute()

const indexLocationHierarchyController = IndexLocationHierarchyController.getInstance()

const state = ref(indexLocationHierarchyController.state.value)

const fetchLocationHierarchy = async () => {
  const indexLocationHierarchyParams = new IndexLocationHierarchyParams(+route.params.project_id)

  indexLocationHierarchyController.getData(indexLocationHierarchyParams)
}

onMounted(() => {
  fetchLocationHierarchy()
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
  <div class="add-employee">
    <Breadcrumbs />

    <HeaderPage
      :title="'assign your employees'"
      :subtitle="'select your employee based on each employee in every location'"
      :number="2"
    />
    <div class="employee-form" v-for="i in 3" :key="i">
      <div class="type">
        <ArtLine class="art-line" />
        <div class="location">
          <h5>cairo</h5>
          <sub>5 types</sub>
        </div>
      </div>
      <div class="form-employee-wrapper" v-for="j in 2" :key="j">
        <div class="title">
          <Person />
          <h5>CTO</h5>
        </div>

        <DashedLine class="dashed-line" />

        <CreateEmployeeForm @update:employee="fetchLocationHierarchy" />
      </div>
    </div>

    <div class="submit-btn">
      <button class="btn btn-cancel">{{ $t('cancel') }}</button>
      <button class="btn btn-ptimary">{{ $t('confirm') }}</button>
    </div>
  </div>
</template>
