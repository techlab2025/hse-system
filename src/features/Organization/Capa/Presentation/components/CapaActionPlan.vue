<script lang="ts" setup>
import { computed, ref } from 'vue'
import TimeLineTasks from '@/features/Organization/Investigating/Presentation/components/Investigating/InvestigatingResultsUtils/TimeLineTasks.vue'
import InvestegationTasksParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationTasksParams'
import InvestigationTaskEmployees from '@/features/Organization/Investigating/Core/params/investegationResult/InvestigationTaskEmployeesParams'

type ActionType = 'corrective' | 'preventive'

const emit = defineEmits(['update:data'])

const selectedTasks = ref<Record<ActionType, Record<string, any>[]>>({
  corrective: [],
  preventive: [],
})

const totals = computed(() => ({
  corrective: selectedTasks.value.corrective.length,
  preventive: selectedTasks.value.preventive.length,
  all: selectedTasks.value.corrective.length + selectedTasks.value.preventive.length,
}))

const mapTasks = (data: any[]) => {
  return data.map((item) => {
    const itemEmployees = new InvestigationTaskEmployees(
      item.employee?.id || null,
      null,
      item?.ResponablePerson?.id,
    )

    return new InvestegationTasksParams(item.text, item.date, [itemEmployees]).toMap()
  })
}

const updateTasks = (type: ActionType, data: any[]) => {
  selectedTasks.value[type] = mapTasks(data)
  emit('update:data', {
    corrective: selectedTasks.value.corrective,
    preventive: selectedTasks.value.preventive,
  })
}
</script>

<template>
  <section class="capa-action-plan">
    <div class="action-plan-header">
      <div>
        <span class="eyebrow">Action plan</span>
        <h3>Corrective and preventive task timeline</h3>
      </div>
      <div class="task-total">
        <span>{{ totals.all }}</span>
        <small>Total tasks</small>
      </div>
    </div>

    <div class="action-plan-grid">
      <article class="task-lane corrective">
        <div class="lane-header">
          <div>
            <span class="lane-kicker">Fix now</span>
            <h4>Corrective tasks</h4>
          </div>
          <span class="task-count">{{ totals.corrective }}</span>
        </div>
        <p class="lane-copy">
          Actions that remove the current nonconformity and bring the case back under control.
        </p>
        <TimeLineTasks @update:data="(data) => updateTasks('corrective', data)" />
      </article>

      <article class="task-lane preventive">
        <div class="lane-header">
          <div>
            <span class="lane-kicker">Stop repeat</span>
            <h4>Preventive tasks</h4>
          </div>
          <span class="task-count">{{ totals.preventive }}</span>
        </div>
        <p class="lane-copy">
          Actions that strengthen the process so the same issue does not return.
        </p>
        <TimeLineTasks @update:data="(data) => updateTasks('preventive', data)" />
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.capa-action-plan {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92)),
    radial-gradient(circle at top left, rgba(20, 184, 166, 0.12), transparent 34%);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  padding: 1.25rem;
}

.action-plan-header,
.lane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.eyebrow,
.lane-kicker {
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h3,
h4 {
  margin: 0.25rem 0 0;
  color: #0f172a;
  font-weight: 800;
}

h3 {
  font-size: 1.35rem;
}

h4 {
  font-size: 1.05rem;
}

.task-total,
.task-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

.task-total {
  min-width: 88px;
  min-height: 64px;
  border-radius: 14px;
  flex-direction: column;

  span {
    font-size: 1.5rem;
    font-weight: 900;
    line-height: 1;
  }

  small {
    color: #64748b;
    font-size: 0.72rem;
    font-weight: 700;
  }
}

.task-count {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  font-weight: 900;
}

.action-plan-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.25rem;
}

.task-lane {
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  padding: 1rem;
}

.task-lane.corrective {
  border-top: 4px solid #ef4444;
}

.task-lane.preventive {
  border-top: 4px solid #14b8a6;
}

.lane-copy {
  margin: 0.7rem 0 1rem;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
}

:deep(.template-container) {
  padding: 0;
}

:deep(.timeline-container) {
  padding: 0;
}

:deep(.timeline-content) {
  border-radius: 14px;
  background: #f8fafc;
}

:deep(.timeline-contect-select) {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

@media (max-width: 1180px) {
  .action-plan-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .capa-action-plan {
    padding: 1rem;
  }

  .action-plan-header {
    align-items: flex-start;
    flex-direction: column;
  }

  :deep(.timeline-contect-select) {
    grid-template-columns: 1fr;
  }
}
</style>
