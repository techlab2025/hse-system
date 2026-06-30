<script setup lang="ts">
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel';
import { useProjectSelectStore } from '@/stores/ProjectSelect';
import { onMounted, watch } from 'vue';
import { ref } from 'vue'
const emit = defineEmits<{
  (e: 'update:data', value?: number): void
}>()
const props = defineProps<{
  projects: ProjectModel[]
  isForm?: boolean
}>()
const ActiveTap = ref(props.projects?.[0]?.id)
const AllProjects = ref(props.projects)

const UpdateData = (Id: number) => {
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
    if (newVal && newVal.length > 0) {
      if(props.isForm){

        ActiveTap.value = newVal[0].id
        emit('update:data', ActiveTap.value)
      }
    }
  },
  // { immediate: true }
)

watch(() => props.projects, (newVal) => {
  AllProjects.value = newVal
})
onMounted(() => {

})


const ProjectStore = useProjectSelectStore()
</script>
<template>
  <div class="idnex-header noborder" v-if="AllProjects && AllProjects.length > 1 && ProjectStore.showProjectsFilter()">
    <div class="categories-container">
      <button class="category" :class="ActiveTap === item.id ? 'active' : ''" v-for="(item, index) in AllProjects"
        :key="index" @click.prevent="UpdateData(item.id)">
        {{ item.title }}
      </button>
    </div>
  </div>
</template>
