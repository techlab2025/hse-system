<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import Dialog from 'primevue/dialog'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import LocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/locationHierarchyEmployeeParams'
import AddHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/addHierarchyEmployeeParams'
import AddHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/addHierarchyEmployeeUserController'
import { useRoute, useRouter } from 'vue-router'
import IndexLocationHierarchyController from '../../../controllers/Hierarchy/LocationHierarchy/indexLocationHierarchiesController'
import IndexLocationHierarchyEmployeeParams from '../../../../Core/params/Hierarchy/HierarchyEmployee/indexLocationHierarchyEmployeeParams'

const { hierarchy, ProjectLocation } = defineProps<{
  hierarchy: TitleInterface[] | undefined | null
  ProjectLocation: number | undefined
}>()
const route = useRoute()
const router = useRouter()
const SelectedHierarchy = ref<TitleInterface | null>(null)
const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexOrganizatoinEmployeeParams = ref(
  new IndexOrganizatoinEmployeeParams('', 1, 10, 0, SelectedHierarchy.value?.id),
)
const addHierarchyEmployeeController = AddHierarchyEmployeeController.getInstance()
const SelectedEmployee = ref<TitleInterface[] | null>(null)
const visible = ref(false)
const AllLocationHerarchy = ref<TitleInterface[]>()
const indexLocationHierarchyController = IndexLocationHierarchyController.getInstance()
const indexLocationHierarchyEmployeeParams = new IndexLocationHierarchyEmployeeParams(
  Number(route.params.id),
)

const setSelectedHierarchy = (data: TitleInterface) => {
  console.log(data, 'data')
  SelectedHierarchy.value = data
  indexOrganizatoinEmployeeParams.value = new IndexOrganizatoinEmployeeParams(
    '',
    1,
    10,
    0,
    SelectedHierarchy.value?.subtitle ? Number(SelectedHierarchy.value?.subtitle!) : null,
  )
}
const setSelectedEmployee = (data: TitleInterface[]) => {
  SelectedEmployee.value = data
}

const getAllLocationHeeirarchy = async () => {
  const state = await indexLocationHierarchyController.getData(indexLocationHierarchyEmployeeParams)
  if (state.value.data) {
    AllLocationHerarchy.value = state.value.data.filter(
      (el) => el.projectLocationId == ProjectLocation,
    )
  }
}

const UpdateDate = async () => {
  try {
    // const hierarchies = Object.entries(employeesByHierarchy.value).map(
    //   ([hierarchyId, employees]) =>
    //     new LocationHierarchyEmployeeParams(
    //       +hierarchyId,
    //       employees?.length ? employees.map(e => e.id) : []
    //     )
    // )

    // لو مفيش أي hierarchies خالص
    // if (hierarchies.length === 0) return

    const locationHierarchyEmployeeParams = new LocationHierarchyEmployeeParams(
      SelectedHierarchy?.value?.id,
      SelectedEmployee?.value?.map((e) => e.id) || [],
    )
    const params = new AddHierarchyEmployeeParams(Number(route.params.id), [
      locationHierarchyEmployeeParams,
    ])
    const state = await addHierarchyEmployeeController.addHierarchyEmployee(params, router, route)
    visible.value = false
    // console.log()
    // location.reload()
  } catch (error) {
    console.error('Error adding employees:', error)
  }
}

onMounted(() => {
  getAllLocationHeeirarchy()
})
</script>
<template>
  <button @click.prevent="visible = true" class="add-btn">{{ $t('add_employee') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <HeaderSection
        :img="ZoneDialog"
        title="Select Employees"
        subtitle="At least 1 Employees required for every location"
      />
    </template>

    <div class="input-wrapper">
      <CustomSelectInput
        :required="false"
        :modelValue="SelectedHierarchy"
        :static-options="AllLocationHerarchy"
        label="Hierarchy"
        id="Hierarchy"
        placeholder="Select Hierarchy"
        @update:modelValue="setSelectedHierarchy"
      />
    </div>
    <div class="input-wrapper" v-if="SelectedHierarchy">
      <CustomSelectInput
        :required="false"
        :modelValue="SelectedEmployee"
        :controller="indexOrganizatoinEmployeeController"
        :params="indexOrganizatoinEmployeeParams"
        label="Employee"
        :type="2"
        id="Employee"
        placeholder="Select Employee"
        @update:modelValue="setSelectedEmployee"
      />
    </div>

    <button class="btn btn-primary w-full" @click.prevent="UpdateDate">Confirm</button>
  </Dialog>
</template>

<style scoped>
.btn-primary {
  margin-top: 10px;
}
</style>
