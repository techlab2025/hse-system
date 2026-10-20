<script setup lang="ts">
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import { computed, ref } from 'vue'
import { useThemeMode } from '@/composables/useThemeMode'
const emit = defineEmits(['update:data'])
const { isDarkMode } = useThemeMode()

const props = defineProps<{
  filters: MyZonesModel[]
  selectedZoneIds?: number[]
  link: string
  linkTitle: string
  SelectdProject: number[]
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
  <div :class="['idnex-filter', { 'is-dark': isDarkMode }]">
    <div class="filter-container">
      <div
        class="filter"
        :class="SelectedFilter.includes(item.id) ? 'active' : ''"
        v-for="item in filters"
        :key="item.id"
        @click="UpdateData(item.id)"
      >
        <p v-if="item?.title != null">
          <span>
            {{ item?.title }}
          </span>
        </p>
      </div>
    </div>
    <div class="btns">
      <!-- <button class="btn btn-filter">
          <span>Filter</span>
          <IndexFilterIcon />
        </button> -->

      <router-link :to="link" v-if="link != ''">
        <button class="btn btn-primary">{{ linkTitle }}</button>
      </router-link>
    </div>
  </div>
</template>
