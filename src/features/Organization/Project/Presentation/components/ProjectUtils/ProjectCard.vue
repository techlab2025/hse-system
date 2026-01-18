<script lang="ts" setup>
import type ProjectModel from '../../../Data/models/ProjectModel';

const props = defineProps<{
  data: ProjectModel
}>()
</script>
<template>
  <router-link :to="`/organization/project-details/${data?.id}?type=1`">
    <div class="project-card-container">
      <div class="project-card-header-container">
        <div class="project-card-header">
          <div class="project-header">
            <!-- <span class="status">active </span> -->
            <span class="serial"> #{{ data?.serial_number }} </span>
          </div>
          <p class="project-title">{{ data?.title }}</p>
        </div>

        <p class="project-employees">employees :<span>{{ data?.assigned_employees_count || 10 }}</span></p>
      </div>
      <div class="project-card-info">
        <p class="locations">locations : <span>{{ data?.locations?.length }}</span></p>
        <p class="locations">zones :<span>{{ data?.zoons?.length }}</span></p>
      </div>
      <hr style="height:1px;width:100%;border-width:1px;color:#F5F6F7;background-color:#F5F6F7">
      <div class="project-card-data">
        <div class="data-info">
          <span class="info-title">observation :</span>
          <span class="info-count">{{ data?.observations_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">hazerd :</span>
          <span class="info-count">{{ data?.observation_hazards_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">incident :</span>
          <span class="info-count">{{ data?.observation_accidents_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">Investigation :</span>
          <span class="info-count warn">{{ data?.investigation_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">Equibments :</span>
          <span class="info-count warn">{{ data?.equipment_count }}</span>
        </div>
      </div>
    </div>
  </router-link>

</template>
