<script setup lang="ts">
import employeeFallback from '@/assets/images/employee-img.png'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'

const props = defineProps<{
  tasks: InspectionModel
}>()
</script>
<template>
  <div class="employee-tasks-card">
    <div class="task-details">
      <div class="task-chip-row">
        <span class="task-chip">Inspection</span>
        <span class="task-date-pill">{{ tasks?.date || 'No date' }}</span>
      </div>
      <div class="task-date">
        <h6>{{ tasks?.template?.title || 'Untitled task' }}</h6>
      </div>
      <div class="project-name">
        <h6>
          {{ $t('Project Name') }} <span>{{ tasks?.project?.title || 'Not selected' }}</span>
        </h6>
      </div>
    </div>
    <div class="info-employee-task">
      <div class="back-ground">
        <div class="imge">
          <img :src="tasks?.created_by?.image || employeeFallback" alt="creator" />
        </div>
        <div class="info">
          <span>Created by</span>
          <h6>{{ tasks?.created_by?.name || 'Unknown' }}</h6>
          <p>{{ tasks?.created_by?.hierarchy?.map((item) => item.title).join(', ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-tasks-card {
  position: relative;
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
  gap: 14px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 82%, transparent);
  border-radius: 20px;
  background: radial-gradient(circle at 0 0, color-mix(in srgb, var(--brand-primary-500) 10%, transparent), transparent 32%), var(--surface-1);
  box-shadow: 0 12px 30px color-mix(in srgb, var(--brand-primary-900) 5.5%, transparent);
}

.employee-tasks-card::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  content: '';
  background: linear-gradient(180deg, var(--brand-primary-500), var(--status-success));
}

.task-details,
.info-employee-task {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.task-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.task-chip,
.task-date-pill {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
}

.task-chip {
  color: var(--brand-primary-500);
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.task-date-pill {
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
}

.task-date h6 {
  margin: 0;
  color: var(--brand-primary-800);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.3;
}

.project-name h6 {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 0;
  color: var(--text-soft);
  font-size: 12px;
  font-weight: 900;
}

.project-name span {
  color: var(--brand-primary-900);
}

.info-employee-task {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.back-ground {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 82%, transparent);
  border-radius: 16px;
  background: var(--brand-primary-50);
}

.imge img {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  object-fit: cover;
}

.info {
  min-width: 0;
}

.info span {
  color: var(--text-soft);
  font-size: 10px;
  font-weight: 900;
}

.info h6 {
  margin: 2px 0 0;
  color: var(--brand-primary-900);
  font-size: 13px;
  font-weight: 900;
}

.info p {
  margin: 2px 0 0;
  overflow: hidden;
  color: var(--brand-primary-500);
  font-size: 11px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .employee-tasks-card {
    grid-template-columns: 1fr;
  }
}
</style>
