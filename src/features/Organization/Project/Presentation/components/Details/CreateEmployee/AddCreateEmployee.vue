<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateEmployeeForm from './CreateEmployeeForm.vue'
import DashedLine from '@/shared/icons/dashedLine.vue'
import Person from '@/shared/icons/person.vue'
import ArtLine from '@/shared/icons/artLine.vue'
import IndexLocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/indexLocationHierarchiesParams'
import AddHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/addHierarchyEmployeeParams'
import LocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/locationHierarchyEmployeeParams'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexLocationHierarchyController from '../../../controllers/Hierarchy/LocationHierarchy/indexLocationHierarchiesController'
import AddHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/addHierarchyEmployeeUserController'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IndexHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeController'

const route = useRoute()
const router = useRouter()

// const indexHierarchyController = IndexLocationHierarchyController.getInstance()
const indexHierarchyEmployeeController = IndexHierarchyEmployeeController.getInstance()
// const addHierarchyEmployeeController = AddHierarchyEmployeeController.getInstance()

const employeesByHierarchy = ref<Record<number, TitleInterface[]>>({})
const state = ref(indexHierarchyEmployeeController.state.value)

watch(
  () => indexHierarchyEmployeeController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

// const hierarchyState = computed(() => indexHierarchyController.state.value)

// const fetchHierarchies = async () => {
//   try {
//     const params = new IndexLocationHierarchyParams(+route.params.project_id)
//     await indexHierarchyController.getData(params)
//   } catch (err) {
//     console.error('Error fetching hierarchies:', err)
//   }
// }
const fetchHierarchiesEmployees = async () => {
  try {
    const params = new IndexLocationHierarchyParams(+route.params.project_id)
    await indexHierarchyEmployeeController.getData(params)
  } catch (err) {
    console.error('Error fetching hierarchies:', err)
  }
}

onMounted(fetchHierarchiesEmployees)

const handleEmployeesUpdate = (hierarchyId: number, value: TitleInterface[]) => {
  employeesByHierarchy.value[hierarchyId] = value || []
}

const handleAddAllEmployees = async () => {
  try {
    const hierarchies = Object.entries(employeesByHierarchy.value).map(
      ([hierarchyId, employees]) =>
        new LocationHierarchyEmployeeParams(
          +hierarchyId,
          employees.map((e) => e.id),
        ),
    )

    const params = new AddHierarchyEmployeeParams(+route.params.project_id, hierarchies)
    await addHierarchyEmployeeController.addHierarchyEmployee(params, router)
  } catch (err) {
    console.error('Error adding employees:', err)
  }
}
</script>

<template>
  <div class="add-employee">
    <Breadcrumbs />

    <HeaderPage
      title="Assign your employees"
      subtitle="Select your employees based on each hierarchy in every location"
      :number="2"
    />

    <DataStatus :controller="state">
      <template #success>
        <div
          v-for="item in state.data"
          :key="item?.project_location_hierarchy_employee_id"
          class="employee-form"
        >
          <div class="type">
            <ArtLine class="art-line" />
            <div class="location">
              <h5>{{ item?.projectLocation?.locationTitle }}</h5>
              <sub>{{ item?.projectLocation?.hierarchies?.length }} types</sub>
            </div>
          </div>

          <div
            v-for="hierarchy in item?.projectLocation?.hierarchies"
            :key="hierarchy.id"
            class="form-employee-wrapper"
          >
            <div class="title">
              <Person />
              <h5>{{ hierarchy?.title }}</h5>
            </div>

            <DashedLine class="dashed-line" />

            <CreateEmployeeForm
              @update:employee="(value) => handleEmployeesUpdate(hierarchy.id, value)"
            />
          </div>
        </div>

        <div class="submit-btn">
          <RouterLink
            :to="`/organization/employee-details/${route.params.project_id}`"
            class="btn btn-cancel"
          >
            {{ $t('cancel') }}
          </RouterLink>

          <button class="btn btn-primary" @click="handleAddAllEmployees">
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
        <DataEmpty
          :link="`/organization/project/add`"
          addText="Add Project"
          description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Project"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/organization/project/add`"
          addText="Add Project"
          description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Project"
        />
      </template>
    </DataStatus>
  </div>
</template>
