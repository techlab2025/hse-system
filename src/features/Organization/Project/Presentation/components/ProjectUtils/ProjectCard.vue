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
            <span class="serial"> #{{ data?.serialName }} </span>
            
          </div>
          <p class="project-title">{{ data?.title }}</p>
        </div>

        <p class="project-employees">{{ $t('employees') }} :<span>{{ data?.assigned_employees_count || 10 }}</span></p>
      </div>
      <div class="project-card-info">
        <p class="locations">{{ $t('locations') }} : <span>{{ data?.locations?.length }}</span></p>
        <p class="locations">{{ $t('zones') }} :<span>{{ data?.zoons?.length }}</span></p>
      </div>
      <hr style="height:1px;width:100%;border-width:1px;color:#b7beca2c ;background-color:#F5F6F7">
      <div class="project-card-data">
        <div class="data-info">
          <span class="info-title">{{ $t('observation') }} :</span>
          <span class="info-count">{{ data?.observations_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">{{ $t('hazerd') }} :</span>
          <span class="info-count">{{ data?.observation_hazards_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">{{ $t('incident') }} :</span>
          <span class="info-count">{{ data?.observation_accidents_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">{{ $t('Investigation') }} :</span>
          <span class="info-count warn">{{ data?.investigation_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">{{ $t('Equibments') }} :</span>
          <span class="info-count warn">{{ data?.equipment_count }}</span>
        </div>
      </div>
    </div>
  </router-link>

</template>
