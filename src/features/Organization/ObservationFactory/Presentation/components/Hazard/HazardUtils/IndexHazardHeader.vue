<script setup lang="ts">
import { ref } from 'vue'
import HeaderProjectsFilter from './HeaderProjectsFilter.vue'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel.ts'

const emit = defineEmits<{
  (e: 'update:data', value?: number): void
}>()
const props = defineProps<{
  title: string
  length: number
  projects: ProjectModel[]
  isProjectsLoading?: boolean
}>()
const projectSelectStore = useProjectSelectStore()
const ActiveTap = ref(
  projectSelectStore?.project?.id == -1 || !projectSelectStore?.project?.id
    ? projectSelectStore?.project?.id
    : props.projects?.[0]?.id,
)
const UpdateData = (Id?: number) => {
  ActiveTap.value =
    projectSelectStore?.project?.id == -1 || !projectSelectStore?.project?.id
      ? Id
      : projectSelectStore?.project?.id
  emit('update:data', ActiveTap.value)
}
</script>

<template>
  <div class="idnex-header">
    <div class="index-title-row">
      <p class="title">{{ title }}</p>
      <p class="index-length">
        Total: <span>{{ length || 0 }}</span>
      </p>
    </div>

    <div class="index-project-filter-row">
      <div class="project-filter-content">
        <div v-if="isProjectsLoading" class="projects-filter-skeleton" aria-hidden="true">
          <span v-for="item in 4" :key="item"></span>
        </div>
        <HeaderProjectsFilter
          v-else
          class="noborder"
          :projects="projects"
          @update:data="UpdateData"
        />
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

.projects-filter-skeleton {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  overflow: hidden;
}

.projects-filter-skeleton span {
  width: 120px;
  height: 38px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--brand-primary-50) 25%,
    var(--brand-primary-50) 50%,
    var(--brand-primary-50) 75%
  );
  background-size: 220% 100%;
  animation: projects-filter-shimmer 1.2s linear infinite;
}

.projects-filter-skeleton span:nth-child(2) {
  width: 150px;
}

.projects-filter-skeleton span:nth-child(3) {
  width: 105px;
}

@keyframes projects-filter-shimmer {
  0% {
    background-position: 220% 0;
  }

  100% {
    background-position: -220% 0;
  }
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

  .projects-filter-skeleton {
    width: 100%;
    overflow-x: hidden;
  }

  .projects-filter-skeleton span {
    min-width: 96px;
    width: 96px;
  }
}
</style>
