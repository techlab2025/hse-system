<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '@/features/Organization/Project/Presentation/controllers/ProjectCustomLocationController'
import IndexFilterIcon from '@/shared/icons/IndexFilterIcon.vue'
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  filters: TitleInterface[]
  link: string
  linkText: string
}>()

const SelectedFilter = ref<Set<number>>(new Set())

const controller = ProjectCustomLocationController.getInstance()
const state = ref(controller.state.value)

const loadProjectLocations = async () => {
  const params = new ProjectCustomLocationParams(37, [ProjectCustomLocationEnum.ZOON], [])

  await controller.getData(params)
}

onMounted(loadProjectLocations)

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
)

const allZones = computed(() => {
  if (!state.value?.data) return []
  return state.value.data.flatMap((item) => item.locationZones || [])
})

const UpdateData = (id: number) => {
  SelectedFilter.value.has(id) ? SelectedFilter.value.delete(id) : SelectedFilter.value.add(id)

  emit('update:data', [...SelectedFilter.value])
}
</script>

<template>
  <div class="idnex-filter">
    <div class="filter-container">
      <p
        v-for="zone in allZones"
        :key="zone.zoonId"
        class="filter"
        :class="{ active: SelectedFilter.has(zone.zoonId) }"
        @click="UpdateData(zone.zoonId)"
      >
        {{ zone.zoonTitle }}
      </p>
    </div>
  </div>
</template>
