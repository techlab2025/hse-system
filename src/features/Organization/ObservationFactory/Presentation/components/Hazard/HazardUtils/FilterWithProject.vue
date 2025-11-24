<script setup lang="ts">
import type Params from '@/base/core/params/params'
import type { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  pramsData: Params
  controllerData: ControllerInterface<any>
  filterTitle: string
}>()

const emit = defineEmits(['update:data'])

const SelectedFilter = ref<Set<number>>(new Set())
const dynamicOptions = ref<any[]>([])
const loading = ref(false)
const message = ref('')

// Fetch options when props change
const fetchOptions = async () => {
  if (!props.controllerData || !props.pramsData) return
  try {
    loading.value = true
    message.value = 'Loading...'

    const response = await props.controllerData.state.value.data
    console.log(response, 'sdadas')
    dynamicOptions.value = response
    updateControllerState()
  } catch (error) {
    message.value = 'Error loading data'
  } finally {
    loading.value = false
  }
}

const updateControllerState = () => {
  if (props.controllerData.isDataFailed()) {
    message.value = 'An Error Occurred'
  } else if (props.controllerData.isDataSuccess() && dynamicOptions.value.length === 0) {
    message.value = 'No Data Found'
  }
}

// Emit selected filters
const UpdateData = (id: number) => {
  SelectedFilter.value.has(id) ? SelectedFilter.value.delete(id) : SelectedFilter.value.add(id)
  emit('update:data', [...SelectedFilter.value])
}

watch([() => props.pramsData, () => props.controllerData], fetchOptions, { immediate: true })
onMounted(fetchOptions)
</script>

<template>
  <div class="index-filter">
    <h5>{{ props.filterTitle }}</h5>

    <div class="filter-container">
      <p
        v-for="zone in dynamicOptions"
        :key="zone.zoonId"
        class="filter"
        :class="{ active: SelectedFilter.has(zone.zoonId) }"
        @click="UpdateData(zone.zoonId)"
      >
        {{ zone.zoonTitle }}
      </p>
    </div>

    <p v-if="loading">{{ message }}</p>
    <p v-else-if="dynamicOptions.length === 0">{{ message }}</p>
  </div>
</template>
