  <script setup lang="ts">
  import type MyProjectsModel from '@/features/Organization/ObservationFactory/Data/models/MyProjectsModel'
  import { ref } from 'vue'
  import HeaderProjectsFilter from './HeaderProjectsFilter.vue';
  import { useProjectSelectStore } from '@/stores/ProjectSelect';
  const emit = defineEmits(['update:data'])
  const props = defineProps<{
    title: string
    length: number
    projects: MyProjectsModel[]
  }>()
  const projectSelectStore = useProjectSelectStore()
  const ActiveTap = ref(projectSelectStore?.project?.id != -1 ? projectSelectStore?.project?.id : props.projects?.[0]?.id)
  const UpdateData = (Id: number) => {
    ActiveTap.value = Id
    emit('update:data', projectSelectStore?.project?.id != -1 ? projectSelectStore?.project?.id : ActiveTap.value)
  }

</script>
  <template>
    <div class="idnex-header">
      <p class="title">{{ title }}</p>
      <p class="index-length">
        Total: <span>{{ length }}</span>
      </p>
      <HeaderProjectsFilter class="noborder" :projects="projects" @update:data="UpdateData" />
    </div>
  </template>
