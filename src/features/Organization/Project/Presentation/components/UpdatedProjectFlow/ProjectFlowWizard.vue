<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TranslationsParams from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type SohwProjectZoonModel from '../../../Data/models/ShowProjectZone'
import BasicProjectParams from '../../../Core/params/UpdatedProjectFlow/BasicProjectParams'
import ProjectFlowDetailsParams from '../../../Core/params/UpdatedProjectFlow/ProjectFlowDetailsParams'
import ProjectHolidaysParams from '../../../Core/params/UpdatedProjectFlow/ProjectHolidaysParams'
import type { CustomHolidayDay } from '../../../Core/params/UpdatedProjectFlow/CustomHolidayDayParams'
import ProjectLocationPositionEmployeesParams from '../../../Core/params/UpdatedProjectFlow/ProjectLocationPositionEmployeesParams'
import ProjectLocationHierarchy from '../../../Core/params/UpdatedProjectFlow/ProjectLocationHierarchyParams'
import ProjectHierarchyParams from '../../../Core/params/UpdatedProjectFlow/hierarchyParams'
import ProjectEmployeeParams from '../../../Core/params/UpdatedProjectFlow/projectEmployeeParams'
import ProjectTeamsParams from '../../../Core/params/UpdatedProjectFlow/ProjectTeamsParams'
import type { ProjectLocationTeam } from '../../../Core/params/UpdatedProjectFlow/ProjectLocationTeamParams'
import ProjectEquipmentsParams from '../../../Core/params/UpdatedProjectFlow/ProjectEquipmentsParams'
import type { ProjectZoonEquipment } from '../../../Core/params/UpdatedProjectFlow/ProjectZoonEquipmentParams'
import BasicProjectController from '../../controllers/UpdatedProjectFlow/BasicProjectController'
import ProjectEquipmentsController from '../../controllers/UpdatedProjectFlow/ProjectEquipmentsController'
import ProjectHolidaysController from '../../controllers/UpdatedProjectFlow/ProjectHolidaysController'
import ProjectLocationPositionEmployeesController from '../../controllers/UpdatedProjectFlow/ProjectLocationPositionEmployeesController'
import ProjectTeamsController from '../../controllers/UpdatedProjectFlow/ProjectTeamsController'
import ProjectFlowDetailsController from '../../controllers/UpdatedProjectFlow/ProjectFlowDetailsController'
import BasicProjectStep from './Steps/BasicProjectStep.vue'
import ProjectHolidaysStep from './Steps/ProjectHolidaysStep.vue'
import ProjectPositionsStep from './Steps/ProjectPositionsStep.vue'
import ProjectTeamsStep from './Steps/ProjectTeamsStep.vue'
import ProjectEquipmentsStep from './Steps/ProjectEquipmentsStep.vue'
import type {
  BasicProjectForm,
  LangDescriptionValue,
  LangTitleValue,
  ProjectSerialField,
} from '../../../Core/params/UpdatedProjectFlow/BasicProjectFormParams'
import type { ProjectHolidaysForm } from '../../../Core/params/UpdatedProjectFlow/ProjectHolidaysFormParams'
import type { PositionLocationForm } from '../../../Core/params/UpdatedProjectFlow/ProjectPositionFormParams'
import type { TeamLocationForm } from '../../../Core/params/UpdatedProjectFlow/ProjectTeamFormParams'
import type { EquipmentZoneForm } from '../../../Core/params/UpdatedProjectFlow/ProjectEquipmentFormParams'

const route = useRoute()
const router = useRouter()
const projectId = ref<number | undefined>(route.params.id ? Number(route.params.id) : undefined)

const parseStep = (value: unknown): number | null => {
  const rawValue = Array.isArray(value) ? value[0] : value
  if (rawValue === undefined || rawValue === null || rawValue === '') return null
  const step = Number(rawValue)
  return Number.isFinite(step) ? Math.min(5, Math.max(1, step)) : null
}

const requestedRouteStep = () => parseStep(route.params.step) ?? parseStep(route.query.resumeStep)
const activeStep = ref(requestedRouteStep() ?? 1)
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

const basic = ref<BasicProjectForm>({
  serial: '',
  startDate: null as Date | null,
  endDate: null as Date | null,
  cost: '',
  hasZoon: true,
})
const serialFields = ref<ProjectSerialField[]>([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: '',
    enabled: !projectId.value,
  },
])
const langs = ref<LangTitleValue[]>([])
const langsDescription = ref<LangDescriptionValue[]>([])
const langDefault = ref<LangTitleValue[]>([])
const langDefaultDescription = ref<LangDescriptionValue[]>([])
const contractorIds = ref<TitleInterface[]>([])
const locations = ref<TitleInterface[]>([])
const zoneIds = ref<number[]>([])
const selectedZones = ref<SohwProjectZoonModel[]>([])
const user = useUserStore()
const holidays = ref<ProjectHolidaysForm>({
  basicDays: [],
  hasCustom: false,
  custom: [] as { holiday_title: string; holidays_dates: Date[] }[],
})
const positions = ref<PositionLocationForm[]>([])
const routeProjectId = computed(
  () => projectId.value ?? (route.query.project_id ? Number(route.query.project_id) : undefined),
)
const teams = ref<TeamLocationForm[]>([])
const equipments = ref<EquipmentZoneForm[]>([])

const resumeStepFromProject = (data: Record<string, any>) => {
  const projectStatus = Number(data.project_status)
  if (Number.isFinite(projectStatus) && projectStatus > 0) {
    return Math.min(5, projectStatus + 1)
  }

  const projectProgress = Number(data.project_progress)
  if (Number.isFinite(projectProgress) && projectProgress > 0) {
    return Math.min(5, Math.floor(projectProgress / 20) + 1)
  }

  return 1
}

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

const updateZones = (value: { locationId: number; ZoneIds: number[] }[]) => {
  zoneIds.value = value.flatMap((item) => item.ZoneIds ?? [])
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
  const state = await ProjectFlowDetailsController.getInstance().show(
    new ProjectFlowDetailsParams({ projectId: projectId.value }),
  )
  if (!state.value.data) return
  const details = state.value.data
  const data = details.data
  activeStep.value = requestedRouteStep() ?? resumeStepFromProject(data)
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
})

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
    return new BasicProjectParams({
      translation,
      contractorIds: contractorIds.value.map((item) => item.id),
      locationIds: locations.value.map((item) => item.id),
      zoonIds: basic.value.hasZoon ? zoneIds.value : [],
      serial: basic.value.serial || undefined,
      startDate: basic.value.startDate!,
      endDate: basic.value.endDate!,
      cost: basic.value.cost,
      hasZoon: basic.value.hasZoon,
      projectId: updateProjectId.value,
      isUpdate: editOnly.value,
    })
  }
  if (activeStep.value === 2) {
    const custom = holidays.value.custom.map((item) => ({
      holiday_title: item.holiday_title,
      holidays_dates: item.holidays_dates.map((date) => formatJoinDate(date)),
    }))
    return new ProjectHolidaysParams({
      basicHolidayDays: holidays.value.basicDays,
      hasCustomHolidayDays: holidays.value.hasCustom,
      customHolidayDays: custom,
      projectId: projectId.value!,
      isUpdate: editOnly.value,
    })
  }
  if (activeStep.value === 3) {
    const payload = positions.value.map(
      (location) =>
        new ProjectLocationHierarchy({
          project_location_id: location.projectLocation!.id,
          isUpdate: editOnly.value,
          hierarchies: location.heirarchys.map(
            (hierarchy) =>
              new ProjectHierarchyParams({
                hierarchy_id: hierarchy.hierarchy!.id,
                organizaion_employees: hierarchy.employees.map(
                  (employee) => new ProjectEmployeeParams({ organizaion_employee_id: employee.id }),
                ),
              }),
          ),
        }),
    )
    return new ProjectLocationPositionEmployeesParams({
      locations: payload,
      projectId: projectId.value!,
      isUpdate: editOnly.value,
    })
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
    return new ProjectTeamsParams({
      locations: payload,
      projectId: projectId.value!,
      isUpdate: editOnly.value,
    })
  }
  const payload: ProjectZoonEquipment[] = equipments.value.map((zone) => ({
    project_zoon_id: zone.zone!.id,
    equipments: zone.equipments.map((equipment) => ({ equipment_id: equipment.id })),
  }))
  return new ProjectEquipmentsParams({
    zoons: payload,
    projectId: projectId.value!,
    isUpdate: editOnly.value,
  })
}

const controllerForStep = () => {
  if (activeStep.value === 1) return BasicProjectController.getInstance()
  if (activeStep.value === 2) return ProjectHolidaysController.getInstance()
  if (activeStep.value === 3) return ProjectLocationPositionEmployeesController.getInstance()
  if (activeStep.value === 4) return ProjectTeamsController.getInstance()
  return ProjectEquipmentsController.getInstance()
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
    if (state.value.data) {
      projectId.value = state.value.data.id ?? projectId.value
      await finishOrContinue()
    } else {
      errorMessage.value = state.value.error?.title ?? 'The step could not be saved.'
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
      <BasicProjectStep
        v-if="activeStep === 1"
        v-model:basic="basic"
        v-model:serial-fields="serialFields"
        v-model:lang-default="langDefault"
        v-model:langs="langs"
        v-model:langs-description="langsDescription"
        v-model:contractor-ids="contractorIds"
        v-model:locations="locations"
        :selected-zones="selectedZones"
        @update-zones="updateZones"
      />
      <ProjectHolidaysStep v-else-if="activeStep === 2" v-model:holidays="holidays" />
      <ProjectPositionsStep
        v-else-if="activeStep === 3"
        v-model:positions="positions"
        :project-id="routeProjectId"
      />
      <ProjectTeamsStep
        v-else-if="activeStep === 4"
        v-model:teams="teams"
        :project-id="routeProjectId"
      />
      <ProjectEquipmentsStep v-else v-model:equipments="equipments" :project-id="routeProjectId" />

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
