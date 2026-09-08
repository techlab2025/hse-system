<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, markRaw, onMounted, ref, watch, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TranslationsParams from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import DatePicker from 'primevue/datepicker'
import ToggleSwitch from 'primevue/toggleswitch'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexContractorController from '@/features/setting/contractor/Presentation/controllers/indexContractorController'
import IndexContractorParams from '@/features/setting/contractor/Core/params/indexContractorParams'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import IndexTeamController from '@/features/setting/Teams/Presentation/controllers/indexTeamController'
import IndexTeamParams from '@/features/setting/Teams/Core/params/indexTeamParams'
import IndexProjectZoneController from '@/features/Organization/ProjectZone/Presentation/controllers/indexProjectZoneController'
import IndexProjectZoneParams from '@/features/Organization/ProjectZone/Core/params/indexProjectZoneParams'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import AddContractor from '@/features/setting/contractor/Presentation/components/AddContractor.vue'
import AddZoneDialog from '../Dialogs/ZoneDialog/AddZoneDialog.vue'
import AddProjectZoneDialog from '../Dialogs/AddProjectZoneDialog.vue'
import LocationSelectDialog from '../SelectDialogs/LocationSelectDialog.vue'
import type SohwProjectZoonModel from '../../../Data/models/ShowProjectZone'
import { HolidayDaysEnum } from '../../../Core/Enums/UpdatedProjectFlow/HolidayDaysEnum'
import {
  BasicProjectParams,
  ProjectEquipmentsParams,
  ProjectHolidaysParams,
  ProjectLocationPositionEmployeesParams,
  ProjectTeamsParams,
  ProjectFlowDetailsParams,
  type ProjectLocationHierarchy,
  type ProjectLocationTeam,
  type ProjectZoonEquipment,
  type CustomHolidayDay,
} from '../../../Core/params/UpdatedProjectFlow/ProjectFlowParams'
import {
  BasicProjectController,
  ProjectEquipmentsController,
  ProjectHolidaysController,
  ProjectLocationPositionEmployeesController,
  ProjectTeamsController,
  ProjectFlowDetailsController,
} from '../../controllers/UpdatedProjectFlow/ProjectFlowControllers'

const route = useRoute()
const router = useRouter()
const projectId = ref<number | undefined>(route.params.id ? Number(route.params.id) : undefined)
//
const requestedStep = Number(route.params.step ?? route.query.resumeStep ?? 1)
const activeStep = ref(Math.min(5, Math.max(1, requestedStep)))
const editOnly = computed(() => route.query.edit === '1')
const updateProjectId = computed(() => (editOnly.value ? projectId.value : undefined))
const loading = ref(false)
const errorMessage = ref('')

const steps = [
  { number: 1, title: 'Basic data', caption: 'Project identity and scope' },
  { number: 2, title: 'Holidays', caption: 'Working calendar' },
  { number: 3, title: 'Positions', caption: 'Employees by hierarchy' },
  { number: 4, title: 'Teams', caption: 'Location teams' },
  { number: 5, title: 'Equipment', caption: 'Equipment by zone' },
]

const basic = ref({
  serial: '',
  startDate: null as Date | null,
  endDate: null as Date | null,
  cost: '',
  hasZoon: true,
})
const serialFields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: '',
    enabled: !projectId.value,
  },
])
const updateSerial = (data: { SerialNumber: string }) => {
  basic.value.serial = data.SerialNumber
}
type LangTitleValue = { locale: string; icon?: string | Component; title: string }
type LangDescriptionValue = { locale: string; icon?: string | Component; description: string }
const langs = ref<LangTitleValue[]>([])
const langsDescription = ref<LangDescriptionValue[]>([])
const langDefault = ref<LangTitleValue[]>([])
const langDefaultDescription = ref<LangDescriptionValue[]>([])
const contractorIds = ref<TitleInterface[]>([])
const locations = ref<TitleInterface[]>([])
const zoneIds = ref<number[]>([])
const selectedZones = ref<SohwProjectZoonModel[]>([])
const contractorDialog = ref(false)
const locationVisible = ref(false)
const user = useUserStore()
const contractorController = IndexContractorController.getInstance()
const contractorParams = new IndexContractorParams('', 0, 0, 0)
const locationController = IndexLocationController.getInstance()
const locationParams = ref(new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA))
const holidays = ref({
  basicDays: [] as HolidayDaysEnum[],
  hasCustom: false,
  custom: [] as { holiday_title: string; holidays_dates: Date[] }[],
})
type PositionHierarchyForm = {
  hierarchy: TitleInterface | null
  employees: TitleInterface[]
  employeeParams: IndexOrganizatoinEmployeeParams
}
type PositionLocationForm = {
  projectLocation: TitleInterface | null
  heirarchys: PositionHierarchyForm[]
}
const positions = ref<PositionLocationForm[]>([])
const projectLocationController = IndexLocationController.getInstance()
const hierarchyController = IndexHerikalyController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const routeProjectId = computed(
  () => projectId.value ?? (route.query.project_id ? Number(route.query.project_id) : undefined),
)
const projectLocationParams = ref<IndexLocationParams | null>(null)
const hierarchyParams = computed(
  () => new IndexHerikalyParams('', 1, 30, 0, false, routeProjectId.value ?? null),
)
type TeamForm = {
  team: TitleInterface | null
  employees: TitleInterface[]
  employeeParams: IndexOrganizatoinEmployeeParams
}
type TeamLocationForm = { projectLocation: TitleInterface | null; projectTeams: TeamForm[] }
const teams = ref<TeamLocationForm[]>([])
const teamController = IndexTeamController.getInstance()
const teamParams = computed(
  () => new IndexTeamParams('', 1, 30, 0, undefined, routeProjectId.value ?? null),
)

type EquipmentZoneForm = {
  zone: TitleInterface | null
  equipments: TitleInterface[]
  equipmentParams: IndexEquipmentParams
}
const equipments = ref<EquipmentZoneForm[]>([])
const projectZoneController = IndexProjectZoneController.getInstance()
const equipmentController = IndexEquipmentController.getInstance()
const projectZoneParams = computed(
  () =>
    new IndexProjectZoneParams(
      '',
      1,
      30,
      0,
      locations.value.map((item) => item.id),
      routeProjectId.value ?? null,
    ),
)

const fetchLanguages = async () => {
  const available = user.user?.languages?.length
    ? user.user.languages
    : ((await IndexLangController.getInstance().getData(new IndexLangParams('', 1, 100, 0))).value
        .data ?? [])
  const languageItems = available.length ? available : [{ code: 'en' }, { code: 'ar' }]
  langDefault.value = languageItems.map((item: any) => ({
    locale: item.code,
    title: '',
    icon: markRaw(
      LangsMap[item.code as keyof typeof LangsMap]?.icon ?? (item.code === 'ar' ? SA : USA),
    ),
  }))
  langDefaultDescription.value = languageItems.map((item: any) => ({
    locale: item.code,
    description: '',
    icon: markRaw(
      LangsMap[item.code as keyof typeof LangsMap]?.icon ?? (item.code === 'ar' ? SA : USA),
    ),
  }))
  langs.value = langDefault.value.map((item) => ({ ...item }))
  langsDescription.value = langDefaultDescription.value.map((item) => ({ ...item }))
}

const setLangTitles = (value: { locale: string; title?: string }[]) => {
  langs.value = value.map((item) => ({ ...item, title: item.title ?? '' }))
}
const setLangDescriptions = (value: { locale: string; description?: string }[]) => {
  langsDescription.value = value.map((item) => ({ ...item, description: item.description ?? '' }))
}
const setContractors = (value: TitleInterface | TitleInterface[] | null) => {
  contractorIds.value = Array.isArray(value) ? value : value ? [value] : []
}
const setLocations = (value: TitleInterface | TitleInterface[] | null) => {
  locations.value = Array.isArray(value) ? value : value ? [value] : []
}
const updateZones = (value: { locationId: number; ZoneIds: number[] }[]) => {
  zoneIds.value = value.flatMap((item) => item.ZoneIds ?? [])
}
const reloadLocations = () => {
  locationParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA)
}

watch(
  () => basic.value.hasZoon,
  (hasZoon) => {
    if (!hasZoon) {
      zoneIds.value = []
      selectedZones.value = []
    }
  },
)

onMounted(async () => {
  await fetchLanguages()
  if (!projectId.value) return
  const state = await new ProjectFlowDetailsController().show(
    new ProjectFlowDetailsParams(projectId.value),
  )
  if (!state.data) return
  const details = state.data
  const data = details.data
  basic.value = {
    serial: data.serial ?? data.serial_number ?? '',
    startDate: data.start_date ? new Date(data.start_date) : null,
    endDate: data.end_date ? new Date(data.end_date) : null,
    cost: String(data.cost ?? ''),
    hasZoon: data.has_zoon ?? true,
  }
  serialFields.value[0].value = basic.value.serial
  serialFields.value[0].enabled = false
  langs.value = langDefault.value.map((language) => ({
    ...language,
    title:
      data.titles?.find((item: any) => item.locale === language.locale)?.title ??
      data.translation?.[`title_${language.locale}`] ??
      '',
  }))
  langsDescription.value = langDefaultDescription.value.map((language) => ({
    ...language,
    description:
      data.descriptions?.find((item: any) => item.locale === language.locale)?.description ??
      data.translation?.[`description_${language.locale}`] ??
      '',
  }))
  contractorIds.value = (data.contractors ?? []).map(
    (item: any) => new TitleInterface({ id: item.id, title: item.title ?? item.name ?? '' }),
  )
  locations.value = (data.locations ?? []).map(
    (item: any) =>
      new TitleInterface({ id: item.id, title: item.title ?? item.location_title ?? '' }),
  )
  selectedZones.value = data.project_zoons ?? []
  zoneIds.value = (data.zoon_ids ?? data.project_zoons ?? [])
    .flatMap((item: any) => item.zoons?.map((zoon: any) => zoon.id) ?? [item.zoon_id ?? item.id])
    .filter(Boolean)
  holidays.value.basicDays = details.basicHolidayDays
  holidays.value.hasCustom = details.hasCustomHolidayDays
  holidays.value.custom = details.customHolidayDays.map((item: CustomHolidayDay) => ({
    holiday_title: item.holiday_title,
    holidays_dates: item.holidays_dates.map((date) => new Date(date)),
  }))
  positions.value = details.positions.map((location) => ({
    projectLocation: new TitleInterface({
      id: location.project_location_id,
      title: (location as any).title ?? `#${location.project_location_id}`,
    }),
    heirarchys: location.heirarchys.map((hierarchy) => ({
      hierarchy: new TitleInterface({
        id: hierarchy.heirarchy_id,
        title: (hierarchy as any).title ?? `#${hierarchy.heirarchy_id}`,
      }),
      employees: hierarchy.organizaion_employees.map(
        (employee) =>
          new TitleInterface({
            id: employee.organizaion_employee_id,
            title: (employee as any).title ?? `#${employee.organizaion_employee_id}`,
          }),
      ),
      employeeParams: new IndexOrganizatoinEmployeeParams(
        '',
        1,
        30,
        0,
        hierarchy.heirarchy_id,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        routeProjectId.value ?? null,
      ),
    })),
  }))
  teams.value = details.teams.map((location) => ({
    projectLocation: new TitleInterface({
      id: location.project_location_id,
      title: (location as any).title ?? `#${location.project_location_id}`,
    }),
    projectTeams: location.project_teams.map((team) => ({
      team: new TitleInterface({
        id: team.team_id,
        title: (team as any).title ?? `#${team.team_id}`,
      }),
      employees: team.organizaion_employees.map(
        (employee) =>
          new TitleInterface({
            id: employee.organizaion_employee_id,
            title: (employee as any).title ?? `#${employee.organizaion_employee_id}`,
          }),
      ),
      employeeParams: new IndexOrganizatoinEmployeeParams(
        '',
        1,
        30,
        0,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        routeProjectId.value ?? null,
      ),
    })),
  }))
  equipments.value = details.equipments.map((zone) => ({
    zone: new TitleInterface({
      id: zone.project_zoon_id,
      title: (zone as any).title ?? `#${zone.project_zoon_id}`,
    }),
    equipments: zone.equipments.map(
      (equipment) =>
        new TitleInterface({
          id: equipment.equipment_id,
          title: (equipment as any).title ?? `#${equipment.equipment_id}`,
        }),
    ),
    equipmentParams: new IndexEquipmentParams(
      '',
      1,
      30,
      0,
      undefined,
      true,
      zone.project_zoon_id,
      undefined,
      undefined,
      undefined,
      undefined,
      routeProjectId.value ?? null,
    ),
  }))
})

const dayOptions = [
  ['Sunday', HolidayDaysEnum.SUNDAY],
  ['Monday', HolidayDaysEnum.MONDAY],
  ['Tuesday', HolidayDaysEnum.TUESDAY],
  ['Wednesday', HolidayDaysEnum.WEDNESDAY],
  ['Thursday', HolidayDaysEnum.THURSDAY],
  ['Friday', HolidayDaysEnum.FRIDAY],
  ['Saturday', HolidayDaysEnum.SATURDAY],
] as const

watch(
  routeProjectId,
  (id) => {
    projectLocationParams.value = id
      ? new IndexLocationParams(
          '',
          1,
          30,
          0,
          LocationEnum.AREA,
          undefined,
          undefined,
          undefined,
          id,
        )
      : null
  },
  { immediate: true },
)

const addCustomHoliday = () => holidays.value.custom.push({ holiday_title: '', holidays_dates: [] })
const addPositionLocation = () => positions.value.push({ projectLocation: null, heirarchys: [] })
const addHierarchy = (location: PositionLocationForm) =>
  location.heirarchys.push({
    hierarchy: null,
    employees: [],
    employeeParams: new IndexOrganizatoinEmployeeParams(
      '',
      1,
      30,
      0,
      null,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      routeProjectId.value ?? null,
    ),
  })
const setPositionLocation = (
  location: PositionLocationForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  location.projectLocation = Array.isArray(value) ? (value[0] ?? null) : value
}
const setHierarchy = (
  hierarchy: PositionHierarchyForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  hierarchy.hierarchy = Array.isArray(value) ? (value[0] ?? null) : value
  hierarchy.employees = []
  hierarchy.employeeParams = new IndexOrganizatoinEmployeeParams(
    '',
    1,
    30,
    0,
    hierarchy.hierarchy?.id ?? null,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    routeProjectId.value ?? null,
  )
}
const setPositionEmployees = (
  hierarchy: PositionHierarchyForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  hierarchy.employees = Array.isArray(value) ? value : value ? [value] : []
}
const projectEmployeeParams = () =>
  new IndexOrganizatoinEmployeeParams(
    '',
    1,
    30,
    0,
    null,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    routeProjectId.value ?? null,
  )
const addTeamLocation = () => teams.value.push({ projectLocation: null, projectTeams: [] })
const addTeam = (location: TeamLocationForm) =>
  location.projectTeams.push({ team: null, employees: [], employeeParams: projectEmployeeParams() })
const setTeamLocation = (
  location: TeamLocationForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  location.projectLocation = Array.isArray(value) ? (value[0] ?? null) : value
}
const setTeam = (team: TeamForm, value: TitleInterface | TitleInterface[] | null) => {
  team.team = Array.isArray(value) ? (value[0] ?? null) : value
}
const setTeamEmployees = (team: TeamForm, value: TitleInterface | TitleInterface[] | null) => {
  team.employees = Array.isArray(value) ? value : value ? [value] : []
}
const equipmentParamsForZone = (zoneId?: number) =>
  new IndexEquipmentParams(
    '',
    1,
    30,
    0,
    undefined,
    true,
    zoneId,
    undefined,
    undefined,
    undefined,
    undefined,
    routeProjectId.value ?? null,
  )
const addEquipmentZoon = () =>
  equipments.value.push({ zone: null, equipments: [], equipmentParams: equipmentParamsForZone() })
const setEquipmentZone = (
  zone: EquipmentZoneForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  zone.zone = Array.isArray(value) ? (value[0] ?? null) : value
  zone.equipments = []
  zone.equipmentParams = equipmentParamsForZone(zone.zone?.id)
}
const setZoneEquipments = (
  zone: EquipmentZoneForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  zone.equipments = Array.isArray(value) ? value : value ? [value] : []
}

const validateStep = () => {
  if (activeStep.value === 1) {
    if (
      !langs.value.some((item) => item.title.trim()) ||
      !basic.value.startDate ||
      !basic.value.endDate ||
      !basic.value.cost ||
      !locations.value.length ||
      (basic.value.hasZoon && !zoneIds.value.length)
    ) {
      errorMessage.value = 'Project name, dates, cost, location, and enabled zones are required.'
      return false
    }
  }
  if (
    activeStep.value === 2 &&
    holidays.value.hasCustom &&
    holidays.value.custom.some((item) => !item.holiday_title || !item.holidays_dates.length)
  ) {
    errorMessage.value = 'Complete every custom holiday or remove the empty row.'
    return false
  }
  if (
    activeStep.value === 3 &&
    (!positions.value.length ||
      positions.value.some(
        (location) =>
          !location.projectLocation ||
          !location.heirarchys.length ||
          location.heirarchys.some((hierarchy) => !hierarchy.hierarchy),
      ))
  ) {
    errorMessage.value = 'Select a project location and at least one hierarchy for every location.'
    return false
  }
  if (
    activeStep.value === 4 &&
    teams.value.some(
      (location) =>
        !location.projectLocation ||
        !location.projectTeams.length ||
        location.projectTeams.some((team) => !team.team),
    )
  ) {
    errorMessage.value = 'Complete every added location and team, or use Skip & Next.'
    return false
  }
  if (
    activeStep.value === 5 &&
    equipments.value.some((zone) => !zone.zone || !zone.equipments.length)
  ) {
    errorMessage.value = 'Select a zone and equipment for every added row, or use Skip & Next.'
    return false
  }
  errorMessage.value = ''
  return true
}

const buildParams = () => {
  if (activeStep.value === 1) {
    const translation = new TranslationsParams([])
    langs.value.forEach((item) => {
      translation.setTranslation('title', item.locale, item.title)
    })
    langsDescription.value.forEach((item) => {
      translation.setTranslation('description', item.locale, item.description)
    })
    return new BasicProjectParams(
      translation,
      contractorIds.value.map((item) => item.id),
      locations.value.map((item) => item.id),
      basic.value.hasZoon ? zoneIds.value : [],
      basic.value.serial || undefined,
      basic.value.startDate!,
      basic.value.endDate!,
      basic.value.cost,
      basic.value.hasZoon,
      updateProjectId.value,
    )
  }
  if (activeStep.value === 2) {
    const custom = holidays.value.custom.map((item) => ({
      holiday_title: item.holiday_title,
      holidays_dates: item.holidays_dates.map((date) => formatJoinDate(date)),
    }))
    return new ProjectHolidaysParams(
      holidays.value.basicDays,
      holidays.value.hasCustom,
      custom,
      updateProjectId.value,
    )
  }
  if (activeStep.value === 3) {
    const payload: ProjectLocationHierarchy[] = positions.value.map((location) => ({
      project_location_id: location.projectLocation!.id,
      heirarchys: location.heirarchys.map((hierarchy) => ({
        heirarchy_id: hierarchy.hierarchy!.id,
        organizaion_employees: hierarchy.employees.map((employee) => ({
          organizaion_employee_id: employee.id,
        })),
      })),
    }))
    return new ProjectLocationPositionEmployeesParams(payload, updateProjectId.value)
  }
  if (activeStep.value === 4) {
    const payload: ProjectLocationTeam[] = teams.value.map((location) => ({
      project_location_id: location.projectLocation!.id,
      project_teams: location.projectTeams.map((team) => ({
        team_id: team.team!.id,
        organizaion_employees: team.employees.map((employee) => ({
          organizaion_employee_id: employee.id,
        })),
      })),
    }))
    return new ProjectTeamsParams(payload, updateProjectId.value)
  }
  const payload: ProjectZoonEquipment[] = equipments.value.map((zone) => ({
    project_zoon_id: zone.zone!.id,
    equipments: zone.equipments.map((equipment) => ({ equipment_id: equipment.id })),
  }))
  return new ProjectEquipmentsParams(payload, updateProjectId.value)
}

const controllerForStep = () => {
  if (activeStep.value === 1) return new BasicProjectController()
  if (activeStep.value === 2) return new ProjectHolidaysController()
  if (activeStep.value === 3) return new ProjectLocationPositionEmployeesController()
  if (activeStep.value === 4) return new ProjectTeamsController()
  return new ProjectEquipmentsController()
}

const finishOrContinue = async () => {
  if (editOnly.value || activeStep.value === 5) {
    await router.push('/organization/projects?type=1')
    return
  }
  activeStep.value += 1
  await router.replace({
    path: projectId.value
      ? `/organization/project/flow/${projectId.value}`
      : '/organization/project/flow',
    query: {
      resumeStep: String(activeStep.value),
      ...(projectId.value ? { project_id: String(projectId.value) } : {}),
    },
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const saveAndNext = async () => {
  if (!validateStep()) return
  loading.value = true
  try {
    const state = await controllerForStep().save(buildParams())
    if (state.data) {
      projectId.value = state.data.id ?? projectId.value
      await finishOrContinue()
    } else {
      errorMessage.value = state.error?.title ?? 'The step could not be saved.'
    }
  } finally {
    loading.value = false
  }
}

const skipAndNext = async () => {
  if (![4, 5].includes(activeStep.value)) return
  await finishOrContinue()
}
</script>

<template>
  <main class="flow-page">
    <header class="flow-hero">
      <div>
        <span class="eyebrow">PROJECT SETUP</span>
        <h1>{{ editOnly ? `Update ${steps[activeStep - 1].title}` : 'Build your project' }}</h1>
        <p>{{ steps[activeStep - 1].caption }} · Step {{ activeStep }} of 5</p>
      </div>
      <div class="progress-orbit">
        <strong>{{ activeStep * 20 }}%</strong><span>complete</span>
      </div>
    </header>

    <nav v-if="!editOnly" class="stepper" aria-label="Project steps">
      <button
        v-for="step in steps"
        :key="step.number"
        type="button"
        :class="{ active: step.number === activeStep, done: step.number < activeStep }"
        :disabled="step.number > activeStep"
      >
        <span>{{ step.number < activeStep ? '✓' : step.number }}</span>
        <div>
          <strong>{{ step.title }}</strong
          ><small>{{ step.caption }}</small>
        </div>
      </button>
    </nav>

    <form class="flow-card" @submit.prevent="saveAndNext">
      <div v-if="activeStep === 1" class="form-grid">
        <div class="section-title full">
          <span>01</span>
          <div>
            <h2>Basic project data</h2>
            <p>Define the project, its scope, and timeline.</p>
          </div>
        </div>
        <div class="input-wrapper">
          <LangTitleInput
            label="Project Name"
            :langs="langDefault"
            :model-value="langs"
            help-text="Enter the project name in each available language."
            @update:model-value="setLangTitles"
          />
        </div>
        <div class="input-wrapper">
          <SwitchInput
            :fields="serialFields"
            :switch-title="$t('auto')"
            :is-auto="true"
            :switch-reverse="true"
            help-text="Enter a unique project serial number, or enable automatic generation to let the system create it."
            @update:value="updateSerial"
          />
        </div>
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :required="false"
            :model-value="contractorIds"
            :type="2"
            :controller="contractorController"
            :params="contractorParams"
            label="contractors"
            placeholder="Select contractors"
            :is-dialog="true"
            v-model:dialog-visible="contractorDialog"
            @update:model-value="setContractors"
          >
            <template #LabelHeader>
              <span class="add-dialog" @click="contractorDialog = true">{{ $t('New') }}</span>
            </template>
            <template #Dialog><AddContractor @update:data="contractorDialog = false" /></template>
          </UpdatedCustomInputSelect>
        </div>
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :required="true"
            :model-value="locations"
            :controller="locationController"
            :params="locationParams"
            label="location"
            placeholder="Select locations"
            :type="2"
            :onclick="() => (locationVisible = true)"
            @update:model-value="setLocations"
          />
        </div>
        <label
          >Start date<DatePicker
            v-model="basic.startDate"
            date-format="yy-mm-dd"
            placeholder="Select start date"
        /></label>
        <label
          >End date<DatePicker
            v-model="basic.endDate"
            date-format="yy-mm-dd"
            placeholder="Select end date"
        /></label>
        <label
          >Cost<input v-model="basic.cost" inputmode="decimal" required placeholder="0.00"
        /></label>
        <div class="switch-row zone-switch">
          <span
            ><strong>Project has zones</strong
            ><small>Turn this on to select zones for the chosen locations.</small></span
          >
          <ToggleSwitch v-model="basic.hasZoon" />
        </div>
        <div v-if="basic.hasZoon" class="input-wrapper full zone-selector">
          <label class="zone-label">
            <span>{{ $t('zones') }}</span>
            <AddProjectZoneDialog @update:data="updateZones" />
          </label>
          <AddZoneDialog
            :locations="locations"
            :selected-zones="selectedZones"
            @update:data="updateZones"
          />
        </div>
        <div class="input-wrapper full">
          <LangTitleInput
            label="project_scope_of_work"
            :langs="langDefault"
            :model-value="langsDescription"
            field-type="description"
            type="textarea"
            placeholder="What is the project scope of work?"
            :required="false"
            help-text="Describe the scope, main activities, and work boundaries in each language."
            @update:model-value="setLangDescriptions"
          />
        </div>
        <LocationSelectDialog v-model:visible="locationVisible" @location-added="reloadLocations" />
      </div>

      <div v-else-if="activeStep === 2" class="form-grid">
        <div class="section-title full">
          <span>02</span>
          <div>
            <h2>Project holidays</h2>
            <p>Select weekly days off and add exceptional dates.</p>
          </div>
        </div>
        <div class="full weekday-grid">
          <label v-for="day in dayOptions" :key="day[1]" class="day-pill"
            ><input v-model="holidays.basicDays" type="checkbox" :value="day[1]" /><span>{{
              day[0].slice(0, 3)
            }}</span></label
          >
        </div>
        <label class="switch-row full"
          ><input v-model="holidays.hasCustom" type="checkbox" /><span
            ><strong>Custom holidays</strong
            ><small>Add named holidays with one or more dates.</small></span
          ></label
        >
        <template v-if="holidays.hasCustom">
          <div v-for="(holiday, index) in holidays.custom" :key="index" class="repeat-card full">
            <label>Holiday title<input v-model="holiday.holiday_title" /></label>
            <label>
              Holiday dates
              <DatePicker
                v-model="holiday.holidays_dates"
                selection-mode="multiple"
                date-format="yy-mm-dd"
                show-icon
                fluid
                placeholder="Select one or more dates"
              />
            </label>
            <button
              type="button"
              class="icon-button danger"
              @click="holidays.custom.splice(index, 1)"
            >
              ×
            </button>
          </div>
          <button type="button" class="add-row full" @click="addCustomHoliday">
            + Add custom holiday
          </button>
        </template>
      </div>

      <div v-else-if="activeStep === 3" class="form-stack">
        <div class="section-title">
          <span>03</span>
          <div>
            <h2>Positions & employees</h2>
            <p>Connect hierarchies and employees to every project location.</p>
          </div>
        </div>
        <div v-for="(location, locationIndex) in positions" :key="locationIndex" class="group-card">
          <div class="group-head">
            <div class="input-wrapper group-select">
              <UpdatedCustomInputSelect
                :model-value="location.projectLocation"
                :params="projectLocationParams"
                :controller="projectLocationController"
                label="Project location"
                placeholder="Select project location"
                :type="1"
                :required="true"
                @update:model-value="setPositionLocation(location, $event)"
              />
            </div>
            <button
              type="button"
              class="icon-button danger"
              @click="positions.splice(locationIndex, 1)"
            >
              ×
            </button>
          </div>
          <div v-for="(hierarchy, index) in location.heirarchys" :key="index" class="nested-row">
            <div class="input-wrapper">
              <UpdatedCustomInputSelect
                :model-value="hierarchy.hierarchy"
                :params="hierarchyParams"
                :controller="hierarchyController"
                label="Functional position"
                placeholder="Select hierarchy"
                :type="1"
                :required="true"
                @update:model-value="setHierarchy(hierarchy, $event)"
              />
            </div>
            <div class="input-wrapper">
              <UpdatedCustomInputSelect
                :model-value="hierarchy.employees"
                :params="hierarchy.employeeParams"
                :controller="employeeController"
                label="Organization employees"
                placeholder="Select employees"
                :type="2"
                :disabled="!hierarchy.hierarchy"
                @update:model-value="setPositionEmployees(hierarchy, $event)"
              />
            </div>
            <button
              type="button"
              class="icon-button danger"
              @click="location.heirarchys.splice(index, 1)"
            >
              ×
            </button>
          </div>
          <button type="button" class="add-row" @click="addHierarchy(location)">
            + Add hierarchy
          </button>
        </div>
        <button type="button" class="add-group" @click="addPositionLocation">
          + Add project location
        </button>
      </div>

      <div v-else-if="activeStep === 4" class="form-stack">
        <div class="section-title">
          <span>04</span>
          <div>
            <h2>Project teams</h2>
            <p>Assign teams and their employees by location, or skip for now.</p>
          </div>
        </div>
        <div v-for="(location, locationIndex) in teams" :key="locationIndex" class="group-card">
          <div class="group-head">
            <div class="input-wrapper group-select">
              <UpdatedCustomInputSelect
                :model-value="location.projectLocation"
                :params="projectLocationParams"
                :controller="projectLocationController"
                label="Project location"
                placeholder="Select project location"
                :type="1"
                @update:model-value="setTeamLocation(location, $event)"
              />
            </div>
            <button
              type="button"
              class="icon-button danger"
              @click="teams.splice(locationIndex, 1)"
            >
              ×
            </button>
          </div>
          <div v-for="(team, index) in location.projectTeams" :key="index" class="nested-row">
            <div class="input-wrapper">
              <UpdatedCustomInputSelect
                :model-value="team.team"
                :params="teamParams"
                :controller="teamController"
                label="Team"
                placeholder="Select team"
                :type="1"
                @update:model-value="setTeam(team, $event)"
              />
            </div>
            <div class="input-wrapper">
              <UpdatedCustomInputSelect
                :model-value="team.employees"
                :params="team.employeeParams"
                :controller="employeeController"
                label="Project employees"
                placeholder="Select project employees"
                :type="2"
                @update:model-value="setTeamEmployees(team, $event)"
              />
            </div>
            <button
              type="button"
              class="icon-button danger"
              @click="location.projectTeams.splice(index, 1)"
            >
              ×
            </button>
          </div>
          <button type="button" class="add-row" @click="addTeam(location)">+ Add team</button>
        </div>
        <button type="button" class="add-group" @click="addTeamLocation">
          + Add project location
        </button>
      </div>

      <div v-else class="form-stack">
        <div class="section-title">
          <span>05</span>
          <div>
            <h2>Project equipment</h2>
            <p>Attach equipment to zones, or finish without equipment.</p>
          </div>
        </div>
        <div
          v-for="(zone, zoneIndex) in equipments"
          :key="zoneIndex"
          class="group-card equipment-row"
        >
          <div class="input-wrapper w-full">
            <UpdatedCustomInputSelect
              :model-value="zone.zone"
              :params="projectZoneParams"
              :controller="projectZoneController"
              label="Project zone"
              placeholder="Select project zone"
              :type="1"
              @update:model-value="setEquipmentZone(zone, $event)"
            />
          </div>
          <div class="input-wrapper w-full">
            <UpdatedCustomInputSelect
              :model-value="zone.equipments"
              :params="zone.equipmentParams"
              :controller="equipmentController"
              label="Equipment"
              placeholder="Select equipment"
              :type="2"
              :disabled="!zone.zone"
              @update:model-value="setZoneEquipments(zone, $event)"
            />
          </div>
          <button type="button" class="icon-button danger" @click="equipments.splice(zoneIndex, 1)">
            ×
          </button>
        </div>
        <button type="button" class="add-group" @click="addEquipmentZoon">
          + Add project zone
        </button>
      </div>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <footer class="flow-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="router.push('/organization/projects?type=1')"
        >
          Cancel
        </button>
        <div>
          <button
            v-if="[4, 5].includes(activeStep) && !editOnly"
            type="button"
            class="btn-skip"
            @click="skipAndNext"
          >
            Skip & Next
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{
              loading
                ? 'Saving…'
                : editOnly
                  ? 'Save changes'
                  : activeStep === 5
                    ? 'Save & Finish'
                    : 'Save & Next'
            }}
          </button>
        </div>
      </footer>
    </form>
  </main>
</template>

<style scoped>
.flow-page {
  /* max-width: 1120px; */
  margin: 0 auto;
  padding: 8px 0 48px;
  color: var(--GrayText-1);
}
.flow-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  border-radius: 26px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--PrimaryColor) 92%, #15223b),
    color-mix(in srgb, var(--PrimaryColor) 62%, #6c5ce7)
  );
  color: #fff;
  box-shadow: 0 22px 50px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
}
.eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  opacity: 0.72;
}
.flow-hero h1 {
  margin: 6px 0 4px;
  font-size: 30px;
  color: #fff;
}
.flow-hero p {
  margin: 0;
  opacity: 0.78;
}
.progress-orbit {
  width: 92px;
  height: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 7px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
}
.progress-orbit strong {
  font-size: 22px;
}
.progress-orbit span {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.stepper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 18px 0;
}
.stepper button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--BgWhite);
  color: var(--GrayText-1);
  text-align: start;
}
.stepper button > span {
  display: grid;
  place-items: center;
  min-width: 30px;
  height: 30px;
  border-radius: 10px;
  background: var(--Gray-1);
  font-weight: 900;
}
.stepper strong,
.stepper small {
  display: block;
}
.stepper small {
  font-size: 10px;
  opacity: 0.6;
  margin-top: 2px;
}
.stepper button.active {
  border-color: var(--PrimaryColor);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}
.stepper button.active > span,
.stepper button.done > span {
  background: var(--PrimaryColor);
  color: #fff;
}
.stepper button:disabled {
  opacity: 0.58;
}
.flow-card {
  margin-top: 18px;
  padding: 30px;
  border: 1px solid var(--main-border);
  border-radius: 26px;
  background: var(--BgWhite);
  box-shadow: 0 18px 50px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.full {
  grid-column: 1/-1;
}
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}
.section-title > span {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 15px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  color: var(--PrimaryColor);
  font-weight: 900;
}
.section-title h2 {
  margin: 0;
  font-size: 21px;
}
.section-title p {
  margin: 3px 0 0;
  opacity: 0.65;
}
label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 12px;
  font-weight: 800;
}
input,
textarea {
  width: 100%;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--BgWhite);
  color: var(--GrayText-1);
  padding: 12px 14px;
  outline: none;
  transition: 0.2s;
}
input:focus,
textarea:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}
textarea {
  resize: vertical;
}
.switch-row {
  flex-direction: row;
  align-items: center;
  padding: 13px 15px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
}
.switch-row input,
.day-pill input {
  width: 18px;
  height: 18px;
  accent-color: var(--PrimaryColor);
}
.switch-row span {
  display: flex;
  flex-direction: column;
}
.switch-row small {
  font-weight: 400;
  opacity: 0.62;
  margin-top: 2px;
}
.weekday-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 9px;
}
.day-pill {
  align-items: center;
  padding: 12px 6px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  cursor: pointer;
}
.day-pill span {
  font-size: 11px;
}
.repeat-card,
.nested-row,
.equipment-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr auto;
  align-items: end;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: var(--Gray-1);
}
.group-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--main-border);
  border-radius: 18px;
}
.group-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}
.group-head label {
  max-width: 300px;
  flex: 1;
}
.group-select {
  width: min(100%, 520px);
  flex: 1;
}
.icon-button {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 12px;
  font-size: 22px;
  cursor: pointer;
}
.danger {
  background: color-mix(in srgb, #e74c3c 10%, transparent);
  color: #d43d2f;
}
.add-row,
.add-group {
  padding: 11px 14px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 40%, var(--main-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, transparent);
  color: var(--PrimaryColor);
  font-weight: 800;
  cursor: pointer;
}
.add-group {
  padding: 15px;
}
.zone-switch {
  justify-content: space-between;
}
.zone-selector {
  padding: 16px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--Gray-1);
}
.zone-label {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
}
.add-dialog {
  color: var(--PrimaryColor);
  font-weight: 900;
  cursor: pointer;
}
.form-error {
  margin: 18px 0 0;
  padding: 12px 15px;
  border-radius: 12px;
  background: color-mix(in srgb, #e74c3c 9%, transparent);
  color: #c0392b;
  font-weight: 700;
}
.flow-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid var(--main-border);
}
.flow-actions > div {
  display: flex;
  gap: 10px;
}
.btn-primary,
.btn-secondary,
.btn-skip {
  border: 0;
  border-radius: 13px;
  padding: 12px 22px;
  font-weight: 900;
  cursor: pointer;
}
.btn-primary {
  background: var(--PrimaryColor);
  color: #fff;
  box-shadow: 0 9px 20px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
}
.btn-secondary {
  background: var(--Gray-1);
  color: var(--GrayText-1);
}
.btn-skip {
  background: transparent;
  color: var(--PrimaryColor);
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
}
.btn-primary:disabled {
  opacity: 0.55;
  cursor: wait;
}
@media (max-width: 850px) {
  .stepper {
    grid-template-columns: 1fr;
  }
  .stepper button:not(.active):not(.done) {
    display: none;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full {
    grid-column: auto;
  }
  .weekday-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 560px) {
  .flow-hero {
    padding: 22px;
  }
  .progress-orbit {
    width: 72px;
    height: 72px;
  }
  .flow-card {
    padding: 18px;
  }
  .repeat-card,
  .nested-row,
  .equipment-row {
    grid-template-columns: 1fr;
  }
  .flow-actions {
    align-items: stretch;
    gap: 10px;
    flex-direction: column;
  }
  .flow-actions > div {
    display: grid;
  }
  .btn-primary,
  .btn-secondary,
  .btn-skip {
    width: 100%;
  }
}
</style>
