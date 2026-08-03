<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreateEmployeeForm from './CreateEmployeeForm.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import EmptyFolder from '@/assets/images/EmptyFolder.png'

import AddHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/addHierarchyEmployeeParams'
import LocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/locationHierarchyEmployeeParams'
import AddHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/addHierarchyEmployeeUserController'

import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'

import ProjectPageSkeleton from '../Skeletons/ProjectPageSkeleton.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import EmptyData from '../LocationsTeams/EmptyData.vue'

// ================== ROUTE ==================
const route = useRoute()
const router = useRouter()

const projectId = +route.params.project_id
const locationId = route.query?.locationId

const addHierarchyEmployeeController = AddHierarchyEmployeeController.getInstance()
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const employeesByHierarchy = ref<Record<number, TitleInterface[]>>({})

const state = ref(projectCustomLocationController.state.value)
const isSubmitting = ref(false)

watch(
  () => projectCustomLocationController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
)

const getProjectLocationsHierarchiesEmployees = async () => {
  const params = new ProjectCustomLocationParams(projectId, [
    ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
    ProjectCustomLocationEnum.HIERARCHY,
  ])

  await projectCustomLocationController.getData(params)
}

onMounted(getProjectLocationsHierarchiesEmployees)

const handleEmployeesUpdate = (hierarchyId: number, employees: TitleInterface[]) => {
  employeesByHierarchy.value[hierarchyId] = employees || []
}

const handleAddAllEmployees = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    const hierarchies = Object.entries(employeesByHierarchy.value).map(
      ([hierarchyId, employees]) =>
        new LocationHierarchyEmployeeParams(
          +hierarchyId,
          employees?.length ? employees.map((e) => e.id) : [],
        ),
    )

    if (hierarchies.length === 0) return
    const params = new AddHierarchyEmployeeParams(
      projectId,
      hierarchies.filter((el) => el.employee_ids.length > 0),
    )
    await addHierarchyEmployeeController.addHierarchyEmployee(params, router, route)
  } catch (error) {
    console.error('Error adding employees:', error)
  } finally {
    isSubmitting.value = false
  }
}

const selectedLocation = computed(() => {
  return state.value.data?.find((item) => item.id == locationId)
})

const hasLocationHierarchy = computed(
  () => (selectedLocation.value?.locationHierarchy?.length || 0) > 0,
)
const positionsCount = computed(() => selectedLocation.value?.locationHierarchy?.length || 0)
const assignedEmployeesCount = computed(() =>
  Object.values(employeesByHierarchy.value).reduce(
    (total, selectedEmployees) => total + selectedEmployees.length,
    0,
  ),
)
</script>

<template>
  <main class="add-employee">
    <DataStatus :controller="state">
      <template #success>
        <template v-if="hasLocationHierarchy && selectedLocation">
          <section class="assignment-hero">
            <div class="hero-icon">
              <span>02</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M17 8v8M13 12h8" />
              </svg>
            </div>
            <div class="hero-copy">
              <span>{{ $t('Workforce setup') }}</span>
              <h1>{{ $t('Assign employees to positions') }}</h1>
              <p>
                {{
                  $t(
                    'Build the location workforce by matching employees with each functional position.',
                  )
                }}
              </p>
            </div>
            <div class="hero-metrics">
              <span
                ><strong>{{ positionsCount }}</strong
                >{{ $t('Positions') }}</span
              >
              <span class="assigned-metric"
                ><strong>{{ assignedEmployeesCount }}</strong
                >{{ $t('Assigned') }}</span
              >
            </div>
          </section>

          <!-- <div class="workflow-progress" aria-label="Employee assignment progress">
            <span class="progress-item is-complete"
              ><i>✓</i
              ><span
                ><strong>{{ $t('Positions ready') }}</strong
                ><small>{{ $t('Location structure') }}</small></span
              ></span
            >
            <span class="progress-line is-active"></span>
            <span class="progress-item is-active"
              ><i>02</i
              ><span
                ><strong>{{ $t('Assign employees') }}</strong
                ><small>{{ $t('Choose workforce') }}</small></span
              ></span
            >
            <span class="progress-line"></span>
            <span class="progress-item"
              ><i>03</i
              ><span
                ><strong>{{ $t('Save changes') }}</strong
                ><small>{{ $t('Confirm assignment') }}</small></span
              ></span
            >
          </div> -->

          <section class="employee-form">
            <header class="location-header">
              <div class="location-identity">
                <span class="location-pin" aria-hidden="true"><i></i></span>
                <span
                  ><small>{{ $t('Operational location') }}</small>
                  <h2>{{ selectedLocation.title }}</h2></span
                >
              </div>
              <span class="location-summary"
                ><i></i>{{ positionsCount }} {{ $t('positions available') }}</span
              >
            </header>

            <!-- <div class="assignment-guide">
              <div>
                <strong>{{ $t('Position assignments') }}</strong
                ><small>{{ $t('Select one or more employees for every position below.') }}</small>
              </div>
              <span>{{ assignedEmployeesCount }} {{ $t('selected') }}</span>
            </div> -->

            <div class="position-grid">
              <article
                v-for="(hierarchy, index) in selectedLocation.locationHierarchy"
                :key="hierarchy.projectLocationHierarchyId || hierarchy.id"
                class="position-card"
              >
                <div class="position-card-header">
                  <span class="position-number">{{ String(index + 1).padStart(2, '0') }}</span>
                  <span class="position-copy">
                    <small>{{ $t('Functional position') }}</small>
                    <h3>{{ hierarchy.title }}</h3>
                  </span>
                  <span class="position-count">
                    {{ employeesByHierarchy[hierarchy.projectLocationHierarchyId]?.length || 0 }}
                  </span>
                </div>

                <CreateEmployeeForm
                  :heirarchyId="hierarchy.id"
                  :employess="hierarchy.Employees"
                  @update:employee="
                    (value) => handleEmployeesUpdate(hierarchy.projectLocationHierarchyId, value)
                  "
                />
              </article>
            </div>
          </section>

          <footer class="submit-btn">
            <div class="footer-copy">
              <strong>{{ $t('Review workforce assignments') }}</strong>
              <small
                >{{ assignedEmployeesCount }} {{ $t('employee assignments will be saved') }}</small
              >
            </div>
            <div class="footer-actions">
              <router-link
                class="action-btn back-btn"
                :to="`/organization/project-details/${route.params.project_id}`"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                {{ $t('Back to details') }}
              </router-link>
              <RouterLink
                :to="`/organization/employee-details/${projectId}`"
                class="action-btn cancel-btn"
              >
                {{ $t('cancel') }}
              </RouterLink>
              <button
                type="button"
                class="action-btn confirm-btn"
                :disabled="isSubmitting"
                @click="handleAddAllEmployees"
              >
                <span v-if="isSubmitting" class="button-spinner"></span>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
                {{ isSubmitting ? $t('Saving') : $t('confirm') }}
              </button>
            </div>
          </footer>
        </template>

        <div v-else class="hierarchy-empty">
          <EmptyData
            :img="EmptyFolder"
            :title="$t('No Poistion Yet')"
            :subtitle="
              $t(
                'You haven’t added any Poistion to this project. Start building your Hierarchy now!',
              )
            "
            :link="`/organization/project-hierarchy/project/${projectId}?locationId=${locationId}`"
            :linkText="$t('Start building your Poistion now!')"
          />
        </div>
      </template>

      <template #loader><ProjectPageSkeleton variant="assignment" /></template>
      <template #initial><ProjectPageSkeleton variant="assignment" /></template>
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
  </main>
</template>

<style scoped lang="scss">
.add-employee {
  width: 100%;
  padding-bottom: 20px;
}
.assignment-hero {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 21px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 13%, transparent),
      transparent 42%
    ),
    var(--surface-1);
  box-shadow: 0 14px 32px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}
.hero-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 17px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}
.hero-icon > span {
  position: absolute;
  top: -6px;
  inset-inline-end: -7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 5px;
  border: 2px solid var(--surface-1);
  border-radius: 7px;
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.52rem;
}
.hero-icon svg {
  width: 28px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}
.hero-copy > span {
  color: var(--PrimaryColor);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.hero-copy h1 {
  margin: 3px 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.08rem, 2vw, 1.4rem);
}
.hero-copy p {
  max-width: 650px;
  margin: 0;
  color: var(--text-soft);
  font-size: 0.71rem;
  line-height: 1.55;
}
.hero-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(86px, 1fr));
  gap: 7px;
}
.hero-metrics > span {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: 52px;
  padding: 8px 12px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  color: var(--text-soft);
  background: var(--surface-1);
  font-size: 0.56rem;
}
.hero-metrics strong {
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 1rem;
  line-height: 1;
}
.hero-metrics .assigned-metric strong {
  color: var(--status-success);
}
.workflow-progress {
  display: grid;
  grid-template-columns: auto minmax(24px, 1fr) auto minmax(24px, 1fr) auto;
  align-items: center;
  gap: 9px;
  margin: -7px 0 18px;
  padding: 11px 14px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-2) 62%, var(--surface-1));
}
.progress-item {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.58;
}
.progress-item.is-active,
.progress-item.is-complete {
  opacity: 1;
}
.progress-item > i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  flex: 0 0 29px;
  border: 1px solid var(--main-border);
  border-radius: 9px;
  color: var(--text-soft);
  background: var(--surface-1);
  font-family: 'Bold';
  font-size: 0.57rem;
  font-style: normal;
}
.progress-item.is-active > i {
  border-color: color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
}
.progress-item.is-complete > i {
  border-color: color-mix(in srgb, var(--status-success) 28%, var(--main-border));
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 9%, var(--surface-1));
}
.progress-item > span {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}
.progress-item strong {
  color: var(--text-strong);
  font-size: 0.64rem;
}
.progress-item small {
  color: var(--text-soft);
  font-size: 0.53rem;
}
.progress-line {
  height: 1px;
  background: var(--main-border);
}
.progress-line.is-active {
  background: linear-gradient(90deg, var(--status-success), var(--PrimaryColor));
}
.employee-form {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 21px;
  background: var(--surface-1);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}
.location-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--main-border);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
    transparent
  );
}
.location-identity {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 11px;
}
.location-pin {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  border-radius: 13px;
  color: var(--PrimaryColor);
  background: var(--surface-1);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
}
.location-pin::before {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 50% 50% 50% 0;
  content: '';
  transform: rotate(-45deg);
}
.location-pin i {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}
.location-identity > span:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.location-identity small {
  color: var(--PrimaryColor);
  font-size: 0.57rem;
  font-weight: 850;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.location-identity h2 {
  margin: 2px 0 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.94rem;
}
.location-summary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  font-size: 0.7rem;
  font-weight: 850;
}
.location-summary i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.assignment-guide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 18px 0;
  padding: 10px 12px;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: color-mix(in srgb, var(--surface-2) 58%, transparent);
}
.assignment-guide > div {
  display: flex;
  flex-direction: column;
}
.assignment-guide strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.7rem;
}
.assignment-guide small {
  color: var(--text-soft);
  font-size: 0.57rem;
}
.assignment-guide > span {
  padding: 5px 8px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-size: 0.58rem;
  font-weight: 850;
}
.position-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  // display: flex;
  // flex-direction: row;
  width: 100%;
  gap: 11px;
  padding: 14px 18px 18px;
}
.position-card {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-2) 35%, var(--surface-1));
  transition: 0.2s ease;
}
.position-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}
.position-card-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px;
  border-bottom: 1px solid var(--main-border);
}
.position-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border-radius: 10px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-800));
  font-family: 'Bold';
  font-size: 0.59rem;
}
.position-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  flex: 1;
}
.position-copy small {
  color: var(--text-soft);
  font-size: 0.54rem;
  text-transform: uppercase;
}
.position-copy h3 {
  overflow: hidden;
  margin: 1px 0 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.position-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 27px;
  height: 25px;
  padding: 0 7px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-family: 'Bold';
  font-size: 0.61rem;
}
.submit-btn {
  position: sticky;
  bottom: 12px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  padding: 13px 15px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
  backdrop-filter: blur(14px);
}
.footer-copy {
  display: flex;
  flex-direction: column;
}
.footer-copy strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.72rem;
}
.footer-copy small {
  color: var(--text-soft);
  font-size: 0.58rem;
}
.footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  min-height: 42px;
  gap: 7px;
  padding: 9px 14px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 850;
  text-decoration: none;
  transition: 0.2s ease;
}
.action-btn svg {
  width: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
.back-btn {
  border-color: color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-1));
}
.cancel-btn {
  border-color: color-mix(in srgb, var(--status-danger) 22%, var(--main-border));
  color: var(--status-danger);
  background: color-mix(in srgb, var(--status-danger) 6%, var(--surface-1));
}
.confirm-btn {
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-800));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 23%, transparent);
}
.confirm-btn:disabled {
  cursor: wait;
  opacity: 0.65;
}
.button-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid color-mix(in srgb, var(--text-on-brand) 35%, transparent);
  border-top-color: var(--text-on-brand);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
:global([dir='rtl']) .back-btn svg {
  transform: rotate(180deg);
}
@media (max-width: 850px) {
  .assignment-hero {
    grid-template-columns: auto 1fr;
  }
  .hero-metrics {
    grid-column: 1 / -1;
  }
  .position-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .workflow-progress {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .progress-line,
  .progress-item small {
    display: none;
  }
  .progress-item {
    justify-content: center;
  }
  .progress-item > span {
    white-space: normal;
  }
  .submit-btn {
    position: static;
    align-items: stretch;
    flex-direction: column;
  }
  .footer-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .confirm-btn {
    grid-column: 1 / -1;
  }
  .action-btn {
    width: 100%;
    min-width: 0;
  }
}
@media (max-width: 480px) {
  .assignment-hero {
    padding: 14px;
    border-radius: 17px;
  }
  .hero-icon {
    width: 45px;
    height: 45px;
  }
  .location-header {
    align-items: flex-start;
    padding: 14px;
  }
  .location-summary {
    display: none;
  }
  .assignment-guide {
    align-items: flex-start;
    margin-inline: 14px;
  }
  .assignment-guide small {
    display: none;
  }
  .position-grid {
    padding-inline: 14px;
  }
  .footer-actions {
    grid-template-columns: 1fr;
  }
  .confirm-btn {
    grid-column: auto;
  }
  .progress-item {
    gap: 5px;
  }
  .progress-item > i {
    width: 25px;
    height: 25px;
    flex-basis: 25px;
  }
  .progress-item strong {
    font-size: 0.55rem;
  }
}
</style>
