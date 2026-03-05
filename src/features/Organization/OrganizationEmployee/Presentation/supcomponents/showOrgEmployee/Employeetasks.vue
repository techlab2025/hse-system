<script setup lang="ts">
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel';



const props = defineProps<{
  tasks: InspectionModel
}>()
</script>
<template>
  <div class="employee-tasks-card">
    <div class="task-details">
      <div class="type">
        <h6></h6>
      </div>
      <div class="task-date">
        <h6>{{ tasks.template.title }} <span>{{ tasks.date }}</span></h6>
      </div>
      <div class="project-name">
        <h6>project name : <span>{{ tasks.project?.title }}</span></h6>
      </div>
    </div>
    <div class="info-employee-task">
      <div class="back-ground">
        <div class="imge">
          <img src="@/assets/images/employee-img.png" alt="">
        </div>
        <div class="info">
          <h6>{{  tasks.created_by.name }} </h6>
          <p>{{ tasks.created_by.hierarchy.map((item) => item.title).join(', ') }}</p>
        </div>
      </div>
    </div>
  </div>

</template>
