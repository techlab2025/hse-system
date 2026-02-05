<script setup lang="ts">
import type MyProjectsModel from '@/features/Organization/ObservationFactory/Data/models/MyProjectsModel'
import HeaderProjectsFilter from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/HeaderProjectsFilter.vue';
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { useProjectSelectStore } from '@/stores/ProjectSelect';
import { onMounted, ref, watch } from 'vue'
const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  length: number
  projects: MyProjectsModel[]
}>()
const ProjectSelectStore = useProjectSelectStore()
const ActiveTap = ref(ProjectSelectStore?.project?.id != -1 ? ProjectSelectStore?.project?.id : props.projects?.[0]?.id)

onMounted(() => {
  emit('update:data', ActiveTap.value)
})

const UpdateData = (Id: number) => {
  ActiveTap.value = Id
  emit('update:data', ProjectSelectStore?.project?.id != -1 ? ProjectSelectStore?.project?.id : ActiveTap.value)
}

const Projects = ref(props.projects)
watch(
  () => props.projects,
  (newValue) => {
    Projects.value = newValue
  }
)

const SelectedProjectId = ref<number>()
const GetProjectId = (id: number) => {
  SelectedProjectId.value = id
  UpdateData(id);
}
</script>
<template>

  <div class="idnex-header">
    <p class="title">{{ title }}</p>
    <p class="index-length">
      {{ $t('Total') }}: <span>{{ length }}</span>
    </p>
    <!-- <div class="categories-container" v-if="projects && projects.length > 1">
      <button
        class="category"
        :class="ActiveTap === item.id ? 'active' : ''"
        v-for="(item, index) in projects"
        :key="index"
        @click="UpdateData(item.id)"
      >
        {{ item.title }}
      </button>
    </div> -->
    <HeaderProjectsFilter class="noborder" :projects="projects" @update:data="GetProjectId" />
  </div>
</template>
