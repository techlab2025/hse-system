  <script setup lang="ts">
  import { ref } from 'vue'
  import HeaderProjectsFilter from './HeaderProjectsFilter.vue';
  import { useProjectSelectStore } from '@/stores/ProjectSelect';
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel.ts';
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
  const ActiveTap = ref(projectSelectStore?.project?.id == -1 || !(projectSelectStore?.project?.id) ? projectSelectStore?.project?.id : props.projects?.[0]?.id)
  const UpdateData = (Id?: number) => {
    ActiveTap.value = projectSelectStore?.project?.id == -1 || !(projectSelectStore?.project?.id) ? Id : projectSelectStore?.project?.id
    emit('update:data', ActiveTap.value)
  }

</script>
  <template>
    <div class="idnex-header">
      <p class="title">{{ title }}</p>
      <p class="index-length">
        Total: <span>{{ length || 0 }}</span>
      </p>
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
  </template>

<style scoped>
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
  background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 50%, #eef2f7 75%);
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
