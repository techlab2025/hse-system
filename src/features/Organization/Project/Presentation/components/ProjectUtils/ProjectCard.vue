<script lang="ts" setup>
import { ProjectStatusEnum } from '../../../Core/Enums/ProjectStatusEnum';
import type ProjectModel from '../../../Data/models/ProjectModel';
import Stopcard from '@/shared/icons/stopcard.vue';

const props = defineProps<{
  data: ProjectModel
}>()

const GetProjectStatus = (status : ProjectStatusEnum) =>{
  switch (status) {
    case ProjectStatusEnum.active:
      return 'active'
    case ProjectStatusEnum.completed:
      return 'completed'
    case ProjectStatusEnum.onHold:
      return 'onHold'
    case ProjectStatusEnum.cancelled:
      return 'cancelled'
    default:
      return ''
  }
}
</script>
<template>
  <router-link :to="`/organization/project-details/${data?.id}?type=1`">
    <div class="project-card-container">
      <div class="project-card-header-container">
        <div class="project-card-header">
          <div class="project-header flex items-center">
            <span class="status" :class="String(data?.status).toLowerCase()" v-if="data?.status">{{ GetProjectStatus( data?.status) }}</span>
            <span class="serial" :class="data?.status ? 'serial-border':''"> #{{ data?.serialName }} </span>

          </div>
          <p class="project-title">{{ data?.title }}</p>
        </div>

        <p class="project-employees">{{ $t('employees') }} :<span>{{ data?.assigned_employees_count || 0 }}</span></p>
      </div>
      <div class="project-card-info">
        <p class="locations update-locations">{{ $t('locations') }} : <span>{{ data?.locations?.length }} </span> <stopcard/></p>
        <p class="locations update-locations">{{ $t('zones') }} :<span>{{ data?.zoons?.length }} </span><stopcard/></p>
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
