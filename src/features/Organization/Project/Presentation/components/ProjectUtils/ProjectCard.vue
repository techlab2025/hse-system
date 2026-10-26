<script lang="ts" setup>
import { vProjectPanels } from '../../composables/projectPanels'

import { computed } from 'vue'
import { useProjectLabels } from '../../composables/useProjectLabels'
import { useRouter } from 'vue-router'
import { ProjectStatusEnum } from '../../../Core/Enums/ProjectStatusEnum'
import type ProjectModel from '../../../Data/models/ProjectModel'
import LegacyProjectCard from './LegacyProjectCard.vue'
import ProjectIcon from './ProjectIcon.vue'
import CustomPopover from '../../supcomponents/CustomPopover.vue'
import { useI18n } from 'vue-i18n'
import defaultProjectImage from '@/features/Organization/Project/assets/project-reference-sites.webp'

const props = defineProps<{
  data: ProjectModel
  studio?: boolean
}>()
const { t } = useI18n()
const labels = useProjectLabels()
const router = useRouter()

const flowStepLabels = computed(() => [
  labels('basic'),
  labels('holidays'),
  labels('positions'),
  labels('teams'),
  labels('equipment'),
])
const setupProgress = computed(() => Math.max(0, Math.min(100, props.data.projectProgress || 0)))
const availableFlowSteps = computed(() => {
  if (!props.data.projectStatus) return []
  return flowStepLabels.value.slice(0, Math.min(5, props.data.projectStatus))
})
const continueStep = computed(() => Math.min(5, (props.data.projectStatus ?? 0) + 1))
const openFlow = (step: number, edit = false) => {
  router.push({
    path: `/organization/project/flow/${props.data.id}/${edit ? step : ''}`.replace(/\/$/, ''),
    query: edit ? { edit: '1' } : { resumeStep: String(step) },
  })
}

const GetProjectStatus = (status?: ProjectStatusEnum) => {
  switch (status) {
    case ProjectStatusEnum.active:
      return t('project_status_active')
    case ProjectStatusEnum.completed:
      return t('project_status_completed')
    case ProjectStatusEnum.onHold:
      return t('project_status_on_hold')
    case ProjectStatusEnum.cancelled:
      return t('project_status_cancelled')
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
  <LegacyProjectCard v-if="!studio" :data="data" />
  <article
    v-else
    data-hse-project
    v-project-panels
    class="hse-project-root hse-project-card"
    :class="getProjectStatusClass(data.status)"
  >
    <RouterLink
      class="hse-project-card__cover"
      :to="`/organization/project-summary/${data.id}`"
      :aria-label="`${labels('open')}: ${data.title}`"
    />
    <!--   background:
    linear-gradient(180deg, rgb(9 37 70 / 5%), rgb(9 37 70 / 72%)),
    url('../assets/project-reference-sites.webp'); -->
    <div
      class="hse-project-card__photo"
      :style="{
        backgroundImage: `
        linear-gradient(
          180deg,
          rgb(9 37 70 / 5%),
          rgb(9 37 70 / 72%)
        ),
        url('${data.image || defaultProjectImage}')
      `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }"
    >
      <span
        v-if="data.status"
        class="hse-project-card__status"
        :class="getProjectStatusClass(data.status)"
        ><i></i>{{ GetProjectStatus(data.status) }}</span
      >
      <span class="hse-project-card__code">#{{ data.serialName }}</span>
    </div>
    <div class="hse-project-card__body">
      <h2 class="hse-project-card__title">{{ data.title }}</h2>
      <p v-if="data.partner?.title" class="hse-project-card__client">{{ data.partner.title }}</p>
      <div class="hse-project-card__delivery">
        <div>
          <span>{{ labels('setup') }}</span
          ><strong>{{ data.projectProgress || 0 }}%</strong>
        </div>
        <div
          class="hse-project-progress"
          role="progressbar"
          :aria-label="labels('setup')"
          :aria-valuenow="setupProgress"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span :style="{ width: `${setupProgress}%` }"></span>
        </div>
      </div>
      <div class="hse-project-card__locations">
        <CustomPopover identity>
          <template #btn>
            <ProjectIcon name="folder" /><span>{{ $t('locations') }}</span>
            <b>{{ data.locations?.length || 0 }}</b>
          </template>
          <template #content>
            <div class="hse-project-resource-list">
              <h4>
                <ProjectIcon name="folder" />{{ $t('locations')
                }}<b>{{ data.locations?.length || 0 }}</b>
              </h4>
              <ol v-if="data.locations?.length">
                <li v-for="(location, index) in data.locations" :key="location.id">
                  <span>{{ index + 1 }}</span
                  >{{ location.title }}
                </li>
              </ol>
              <p v-else>{{ $t('No data available') }}</p>
            </div>
          </template>
        </CustomPopover>
        <CustomPopover identity>
          <template #btn>
            <ProjectIcon name="grid" /><span>{{ $t('zones') }}</span>
            <b>{{ data.zoons?.length || 0 }}</b>
          </template>
          <template #content>
            <div class="hse-project-resource-list">
              <h4>
                <ProjectIcon name="grid" />{{ $t('zones') }}<b>{{ data.zoons?.length || 0 }}</b>
              </h4>
              <ol v-if="data.zoons?.length">
                <li v-for="(zone, index) in data.zoons" :key="zone.id">
                  <span>{{ index + 1 }}</span
                  >{{ zone.title }}
                </li>
              </ol>
              <p v-else>{{ $t('No data available') }}</p>
            </div>
          </template>
        </CustomPopover>
      </div>
      <div class="hse-project-card__facts">
        <div>
          <strong>{{ data.assigned_employees_count || 0 }}</strong
          ><span>{{ $t('employees') }}</span>
        </div>
        <div>
          <strong>{{ data.equipment_count || 0 }}</strong
          ><span>{{ $t('Equipment') }}</span>
        </div>
        <div>
          <strong>{{ data.inspections_count || 0 }}</strong
          ><span>{{ $t('Inspection') }}</span>
        </div>
      </div>

          <div class="hse-project-card__facts">
        <div>
          <strong>{{ data.observations_count + data.observation_hazards_count  }}</strong
          ><span>{{ $t('observation') }}</span>
        </div>
        <div>
          <strong>{{ data.observation_accidents_count || 0  }}</strong
          ><span>{{ $t('incident') }}</span>
        </div>
        <div>
          <strong>{{ data.investigation_count || 0}}</strong
          ><span>{{ $t('Investigation') }}</span>
        </div>
      </div>


  


      <footer class="hse-project-card__actions">
        <RouterLink
          class="hse-project-button hse-project-button--primary"
          :to="`/organization/project-summary/${data.id}`"
          >{{ labels('open') }}<ProjectIcon name="arrow-right"
        /></RouterLink>
        <details v-if="availableFlowSteps.length" class="hse-project-card__menu">
          <summary :aria-label="labels('actions')" :title="labels('actions')">•••</summary>
          <div class="hse-project-card__menu-panel">
            <button
              v-for="(label, index) in availableFlowSteps"
              :key="label"
              type="button"
              @click.prevent.stop="openFlow(index + 1, true)"
            >
              {{ label }}
            </button>
            <button
              v-if="data.projectStatus !== null && data.projectStatus < 5"
              type="button"
              @click.prevent.stop="openFlow(continueStep)"
            >
              {{ labels('continue') }} →
            </button>
          </div>
        </details>
      </footer>
    </div>
  </article>
</template>
