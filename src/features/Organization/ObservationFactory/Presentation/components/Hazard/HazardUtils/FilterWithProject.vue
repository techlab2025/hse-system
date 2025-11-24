<script setup lang="ts">
import type Params from '@/base/core/params/params'
import type TitleInterface from '@/base/Data/Models/title_interface'
import type { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import { ref, onMounted, watch } from 'vue'

// Props
const props = defineProps<{
  pramsData?: Params
  staticOptions?: TitleInterface[]
  controllerData?: SelectControllerInterface<any>
  filterTitle: string
}>()

// Reactive state
const dynamicOptions = ref<any[]>([])
const selectedFilter = ref<Set<number>>(new Set())
const loading = ref(false)
const message = ref('Loading...')
const emit = defineEmits(['update:data'])

watch(selectedFilter, () => {
  emit('update:data', [...selectedFilter.value])
})

watch(
  () => props.pramsData,
  () => {
    fetchControllerData()
  },
)

// Fetch data from controller
const fetchControllerData = async () => {
  loading.value = true
  try {
    if (props.controllerData && props.pramsData) {
      const data = await props.controllerData.fetch(props.pramsData)
      console.log(data)

      dynamicOptions.value = data ?? []
    }

    if (props.staticOptions) {
      dynamicOptions.value = props.staticOptions
    }

    message.value = dynamicOptions.value.length === 0 ? 'No data available' : ''
  } catch (error) {
    message.value = 'Failed to load data'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Handle filter click
const updateData = (id: number) => {
  if (selectedFilter.value.has(id)) {
    selectedFilter.value.delete(id)
  } else {
    selectedFilter.value.add(id)
  }

  emit('update:data', [...selectedFilter.value])
}

// On mount, fetch options
onMounted(() => {
  fetchControllerData()
})
</script>

<template>
  <div class="idnex-filter !flex-col !items-start !p-0 !justify-start">
    <h5 class="!font-bold !text-sm">{{ props.filterTitle }}</h5>

    <div class="filter-container">
      <p
        v-for="zone in dynamicOptions"
        :key="zone.id"
        class="filter !text-sm !font-normal !px-6"
        :class="{ active: selectedFilter.has(zone.id) }"
        @click="updateData(zone.id)"
      >
        {{ zone.title }}
      </p>
    </div>

    <p v-if="loading">{{ message }}</p>
    <p v-else-if="dynamicOptions.length === 0">{{ message }}</p>
  </div>
</template>
