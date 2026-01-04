<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateEmployeeForm from './CreateEmployeeForm.vue'
import DashedLine from '@/shared/icons/dashedLine.vue'
import Person from '@/shared/icons/person.vue'
import ArtLine from '@/shared/icons/artLine.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'

import AddHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/addHierarchyEmployeeParams'
import LocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/locationHierarchyEmployeeParams'
import AddHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/addHierarchyEmployeeUserController'

import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'

import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'

// ================== ROUTE ==================
const route = useRoute()
const router = useRouter()

const projectId = +route.params.project_id
const locationId = route.query?.locationId

const addHierarchyEmployeeController =
  AddHierarchyEmployeeController.getInstance()

const projectCustomLocationController =
  ProjectCustomLocationController.getInstance()

const employeesByHierarchy = ref<Record<number, TitleInterface[]>>({})

const state = ref(projectCustomLocationController.state.value)

watch(
  () => projectCustomLocationController.state.value,
  (newState) => {
    if (newState) state.value = newState
  }
)

const getProjectLocationsHierarchiesEmployees = async () => {
  const params = new ProjectCustomLocationParams(projectId, [
    ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
    ProjectCustomLocationEnum.HIERARCHY,
  ])

  await projectCustomLocationController.getData(params)
}

onMounted(getProjectLocationsHierarchiesEmployees)

const handleEmployeesUpdate = (
  hierarchyId: number,
  employees: TitleInterface[]
) => {
  employeesByHierarchy.value[hierarchyId] = employees || []
}

const handleAddAllEmployees = async () => {
  try {
    const hierarchies = Object.entries(employeesByHierarchy.value).map(
      ([hierarchyId, employees]) =>
        new LocationHierarchyEmployeeParams(
          +hierarchyId,
          employees?.length ? employees.map(e => e.id) : []
        )
    )

    // لو مفيش أي hierarchies خالص
    if (hierarchies.length === 0) return

    const params = new AddHierarchyEmployeeParams(projectId, hierarchies)
    await addHierarchyEmployeeController.addHierarchyEmployee(params, router)
  } catch (error) {
    console.error('Error adding employees:', error)
  }
}

</script>

<template>
  <div class="add-employee">
    <Breadcrumbs />

    <HeaderPage title="Assign your employees" subtitle="Select your employees based on each hierarchy in every location"
      :number="2" />

    <DataStatus :controller="state">
      <!-- SUCCESS -->
      <template #success>
        <div v-for="item in state.data" :key="item.projectLocationId" class="employee-form">
          <div v-if="item.id == locationId" class="type">
            <ArtLine class="art-line" />
            <div class="location">
              <h5>{{ item.title }}</h5>
              <sub>{{ item.locationHierarchy?.length }} types</sub>
            </div>
          </div>

          <div v-if="item.id == locationId" v-for="hierarchy in item.locationHierarchy" :key="hierarchy.id"
            class="form-employee-wrapper">
            <div class="title">
              <Person />
              <h5>{{ hierarchy.title }}</h5>
            </div>

            <DashedLine class="dashed-line" />

            <CreateEmployeeForm :heirarchyId="hierarchy.id" :employess="hierarchy.Employees" @update:employee="value =>
              handleEmployeesUpdate(
                hierarchy.projectLocationHierarchyId,
                value
              )
            " />
          </div>
        </div>

        <div class="submit-btn">
          <RouterLink :to="`/organization/employee-details/${projectId}`" class="btn btn-cancel">
            {{ $t('cancel') }}
          </RouterLink>

          <button class="btn btn-primary" @click="handleAddAllEmployees">
            {{ $t('confirm') }}
          </button>
        </div>
      </template>

      <!-- LOADER -->
      <template #loader>
        <TableLoader :cols="8" :rows="10" />
      </template>

      <template #initial>
        <TableLoader :cols="8" :rows="10" />
      </template>

      <!-- EMPTY -->
      <template #empty>
        <DataEmpty :link="`/organization/project/add`" addText="Add Project"
          description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Project" />
      </template>

      <!-- FAILED -->
      <template #failed>
        <DataFailed :link="`/organization/project/add`" addText="Add Project"
          description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Project" />
      </template>
    </DataStatus>
  </div>
</template>
