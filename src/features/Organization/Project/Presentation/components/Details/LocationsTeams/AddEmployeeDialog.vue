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
  <button @click.prevent="visible = true" class="btn btn-primary add-employee-trigger">
    <span aria-hidden="true">+</span>{{ $t('add_employee') }}
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :dismissable-mask="true"
    class="project-employee-dialog"
    :style="{ width: 'min(50rem, calc(100vw - 24px))' }"
  >
    <template #header>
      <HeaderSection
        :img="ZoneDialog"
        title="Select Employees"
        subtitle="At least 1 Employees required for every location"
      />
    </template>

    <div class="employee-dialog-intro">
      <span>01</span>
      <div>
        <strong>{{ $t('Assign employees by hierarchy') }}</strong>
        <p>{{ $t('Choose a position first, then select the employees to assign') }}</p>
      </div>
    </div>
    <div class="input-wrapper dialog-field">
      <CustomSelectInput
        :required="false"
        :modelValue="SelectedHierarchy"
        :static-options="AllLocationHerarchy"
        label="Hierarchy"
        id="Hierarchy"
        :placeholder="$t('Select Hierarchy')"
        @update:modelValue="setSelectedHierarchy"
      />
    </div>
    <div class="input-wrapper dialog-field" v-if="SelectedHierarchy">
      <CustomSelectInput
        :required="false"
        :modelValue="SelectedEmployee"
        :controller="indexOrganizatoinEmployeeController"
        :params="indexOrganizatoinEmployeeParams"
        label="Employee"
        :type="2"
        id="Employee"
        :placeholder="$t('Select Employee')"
        @update:modelValue="setSelectedEmployee"
      />
    </div>

    <button
      class="btn btn-primary w-full confirm-employee-btn"
      :disabled="!SelectedHierarchy || !SelectedEmployee?.length"
      @click.prevent="UpdateDate"
    >
      {{ $t('Confirm') }} <span aria-hidden="true">→</span>
    </button>
  </Dialog>
</template>

<style scoped lang="scss">
.add-employee-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  gap: 6px;
  border-radius: 10px;
  font-size: 0.68rem;
}

.add-employee-trigger > span {
  font-size: 1rem;
}

.employee-dialog-intro {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 13px;
  padding: 13px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2));
}

.employee-dialog-intro > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 11px;
  background: var(--PrimaryColor);
  color: white;
  font-family: 'Bold';
  font-size: 0.68rem;
}

.employee-dialog-intro strong {
  color: var(--text-strong);
  font-size: 0.78rem;
}

.employee-dialog-intro p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.67rem;
}

.dialog-field {
  margin-bottom: 11px;
  padding: 13px;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: var(--surface-2);
}

.confirm-employee-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  gap: 9px;
  border-radius: 12px;
}

.confirm-employee-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
