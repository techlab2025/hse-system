<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreateHierarchyForm from './CreateHierarchyForm.vue'
import LocationColor from '@/shared/icons/locationColor.vue'
import AddLocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/addLocationHierarchyParams'
import LocationHierarchyParams from '@/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/locationHierarchyParams'
import type TitleInterface from '@/base/Data/Models/title_interface'
import AddLocationHierarchyController from '../../../controllers/Hierarchy/LocationHierarchy/addLocationHierarchyController'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'

const route = useRoute()
const router = useRouter()
const id = route.params.project_id
const LocatioId = route.query?.locationId

const projectCustomLocationController = ProjectCustomLocationController.getInstance()

const addHierarchyController = AddLocationHierarchyController.getInstance()
const state = ref(projectCustomLocationController.state.value)
const isSubmitting = ref(false)

const hierarchies = ref<Record<number, TitleInterface[]>>({})
const selectedPositionsCount = computed(() =>
  Object.values(hierarchies.value).reduce((total, selected) => total + selected.length, 0),
)

const GetProjectLocationsHirarchy = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(id, [
    ProjectCustomLocationEnum.HIERARCHY,
  ])
  await projectCustomLocationController.getData(projectCustomLocationParams)
}

onMounted(async () => {
  await GetProjectLocationsHirarchy()
})

const handleHierarchyUpdate = (projectLocationId: number, value: TitleInterface[]) => {
  hierarchies.value[projectLocationId] = value || []
}

const handleAddAllHierarchies = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    const hierarchyList = Object.entries(hierarchies.value).map(
      ([projectLocationId, selected]) =>
        new LocationHierarchyParams(
          +projectLocationId,
          selected.map((h) => h.id),
        ),
    )

    const params = new AddLocationHierarchyParams(+route.params.project_id, hierarchyList)
    await addHierarchyController.addLocationHierarchy(params, router, id, LocatioId)
  } catch (error) {
    console.error('Error adding hierarchies:', error)
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => projectCustomLocationController.state.value,
  (newState) => {
    if (!newState) return
    state.value = newState
  },
)

// const
</script>

<template>
  <div class="add-hierarchy">
    <DataStatus :controller="state">
      <template #success>
        <section class="hierarchy-intro">
          <div class="intro-icon">
            <span class="intro-step">01</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v5M6 20v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3M7 9h10v5H7z" />
            </svg>
          </div>
          <div class="intro-copy">
            <span>{{ $t('Position setup') }}</span>
            <h2>{{ $t('Build the location structure') }}</h2>
            <p>
              {{
                $t(
                  'Choose the functional positions that are available at this operational location.',
                )
              }}
            </p>
          </div>
          <div class="selection-status" :class="{ 'has-selection': selectedPositionsCount > 0 }">
            <strong>{{ selectedPositionsCount }}</strong>
            <span>{{ $t('positions selected') }}</span>
          </div>
        </section>

        <!-- <div class="workflow-progress" aria-label="Position setup progress">
          <span class="progress-item is-active">
            <i>01</i>
            <span
              ><strong>{{ $t('Choose location') }}</strong
              ><small>{{ $t('Current operational site') }}</small></span
            >
          </span>
          <span class="progress-line" aria-hidden="true"></span>
          <span class="progress-item" :class="{ 'is-active': selectedPositionsCount > 0 }">
            <i>02</i>
            <span
              ><strong>{{ $t('Select positions') }}</strong
              ><small>{{ $t('Build the workforce structure') }}</small></span
            >
          </span>
          <span class="progress-line" aria-hidden="true"></span>
          <span class="progress-item">
            <i>03</i>
            <span
              ><strong>{{ $t('Save changes') }}</strong
              ><small>{{ $t('Confirm your selection') }}</small></span
            >
          </span>
        </div> -->

        <div class="hierarchy-workspace">
          <template v-for="(item, index) in state.data" :key="item.id || index">
            <article class="hierarchy-form" v-if="item?.id == LocatioId">
              <div class="location-header">
                <div class="title">
                  <span class="location-icon"><LocationColor /></span>
                  <span class="title-copy">
                    <small>{{ $t('Operational location') }}</small>
                    <h5>{{ item.title }}</h5>
                  </span>
                </div>
                <span class="location-state"><i></i>{{ $t('Active location') }}</span>
              </div>

              <div class="form-guide">
                <span class="guide-number">01</span>
                <div>
                  <strong>{{ $t('Select functional positions') }}</strong>
                  <small>
                    {{
                      $t('You can choose more than one position from the organization hierarchy.')
                    }}
                  </small>
                </div>
              </div>

              <CreateHierarchyForm
                @update:herikaly="(value) => handleHierarchyUpdate(item.projectLocationId, value)"
                :selectedHirarchy="item.locationHierarchy"
              />

              <!-- <div class="form-tip">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8h.01" />
                </svg>
                <span>
                  {{
                    $t(
                      'Selected positions can be used when assigning employees and creating teams.',
                    )
                  }}
                </span>
              </div> -->
            </article>
          </template>

          <div class="location-not-found" v-if="!state.data?.some((item) => item?.id == LocatioId)">
            <span>!</span>
            <div>
              <strong>{{ $t('Location not found') }}</strong>
              <small>{{
                $t('Return to project details and select an operational location.')
              }}</small>
            </div>
          </div>
        </div>

        <footer class="submit-btn">
          <div class="footer-copy">
            <strong>{{ $t('Ready to continue?') }}</strong>
            <small>{{ $t('Review your position selection before saving changes.') }}</small>
          </div>
          <div class="footer-actions">
            <router-link
              class="back-btn action-btn"
              :to="`/organization/project-details/${route.params.project_id}`"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              {{ $t('Back to details') }}
            </router-link>
            <RouterLink
              :to="`/organization/employee-details/${route.params.project_id}`"
              class="action-btn btn-cancel"
            >
              {{ $t('cancel') }}
            </RouterLink>
            <button
              type="button"
              class="action-btn confirm-btn"
              :disabled="isSubmitting"
              @click="handleAddAllHierarchies"
            >
              <span v-if="isSubmitting" class="button-spinner" aria-hidden="true"></span>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 4 4L19 6" />
              </svg>
              {{ isSubmitting ? $t('Saving') : $t('confirm') }}
            </button>
          </div>
        </footer>
      </template>
      <template #loader><TableLoader :cols="8" :rows="10" /></template>
      <template #initial><TableLoader :cols="8" :rows="10" /></template>
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

<style scoped lang="scss">
.add-hierarchy {
  width: 100%;
  padding-bottom: 20px;
}
.hierarchy-intro {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 15px;
  overflow: hidden;
  margin: 18px 0;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 21px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 14%, transparent),
      transparent 42%
    ),
    var(--surface-1);
  box-shadow: 0 14px 32px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}
.intro-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}

.intro-step {
  position: absolute;
  top: -6px;
  inset-inline-end: -7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 23px;
  height: 20px;
  padding: 0 5px;
  border: 2px solid var(--surface-1);
  border-radius: 7px;
  background: var(--PrimaryColor);
  color: var(--text-on-brand) !important;
  font-family: 'Bold';
  font-size: 0.52rem !important;
  letter-spacing: 0 !important;
}
.intro-icon svg {
  width: 27px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}
.intro-copy span {
  color: var(--PrimaryColor);
  font-size: 0.63rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.intro-copy h2 {
  margin: 3px 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.05rem, 2vw, 1.35rem);
}
.intro-copy p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.72rem;
  line-height: 1.55;
}
.selection-status {
  display: flex;
  min-width: 110px;
  flex-direction: column;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: var(--surface-1);
}
.selection-status strong {
  color: var(--text-soft);
  font-family: 'Bold';
  font-size: 1.2rem;
}
.selection-status span {
  color: var(--text-soft);
  font-size: 0.58rem;
}
.selection-status.has-selection {
  border-color: color-mix(in srgb, var(--status-success) 35%, var(--main-border));
  background: color-mix(in srgb, var(--status-success) 7%, var(--surface-1));
}
.selection-status.has-selection strong {
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
  transition: opacity 0.2s ease;
}

.progress-item.is-active {
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
  background: var(--surface-1);
  color: var(--text-soft);
  font-family: 'Bold';
  font-size: 0.57rem;
  font-style: normal;
}

.progress-item.is-active > i {
  border-color: color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
  color: var(--PrimaryColor);
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
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--PrimaryColor) 34%, transparent),
    var(--main-border)
  );
}
.hierarchy-workspace {
  width: 100%;
}
.hierarchy-form {
  display: block !important;
  overflow: hidden;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  border: 1px solid var(--main-border);
  border-radius: 21px !important;
  background: var(--surface-1) !important;
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
.location-header .title {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 !important;
}
.location-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, transparent);
  border-radius: 13px;
  background: var(--surface-1);
}
.location-icon :deep(svg) {
  width: 23px;
  height: 23px;
}
.title-copy {
  display: flex;
  flex-direction: column;
}
.title-copy small {
  color: var(--PrimaryColor);
  font-size: 0.58rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.title-copy h5 {
  margin: 2px 0 0 !important;
  color: var(--text-strong) !important;
  font-family: 'Bold';
  font-size: 0.94rem !important;
}
.location-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  font-size: 0.6rem;
  font-weight: 800;
}
.location-state i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--status-success) 12%, transparent);
}
.form-guide {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 18px 18px 0;
}
.guide-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  flex: 0 0 35px;
  border-radius: 11px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-800));
  font-family: 'Bold';
  font-size: 0.65rem;
}
.form-guide div {
  display: flex;
  flex-direction: column;
}
.form-guide strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.76rem;
}
.form-guide small {
  margin-top: 2px;
  color: var(--text-soft);
  font-size: 0.61rem;
  line-height: 1.45;
}
.form-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 18px 18px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 12px;
  color: var(--text-soft);
  background: color-mix(in srgb, var(--PrimaryColor) 4%, transparent);
  font-size: 0.62rem;
  line-height: 1.5;
}
.form-tip svg {
  width: 16px;
  flex: 0 0 16px;
  fill: none;
  stroke: var(--PrimaryColor);
  stroke-linecap: round;
  stroke-width: 1.8;
}
.location-not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  gap: 12px;
  padding: 22px;
  border: 1px dashed var(--main-border);
  border-radius: 20px;
  background: var(--surface-1);
}
.location-not-found > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: var(--status-warning);
  background: color-mix(in srgb, var(--status-warning) 10%, transparent);
  font-family: 'Bold';
}
.location-not-found div {
  display: flex;
  flex-direction: column;
}
.location-not-found strong {
  color: var(--text-strong);
  font-size: 0.78rem;
}
.location-not-found small {
  color: var(--text-soft);
  font-size: 0.63rem;
}
.submit-btn {
  position: sticky;
  bottom: 12px;
  z-index: 5;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100%;
  gap: 16px !important;
  margin-top: 18px !important;
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
  font-size: 0.73rem;
}
.footer-copy small {
  color: var(--text-soft);
  font-size: 0.59rem;
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
  padding: 9px 14px !important;
  border: 1px solid transparent;
  border-radius: 12px !important;
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
.btn-cancel {
  border-color: color-mix(in srgb, var(--status-danger) 22%, var(--main-border));
  color: var(--status-danger);
  background: color-mix(in srgb, var(--status-danger) 6%, var(--surface-1));
}
.confirm-btn {
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-800));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 23%, transparent);
}
.action-btn:hover {
  transform: translateY(-1px);
}
.confirm-btn:disabled {
  cursor: wait;
  opacity: 0.65;
  transform: none;
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
@media (max-width: 760px) {
  .hierarchy-intro {
    grid-template-columns: auto 1fr;
  }
  .selection-status {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: center;
    gap: 7px;
  }
  .submit-btn {
    position: static;
    flex-direction: column;
    align-items: stretch !important;
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
}
@media (max-width: 480px) {
  .hierarchy-intro {
    padding: 14px;
    border-radius: 17px;
  }
  .intro-icon {
    width: 43px;
    height: 43px;
  }
  .location-header {
    align-items: flex-start;
    padding: 14px;
  }
  .location-state {
    display: none;
  }
  .form-guide {
    margin-inline: 14px;
  }
  .form-tip {
    margin-inline: 14px;
  }
  .footer-actions {
    grid-template-columns: 1fr;
  }
  .confirm-btn {
    grid-column: auto;
  }

  .workflow-progress {
    gap: 5px;
    padding-inline: 8px;
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
    font-size: 0.56rem;
  }
}
</style>
