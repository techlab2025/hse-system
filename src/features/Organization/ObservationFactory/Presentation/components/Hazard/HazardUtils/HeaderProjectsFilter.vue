<script setup lang="ts">
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'update:data', value?: number): void
}>()
const props = defineProps<{
  projects: ProjectModel[]
  isForm?: boolean
}>()

const ProjectStore = useProjectSelectStore()
const selectedProjectId = ProjectStore.getProjectId()
const ActiveTap = ref<number | undefined>(
  selectedProjectId !== -1 && selectedProjectId != null
    ? selectedProjectId
    : props.isForm
      ? props.projects?.[0]?.id
      : undefined,
)
const AllProjects = ref(props.projects)

const UpdateData = (Id?: number) => {
  if (!props.isForm && ActiveTap.value === Id) {
    ActiveTap.value = undefined
    emit('update:data', undefined)
    return
  }

  ActiveTap.value = Id
  emit('update:data', ActiveTap.value)
}
watch(
  () => props.projects,
  (newVal) => {
    AllProjects.value = newVal

    if (newVal && newVal.length > 0) {
      if (props.isForm) {
        ActiveTap.value = newVal[0].id
        emit('update:data', ActiveTap.value)
      } else if (ProjectStore.getProjectId() === -1 || ProjectStore.getProjectId() == null) {
        ActiveTap.value = undefined
      }
    }
  },
)

watch(
  () => ProjectStore.getProjectId(),
  (projectId) => {
    ActiveTap.value = projectId === -1 || projectId == null ? undefined : projectId
  },
)
</script>

<template>
  <div
    v-if="AllProjects && AllProjects.length > 1 && ProjectStore.showProjectsFilter()"
    class="idnex-header noborder"
  >
    <!-- <div class="project-filter-heading">
      <span class="project-filter-symbol" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <div>
        <p>{{ $t('Projects') }}</p>
        <span>{{ $t('Select a project to filter the displayed records') }}</span>
      </div>
    </div> -->

    <div class="project-filter-controls">
      <div class="categories-container">
        <button
          v-if="!props.isForm"
          type="button"
          class="category"
          :class="{ active: ActiveTap === undefined }"
          @click.prevent="UpdateData(undefined)"
        >
          {{ $t('all') }}
        </button>
        <button
          v-for="(item, index) in AllProjects"
          :key="index"
          type="button"
          class="category"
          :class="ActiveTap === item.id ? 'active' : ''"
          @click.prevent="UpdateData(item.id)"
        >
          {{ item.title }}
        </button>
      </div>

      <div class="project-filter-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-filter-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.project-filter-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
}

.project-filter-symbol svg {
  width: 18px;
  height: 18px;
}

.project-filter-heading p {
  margin: 0;
  color: var(--header-page-color);
  font-size: 0.84rem;
  font-weight: 900;
}

.project-filter-heading div > span {
  color: var(--GrayText-1);
  font-size: 0.72rem;
  font-weight: 600;
}

.project-filter-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.categories-container {
  min-width: 0;
  flex: 1;
}

.project-filter-actions {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .project-filter-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .project-filter-actions,
  .project-filter-actions :deep(a),
  .project-filter-actions :deep(button) {
    width: 100%;
  }
}
</style>
