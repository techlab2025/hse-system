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
  subtitle?: string
  variant?: 'observation' | 'incident'
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
  <div :class="['idnex-header', `is-${variant || 'observation'}`]">
    <div class="index-title-row">
      <div class="index-title-content">
        <span class="index-title-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M8 8h8M8 12h8M8 16h5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <div class="index-title-copy">
          <div class="index-title-line">
            <h1 class="title">{{ title }}</h1>
            <span class="index-length"
              ><strong>{{ length || 0 }}</strong> Total</span
            >
          </div>
          <p v-if="subtitle" class="index-subtitle">{{ $t(subtitle) }}</p>
        </div>
      </div>

      <div class="index-primary-action">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="project-filter-content project-filter-panel">
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
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-width: 0;
}

.index-title-content {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.index-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  color: var(--PrimaryColor);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--PrimaryColor) 13%, transparent);
}

.is-incident .index-title-icon {
  border-color: color-mix(in srgb, var(--status-danger) 20%, transparent);
  background: color-mix(in srgb, var(--status-danger) 9%, var(--surface-1));
  color: var(--status-danger);
}

.index-title-icon svg {
  width: 26px;
  height: 26px;
}

.index-title-copy {
  min-width: 0;
}

.index-title-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.index-title-line .title,
.index-title-line .index-length,
.index-subtitle {
  margin: 0;
}

.index-title-line .title {
  color: var(--header-page-color);
  font-size: clamp(1.45rem, 2vw, 1.9rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1.15;
  text-transform: capitalize;
}

.index-title-line .index-length {
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
}

.index-title-line .index-length strong {
  font-size: 0.82rem;
  font-weight: 900;
}

.index-subtitle {
  margin-top: 5px;
  color: var(--GrayText-1);
  font-size: 0.78rem;
  font-weight: 600;
}

.index-primary-action {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.project-filter-content {
  min-width: 0;
  width: 100%;
}

.project-filter-panel {
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
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
  .index-title-row {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .index-title-content {
    align-items: flex-start;
  }

  .index-title-icon {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
  }

  .index-primary-action,
  .index-primary-action :deep(a),
  .index-primary-action :deep(button) {
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
