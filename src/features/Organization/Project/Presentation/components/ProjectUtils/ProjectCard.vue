<script lang="ts" setup>
import { ProjectStatusEnum } from '../../../Core/Enums/ProjectStatusEnum'
import type ProjectModel from '../../../Data/models/ProjectModel'
import Stopcard from '@/shared/icons/stopcard.vue'
import CustomPopover from '../../supcomponents/CustomPopover.vue'
import PinIcons from '@/shared/icons/PinIcons.vue'

defineProps<{
  data: ProjectModel
}>()

const GetProjectStatus = (status?: ProjectStatusEnum) => {
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

const getProjectStatusClass = (status?: ProjectStatusEnum) => {
  switch (status) {
    case ProjectStatusEnum.active:
      return 'active'
    case ProjectStatusEnum.completed:
      return 'completed'
    case ProjectStatusEnum.onHold:
      return 'on-hold'
    case ProjectStatusEnum.cancelled:
      return 'cancelled'
    default:
      return ''
  }
}
</script>
<template>
  <router-link class="project-card-link" :to="`/organization/project-details/${data?.id}?type=1`">
    <div class="project-card-container" :class="getProjectStatusClass(data?.status)">
      <div class="project-card-header-container">
        <div class="project-card-header">
          <div class="project-header flex items-center">
            <span class="status" :class="getProjectStatusClass(data?.status)" v-if="data?.status">{{
              GetProjectStatus(data?.status)
            }}</span>
            <span class="serial" :class="data?.status ? 'serial-border' : ''">
              #{{ data?.serialName }}
            </span>
          </div>
          <p class="project-title">{{ data?.title }}</p>
        </div>

        <p class="project-employees">
          {{ $t('employees') }} :<span>{{ data?.assigned_employees_count || 0 }}</span>
        </p>
      </div>
      <div class="project-card-info">
        <custom-popover>
          <template #btn>
            <p class="locations update-locations">
              {{ $t('locations') }} : <span>{{ data?.locations?.length || 0 }} </span> <stopcard />
            </p>
          </template>
          <template #content>
            <div class="flex flex-col gap-2">
              <p class="location-data" v-for="location in data?.locations" :key="location.id">
                {{ location.title }}
              </p>
            </div>
          </template>
        </custom-popover>

        <!-- <p class="locations update-locations">
          {{ $t('zones') }} :<span>{{ data?.zoons?.length }} </span><stopcard />
        </p> -->
        <custom-popover>
          <template #btn>
            <!-- <p class="locations update-locations">
              {{ $t('locations') }} : <span>{{ data?.locations?.length }} </span> <stopcard />
            </p> -->
            <p class="locations update-locations">
              {{ $t('zones') }} :<span>{{ data?.zoons?.length || 0 }} </span><stopcard />
            </p>
          </template>
          <template #content>
            <div class="flex flex-col gap-2">
              <p
                class="zoon-data flex gap-1 items-center"
                v-for="zoon in data?.zoons"
                :key="zoon.id"
              >
                <pin-icons />
                <span>{{ zoon?.title }}</span>
              </p>
            </div>
          </template>
        </custom-popover>
      </div>
      <hr class="project-card-divider" />
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
          <span class="info-title">{{ $t('Equipment') }} :</span>
          <span class="info-count warn">{{ data?.equipment_count }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.location-data {
  position: relative;
  padding: 6px;
  padding-left: 15px;
}
.zoon-data {
  position: relative;
  padding: 6px;
}

.location-data::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 50%;
  width: 7px;
  height: 7px;
  transform: translateY(-50%);
  background-color: #1d4ed8;
  border-radius: 50%;
}
</style>
