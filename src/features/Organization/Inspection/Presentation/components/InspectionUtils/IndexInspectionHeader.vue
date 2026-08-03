<script setup lang="ts">
import type MyProjectsModel from '@/features/Organization/ObservationFactory/Data/models/MyProjectsModel'
import HeaderProjectsFilter from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/HeaderProjectsFilter.vue'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import { onMounted, ref, watch } from 'vue'
import { useThemeMode } from '@/composables/useThemeMode'
const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  length: number
  projects: MyProjectsModel[]
  isProject?: number
}>()
const ProjectSelectStore = useProjectSelectStore()
const { isDarkMode } = useThemeMode()
const ActiveTap = ref(
  ProjectSelectStore?.project?.id != -1 ? ProjectSelectStore?.project?.id : props.projects?.[0]?.id,
)

onMounted(() => {
  emit('update:data', ActiveTap.value)
})

const UpdateData = (Id: number) => {
  ActiveTap.value = Id
  emit(
    'update:data',
    ProjectSelectStore?.project?.id != -1 && ProjectSelectStore?.project?.id != null
      ? ProjectSelectStore?.project?.id
      : ActiveTap.value,
  )
}

const Projects = ref(props.projects)
watch(
  () => props.projects,
  (newValue) => {
    Projects.value = newValue
  },
)

const SelectedProjectId = ref<number>()
const GetProjectId = (id: number) => {
  SelectedProjectId.value = id
  UpdateData(id)
}
</script>
<template>
  <div :class="['idnex-header', { 'is-dark': isDarkMode }]">
    <div class="index-title-row">
      <div class="inspection-title-content">
        <span class="inspection-title-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5h6M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H16"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="m8.5 13 2 2 5-5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <div class="inspection-title-copy">
          <div class="inspection-title-line">
            <h1 class="title">{{ title }}</h1>
            <span class="index-length">
              <strong>{{ length || 0 }}</strong>
              {{ $t('Total') }}
            </span>
          </div>
          <p class="inspection-subtitle">
            {{ $t('Manage, filter, and review workplace inspections') }}
          </p>
        </div>
      </div>

      <div class="inspection-primary-action">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="inspection-project-panel" v-if="!isProject">
      <HeaderProjectsFilter class="noborder" :projects="projects" @update:data="GetProjectId" />
    </div>
  </div>
</template>

<style scoped>
.idnex-header {
  position: relative;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 18px;
}

.index-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-width: 0;
}

.inspection-title-content {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.inspection-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  border-radius: 16px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--PrimaryColor) 16%, transparent), transparent),
    var(--surface-1);
  color: var(--PrimaryColor);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--PrimaryColor) 13%, transparent);
}

.inspection-title-icon svg {
  width: 27px;
  height: 27px;
}

.inspection-title-copy {
  min-width: 0;
}

.inspection-title-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.inspection-title-line .title,
.inspection-title-line .index-length,
.inspection-subtitle {
  margin: 0;
}

.inspection-title-line .title {
  color: var(--header-page-color);
  font-size: clamp(1.45rem, 2vw, 1.9rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1.15;
  text-transform: capitalize;
}

.inspection-title-line .index-length {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1;
}

.inspection-title-line .index-length strong {
  font-size: 0.82rem;
  font-weight: 900;
}

.inspection-subtitle {
  margin-top: 5px;
  color: var(--GrayText-1);
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.45;
}

.inspection-project-panel {
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 65%, transparent);
}

.inspection-primary-action {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .idnex-header {
    gap: 14px;
  }

  .inspection-title-content {
    align-items: flex-start;
  }

  .index-title-row {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .inspection-primary-action,
  .inspection-primary-action :deep(a),
  .inspection-primary-action :deep(button) {
    width: 100%;
  }

  .inspection-title-icon {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
    border-radius: 14px;
  }

  .inspection-title-icon svg {
    width: 23px;
    height: 23px;
  }

  .inspection-title-line {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
  }

  .inspection-project-panel {
    padding: 12px;
  }
}
</style>
