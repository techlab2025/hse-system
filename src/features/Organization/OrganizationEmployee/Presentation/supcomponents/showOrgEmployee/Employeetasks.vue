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
  border: 1px solid rgba(221, 226, 237, 0.82);
  border-radius: 20px;
  background: radial-gradient(circle at 0 0, rgba(29, 78, 216, 0.1), transparent 32%), #fff;
  box-shadow: 0 12px 30px rgba(15, 25, 39, 0.055);
}

.employee-tasks-card::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  content: '';
  background: linear-gradient(180deg, #1d4ed8, #4aae3a);
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
  color: #1d4ed8;
  background: rgba(29, 78, 216, 0.08);
}

.task-date-pill {
  color: #287b22;
  background: rgba(74, 174, 58, 0.1);
}

.task-date h6 {
  margin: 0;
  color: #041953;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.3;
}

.project-name h6 {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 0;
  color: #7a8797;
  font-size: 12px;
  font-weight: 900;
}

.project-name span {
  color: #111827;
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
  border: 1px solid rgba(221, 226, 237, 0.82);
  border-radius: 16px;
  background: #f8fafc;
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
  color: #7a8797;
  font-size: 10px;
  font-weight: 900;
}

.info h6 {
  margin: 2px 0 0;
  color: #111827;
  font-size: 13px;
  font-weight: 900;
}

.info p {
  margin: 2px 0 0;
  overflow: hidden;
  color: #607086;
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
