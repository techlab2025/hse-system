  <script setup lang="ts">
  import type MyProjectsModel from '@/features/Organization/ObservationFactory/Data/models/MyProjectsModel'
  import { ref } from 'vue'
  import HeaderProjectsFilter from './HeaderProjectsFilter.vue';
  const emit = defineEmits(['update:data'])
  const props = defineProps<{
    title: string
    length: number
    projects: MyProjectsModel[]
  }>()
  const ActiveTap = ref(props.projects?.[0]?.id)
  const UpdateData = (Id: number) => {
    ActiveTap.value = Id
    emit('update:data', ActiveTap.value)
  }

</script>
  <template>
    <div class="idnex-header">
      <p class="title">{{ title }}</p>
      <p class="index-length">
        Total: <span>{{ length }}</span>
      </p>
      <HeaderProjectsFilter :projects="projects" @update:data="UpdateData" />
    </div>
  </template>
