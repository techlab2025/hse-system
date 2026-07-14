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

        <div class="header-stats gap-2">
          <p class="project-employees">
            {{ $t('employees') }} :<span>{{ data?.assigned_employees_count || 0 }}</span>
          </p>
          <p class="project-employees">
            {{ $t('Equipment') }} :<span>{{ data?.equipment_count || 0 }}</span>
          </p>
        </div>
      </div>
      <div class="project-card-info">
        <custom-popover>
          <template #btn>
            <p class="locations update-locations">
              <span class="popover-trigger-label">{{ $t('locations') }}</span>
              <span class="popover-trigger-count">{{ data?.locations?.length || 0 }}</span>
              <stopcard class="popover-trigger-icon" />
            </p>
          </template>
          <template #content>
            <div class="project-location-popover">
              <div class="popover-head">
                <div>
                  <span class="popover-kicker">{{ $t('project') }}</span>
                  <h4>{{ $t('locations') }}</h4>
                </div>
                <span class="popover-total">{{ data?.locations?.length || 0 }}</span>
              </div>

              <div class="location-list" v-if="data?.locations?.length">
                <p
                  class="location-data"
                  v-for="(location, index) in data?.locations"
                  :key="location.id"
                >
                  <span class="location-index">{{ index + 1 }}</span>
                  <span class="location-title">{{ location.title }}</span>
                </p>
              </div>

              <p class="popover-empty" v-else>{{ $t('No data available') }}</p>
            </div>
          </template>
        </custom-popover>

        <!-- <p class="locations update-locations">
          {{ $t('zones') }} :<span>{{ data?.zoons?.length }} </span><stopcard />
        </p> -->
        <custom-popover>
          <template #btn>
            <p class="locations update-locations">
              <span class="popover-trigger-label">{{ $t('zones') }}</span>
              <span class="popover-trigger-count">{{ data?.zoons?.length || 0 }}</span>
              <stopcard class="popover-trigger-icon" />
            </p>
          </template>
          <template #content>
            <div class="project-location-popover project-zone-popover">
              <div class="popover-head">
                <div>
                  <span class="popover-kicker">{{ $t('project') }}</span>
                  <h4>{{ $t('zones') }}</h4>
                </div>
                <span class="popover-total">{{ data?.zoons?.length || 0 }}</span>
              </div>

              <div class="location-list zone-list" v-if="data?.zoons?.length">
                <p
                  class="location-data zoon-data"
                  v-for="(zoon, index) in data?.zoons"
                  :key="zoon.id"
                >
                  <span class="location-index zone-index">
                    <pin-icons />
                  </span>
                  <span class="location-title">{{ index + 1 }}. {{ zoon?.title }}</span>
                </p>
              </div>

              <p class="popover-empty" v-else>{{ $t('No data available') }}</p>
            </div>
          </template>
        </custom-popover>
      </div>
      <hr class="project-card-divider" />
      <div class="project-card-data">
        <div class="data-info">
          <span class="info-title">{{ $t('observation') }} :</span>
          <span class="info-count">{{
            data?.observations_count + data?.observation_hazards_count
          }}</span>
        </div>
        <!-- <div class="data-info">
          <span class="info-title">{{ $t('hazerd') }} :</span>
          <span class="info-count">{{ data?.observation_hazards_count }}</span>
        </div> -->
        <div class="data-info">
          <span class="info-title">{{ $t('incident') }} :</span>
          <span class="info-count">{{ data?.observation_accidents_count }}</span>
        </div>
        <div class="data-info">
          <span class="info-title">{{ $t('Investigation') }} :</span>
          <span class="info-count warn">{{ data?.investigation_count }}</span>
        </div>
        <!-- <div class="data-info">
          <span class="info-title">{{ $t('Equipment') }} :</span>
          <span class="info-count warn">{{ data?.equipment_count }}</span>
        </div> -->
        <div class="data-info">
          <span class="info-title">{{ $t('Inspection') }} :</span>
          <span class="info-count warn">{{ data?.inspections_count }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.header-stats {
  display: flex;
}

.update-locations {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 12%, transparent),
      transparent 46%
    ),
    var(--BgWhite);
  color: var(--GrayText-1);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.update-locations:hover {
  border-color: color-mix(in srgb, var(--PrimaryColor) 30%, var(--main-border));
  color: var(--PrimaryColor);
  box-shadow: 0 14px 26px color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
}

.popover-trigger-label {
  font-size: 12px;
  font-weight: 900;
}

.popover-trigger-count {
  display: inline-flex;
  min-width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
  font-family: 'bold';
  font-size: 12px;
  font-weight: 900;
}

.popover-trigger-icon {
  width: 18px;
  height: 18px;
}

.project-location-popover {
  width: min(330px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--main-border) 78%, transparent);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 42%
    ),
    linear-gradient(180deg, var(--BgWhite), var(--Gray-1));
  padding: 14px;
  box-shadow: 0 22px 48px color-mix(in srgb, var(--brand-primary-900) 16%, transparent);
}

.popover-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.popover-kicker {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 5px;
  padding: 4px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
  font-size: 10px;
  font-weight: 900;
}

.popover-head h4 {
  margin: 0;
  color: var(--header-page-color);
  font-family: 'bold';
  font-size: 18px;
  font-weight: 900;
  line-height: 1.15;
}

.popover-total {
  display: inline-flex;
  min-width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--PrimaryColor), var(--header-page-color));
  color: var(--BgWhite);
  font-family: 'bold';
  font-size: 17px;
  font-weight: 900;
  box-shadow: 0 12px 24px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}

.location-list {
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
  padding-inline-end: 3px;
  scrollbar-color: color-mix(in srgb, var(--PrimaryColor) 32%, transparent) transparent;
  scrollbar-width: thin;
}

.location-list::-webkit-scrollbar {
  width: 5px;
}

.location-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 32%, transparent);
}

.location-data {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 9px;
  align-items: center;
  min-height: 44px;
  margin: 0;
  border: 1px solid color-mix(in srgb, var(--main-border) 70%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--BgWhite) 82%, var(--Gray-1));
  color: var(--header-page-color);
  position: relative;
  padding: 7px 10px;
  font-size: 13px;
  font-weight: 800;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.location-data:hover {
  transform: translateX(2px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  box-shadow: 0 10px 18px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.location-index {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
  font-family: 'bold';
  font-size: 12px;
  font-weight: 900;
}

.location-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-zone-popover {
  background:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--p-rent-500) 26%, transparent),
      transparent 38%
    ),
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 44%
    ),
    linear-gradient(180deg, var(--BgWhite), var(--Gray-1));
}

.zone-list {
  max-height: 250px;
}

.zoon-data {
  grid-template-columns: 34px minmax(0, 1fr);
  min-height: 48px;
  padding: 8px 10px;
}

.zoon-data:hover {
  transform: translateY(-1px);
}

.zone-index {
  width: 34px;
  height: 34px;
  border-radius: 13px;
  background:
    linear-gradient(
      180deg,
      var(--BgWhite),
      color-mix(in srgb, var(--PrimaryColor) 7%, var(--BgWhite))
    ),
    color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}

.zone-index :deep(svg) {
  width: 18px;
  height: 18px;
}

.zone-index :deep(path) {
  fill: var(--PrimaryColor);
}

.popover-empty {
  margin: 0;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--BgWhite));
  color: var(--GrayText-1);
  padding: 14px;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
}

:global(.p-popover) {
  overflow: hidden;
  border: 0 !important;
  border-radius: 22px !important;
  background: transparent !important;
  box-shadow: none !important;
}

:global(.p-popover-content) {
  padding: 0 !important;
  background: transparent !important;
}
</style>
