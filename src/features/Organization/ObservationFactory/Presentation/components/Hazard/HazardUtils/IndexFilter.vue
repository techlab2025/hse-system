<script setup lang="ts">
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import { computed, ref } from 'vue'
const emit = defineEmits(['update:data'])

const props = defineProps<{
  filters: MyZonesModel[]
  selectedZoneIds?: number[]
  link?: string
  linkTitle?: string
}>()

const localSelectedFilter = ref<number[]>([])
const SelectedFilter = computed(() => props.selectedZoneIds ?? localSelectedFilter.value)

const UpdateData = (data: number) => {
  const selection = SelectedFilter.value.includes(data)
    ? SelectedFilter.value.filter((id) => id !== data)
    : [...SelectedFilter.value, data]
  localSelectedFilter.value = selection
  emit('update:data', selection)
}
</script>
<template>
  <div class="idnex-filter">
    <div class="filter-container">
      <p
        class="filter"
        :class="SelectedFilter.includes(item.ProjectZoneId) ? 'active' : ''"
        v-for="item in filters"
        :key="item.ProjectZoneId"
        @click="UpdateData(item.ProjectZoneId)"
      >
        <span v-if="item?.title != null">
          {{ item?.title }}
        </span>
      </p>
    </div>
  </div>
</template>
