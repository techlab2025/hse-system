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
      <p class="title">{{ title }}</p>
      <p class="index-length">
        {{ $t('Total') }}: <span>{{ length }}</span>
      </p>
    </div>

    <div class="index-project-filter-row">
      <div class="project-filter-content">
        <HeaderProjectsFilter class="noborder" :projects="projects" @update:data="GetProjectId" />
      </div>

      <div class="index-header-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.idnex-header {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 14px;
}

.index-title-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.index-title-row .title,
.index-title-row .index-length {
  margin: 0;
}

.index-title-row .index-length {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--GrayText-1);
  font-size: 0.72rem;
  font-weight: 700;
}

.index-title-row .index-length span {
  color: var(--PrimaryColor);
  font-size: 0.78rem;
  font-weight: 900;
}

.index-project-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  width: 100%;
}

.project-filter-content {
  min-width: 0;
  flex: 1;
}

.index-header-actions {
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .index-project-filter-row {
    align-items: stretch;
    flex-direction: column;
  }

  .index-header-actions,
  .index-header-actions :deep(a),
  .index-header-actions :deep(button) {
    width: 100%;
  }
}
</style>
