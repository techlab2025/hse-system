<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import { ref, computed } from 'vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  filters: TitleInterface[]
  link: string
  linkText: string
  icon: string
}>()


const staticZones = ref([
  { zoonId: 1, zoonTitle: 'show all' },
  { zoonId: 2, zoonTitle: 'incedant' },
  { zoonId: 3, zoonTitle: 'observation' },
])

const SelectedFilter = ref<Set<number>>(new Set())

const allZones = computed(() => staticZones.value)

const UpdateData = (id: number) => {
  SelectedFilter.value.has(id) ? SelectedFilter.value.delete(id) : SelectedFilter.value.add(id)
  // emit('update:data', [...SelectedFilter.value])
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
