<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import IndexInspectionParams from '../../../Core/params/indexInspectionParams'
import EmployeeIconCard from '@/shared/icons/employeeIconCard.vue'
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FetchAllTasksController from '../../controllers/FetchAllTasksController'

const props = defineProps<{
  employee_id: number
  employee_name: string
}>()
const indexInspectionController = FetchAllTasksController.getInstance()
const state = ref(indexInspectionController.state.value)

const GetEmployeeInspection = async () => {
  const indexInspectionParams = new IndexInspectionParams('', 1, 10, 1, [props?.employee_id])
  await indexInspectionController.getData(indexInspectionParams)
}

watch(
  () => indexInspectionController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
)

watch(
  () => props.employee_id,
  (employeeId) => {
    if (employeeId) GetEmployeeInspection()
  },
  { immediate: true },
)

const PeriodSubtype = (periodSubType: string | number) => {
  const labels: Record<number, string> = {
    [PeriodTypeEnum.DAILY]: 'Daily',
    [PeriodTypeEnum.WHITDATE]: 'Monthly dates',
    [PeriodTypeEnum.BYDAY]: 'Selected weekdays',
    [PeriodTypeEnum.BYDATE]: 'Custom dates',
    [PeriodTypeEnum.WITHDAY]: 'Recurring interval',
  }

  return labels[Number(periodSubType)] ?? 'Daily'
}

const employeeName = computed(() => props.employee_name || '—')
const employeeInitials = computed(() => {
  const initials = employeeName.value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join('')

  return initials.toUpperCase() || '—'
})

const employeeHierarchy = computed(() =>
  state.value.data?.[0]?.morph?.hierarchy
    ?.map((item: { title?: string }) => item?.title)
    .filter(Boolean)
    .join(' • '),
)

const taskCount = computed(() => state.value.data?.length ?? 0)
</script>

<template>
  <aside class="inspection-show employee-task-preview">
    <div class="preview-heading">
      <span class="preview-heading-icon">
        <EmployeeIconCard />
      </span>
      <div>
        <h3>{{ $t('Employee workload') }}</h3>
        <p>{{ $t('Review current assignments before creating another inspection') }}</p>
      </div>
    </div>

    <div class="employee-summary">
      <div class="employee-avatar" aria-hidden="true">{{ employeeInitials }}</div>
      <div class="employee-info">
        <span class="employee-label">{{ $t('Selected employee') }}</span>
        <h4 class="employee-name">{{ employeeName }}</h4>
        <p v-if="employeeHierarchy" class="employee-role">{{ employeeHierarchy }}</p>
      </div>
      <div class="task-stat">
        <strong>{{ taskCount }}</strong>
        <span>{{ $t('tasks') }}</span>
      </div>
    </div>

    <DataStatus :controller="state">
      <template #success>
        <div class="task-list-heading">
          <div>
            <h4>{{ $t('Assigned inspections') }}</h4>
            <p>{{ $t('Existing workload for this employee') }}</p>
          </div>
          <span class="live-indicator"><i></i>{{ $t('Live') }}</span>
        </div>

        <div class="employee-tasks">
          <article class="task-card" v-for="(task, index) in state.data" :key="task?.id ?? index">
            <span class="task-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="task-copy">
              <h4>{{ task?.template?.title || $t('Inspection task') }}</h4>
              <div class="task-schedule">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="4" />
                  <path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
                <span>{{ $t(PeriodSubtype(task?.periodSubType)) }}</span>
              </div>
            </div>
          </article>
        </div>
      </template>

      <template #loader>
        <div class="task-skeletons" aria-hidden="true">
          <div v-for="index in 3" :key="index" class="task-skeleton">
            <span></span>
            <div><i></i><i></i></div>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="empty-tasks">
          <span class="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 7h8M8 11h5" />
              <rect x="4" y="3" width="16" height="18" rx="4" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </span>
          <h4>{{ $t('No Inspections') }}</h4>
          <p>{{ $t('This employee has no assigned inspections yet') }}</p>
        </div>
      </template>
    </DataStatus>
  </aside>
</template>

<style scoped>
.employee-task-preview {
  position: sticky;
  top: 1rem;
  display: flex;
  width: 100%;
  min-width: 0;
  height: fit-content;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 13%, var(--main-border)) !important;
  border-radius: 1.25rem !important;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--status-success) 9%, transparent),
      transparent 28%
    ),
    linear-gradient(160deg, var(--surface-1), var(--surface-2)) !important;
  box-shadow: 0 14px 32px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  padding: 1rem !important;
}

.preview-heading {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.preview-heading > div {
  min-width: 0;
}

.preview-heading-icon {
  display: inline-flex;
  width: 2.65rem;
  height: 2.65rem;
  flex: 0 0 2.65rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: 0.85rem;
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.preview-heading-icon :deep(svg) {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 0.35rem;
}

.preview-heading h3,
.task-list-heading h4 {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
}

.preview-heading h3 {
  margin-bottom: 0.18rem;
  font-size: 1rem;
}

.preview-heading p,
.task-list-heading p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.74rem;
  line-height: 1.4;
}

.employee-summary {
  display: grid;
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--main-border);
  border-radius: 1rem;
  background: var(--surface-1);
  padding: 0.8rem;
}

.employee-avatar {
  display: inline-flex;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--surface-1);
  border-radius: 0.9rem;
  background: linear-gradient(145deg, var(--brand-primary-500), var(--brand-primary-800));
  box-shadow: 0 7px 16px color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
  color: var(--text-on-brand);
  font-family: 'Bold', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
}

.employee-info {
  min-width: 0;
}

.employee-label {
  display: block;
  margin-bottom: 0.12rem;
  color: var(--text-muted);
  font-size: 0.63rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.employee-name {
  overflow: hidden;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 0.92rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-role {
  overflow: hidden;
  margin: 0.18rem 0 0;
  color: var(--brand-primary-500);
  font-size: 0.68rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-stat {
  display: flex;
  min-width: 3.35rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-inline-start: 1px solid var(--main-border);
  padding-inline-start: 0.65rem;
}

.task-stat strong {
  color: var(--brand-primary-500);
  font-family: 'Bold', sans-serif;
  font-size: 1.2rem;
  line-height: 1;
}

.task-stat span {
  margin-top: 0.18rem;
  color: var(--text-muted);
  font-size: 0.62rem;
}

.task-list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}

.task-list-heading h4 {
  margin-bottom: 0.12rem;
  font-size: 0.84rem;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  background: var(--status-success-soft);
  color: var(--status-success);
  padding: 0.3rem 0.5rem;
  font-size: 0.62rem;
  font-weight: 700;
}

.live-indicator i {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--status-success) 12%, transparent);
}

.employee-tasks {
  display: grid !important;
  max-height: 34rem !important;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  align-items: stretch;
  gap: 0.75rem !important;
  overflow-y: auto;
  margin: 0 !important;
  padding: 0.1rem 0.35rem 0.35rem 0.1rem !important;
  scrollbar-color: var(--brand-primary-200) transparent;
  scrollbar-width: thin;
}

.task-card {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 4.8rem;
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem;
  overflow: visible;
  margin: 0 !important;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 14%, var(--main-border)) !important;
  border-radius: 1rem !important;
  background: linear-gradient(
    135deg,
    var(--surface-1),
    color-mix(in srgb, var(--brand-primary-50) 45%, var(--surface-1))
  );
  padding: 0.9rem !important;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.task-card::before {
  position: absolute;
  top: 0.85rem;
  bottom: 0.85rem;
  inset-inline-start: -1px;
  width: 3px;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(180deg, var(--brand-primary-500), var(--status-success));
  content: '';
}

.task-card::after {
  display: none !important;
}

.task-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 38%, var(--main-border)) !important;
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.task-index {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 16%, transparent);
  border-radius: 0.8rem;
  background: var(--surface-1);
  color: var(--brand-primary-600);
  box-shadow: 0 5px 12px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
  font-family: 'Bold', sans-serif;
  font-size: 0.72rem;
}

.task-copy {
  min-width: 0;
}

.task-copy h4 {
  overflow: hidden;
  margin: 0 0 0.45rem;
  color: var(--text-strong) !important;
  font-family: 'Bold', sans-serif;
  font-size: 0.86rem !important;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-schedule {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  background: var(--status-success-soft);
  color: var(--status-success);
  padding: 0.25rem 0.5rem;
  font-size: 0.67rem;
  font-weight: 700;
  line-height: 1.2;
}

.task-schedule svg {
  width: 0.8rem;
  height: 0.8rem;
  stroke: var(--status-success);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.empty-tasks {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 1px dashed color-mix(in srgb, var(--brand-primary-500) 28%, var(--main-border));
  border-radius: 1rem;
  background: var(--surface-1);
  padding: 1.5rem 1rem;
  text-align: center;
}

.empty-icon {
  display: inline-flex;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.65rem;
  border-radius: 0.9rem;
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.empty-icon svg {
  width: 1.4rem;
  height: 1.4rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.empty-tasks h4 {
  margin: 0 0 0.2rem;
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 0.88rem;
}

.empty-tasks p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.72rem;
}

.task-skeletons {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.task-skeleton {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid var(--main-border);
  border-radius: 0.9rem;
  background: var(--surface-1);
  padding: 0.75rem;
}

.task-skeleton > span,
.task-skeleton i {
  display: block;
  border-radius: 0.5rem;
  background: linear-gradient(
    90deg,
    var(--surface-3) 25%,
    var(--brand-primary-50) 50%,
    var(--surface-3) 75%
  );
  background-size: 200% 100%;
  animation: task-shimmer 1.4s infinite;
}

.task-skeleton > span {
  width: 2rem;
  height: 2rem;
}

.task-skeleton > div {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
}

.task-skeleton i:first-child {
  width: 70%;
  height: 0.55rem;
}

.task-skeleton i:last-child {
  width: 42%;
  height: 0.45rem;
}

@keyframes task-shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1000px) {
  .employee-task-preview {
    position: static;
  }
}

@media (max-width: 420px) {
  .employee-summary {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .task-stat {
    grid-column: 1 / -1;
    flex-direction: row;
    gap: 0.35rem;
    border-top: 1px solid var(--main-border);
    border-inline-start: 0;
    padding-top: 0.55rem;
    padding-inline-start: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .task-card {
    transition: none;
  }

  .task-skeleton > span,
  .task-skeleton i {
    animation: none;
  }
}
</style>
