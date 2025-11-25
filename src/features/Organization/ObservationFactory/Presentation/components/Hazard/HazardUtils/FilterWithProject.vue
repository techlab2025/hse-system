<!-- FilterWithProject.vue -->
<script setup lang="ts">
import type Params from '@/base/core/params/params'
import type TitleInterface from '@/base/Data/Models/title_interface'
import type { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  pramsData?: Params
  staticOptions?: TitleInterface[]
  controllerData?: SelectControllerInterface<any>
  filterTitle: string
  modelValue?: number[]
}>()

const emit = defineEmits(['update:modelValue'])

const dynamicOptions = ref<any[]>([])
const loading = ref(false)
const message = ref('Loading...')

// selectedFilter internal state synced with parent
const selectedFilter = ref<Set<number>>(new Set(props.modelValue ?? []))

watch(
  () => props.modelValue,
  (newVal) => {
    selectedFilter.value = new Set(newVal ?? [])
  },
)

const updateSelected = () => {
  emit('update:modelValue', [...selectedFilter.value])
}

// Fetch data
const fetchControllerData = async () => {
  loading.value = true
  try {
    if (props.controllerData && props.pramsData) {
      const data = await props.controllerData.fetch(props.pramsData)
      dynamicOptions.value = data ?? []
    } else if (props.staticOptions) {
      dynamicOptions.value = props.staticOptions
    }

    message.value = dynamicOptions.value.length === 0 ? 'No data available' : ''
  } catch (e) {
    console.error(e)
    message.value = 'Failed to load data'
  } finally {
    loading.value = false
  }
}

// Toggle item
const toggleItem = (id: number) => {
  if (selectedFilter.value.has(id)) {
    selectedFilter.value.delete(id)
  } else {
    selectedFilter.value.add(id)
  }
  updateSelected()
}

onMounted(fetchControllerData)
</script>

<template>
  <div class="idnex-filter !flex-col !items-start !p-0 !justify-start">
    <h5 class="!font-bold !text-sm">{{ filterTitle }}</h5>

    <div class="filter-container">
      <p
        v-for="zone in dynamicOptions"
        :key="zone.id"
        class="filter !text-sm !font-normal !px-6"
        :class="{ active: selectedFilter.has(zone.id) }"
        @click="toggleItem(zone.id)"
      >
        {{ zone.title }}
      </p>
    </div>

    <p v-if="loading">{{ message }}</p>
    <p v-else-if="dynamicOptions.length === 0">{{ message }}</p>
  </div>
</template>
