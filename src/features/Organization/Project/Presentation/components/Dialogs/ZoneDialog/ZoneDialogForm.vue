<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  locations: TitleInterface[]
}>()
const emit = defineEmits(['update:data'])

const AllLocations = ref(props.locations)

const Zones = ref<TitleInterface[]>([
  { id: 1, title: 'Nasr City', subtitle: 'Nasr City' },
  { id: 2, title: 'Heliopolis', subtitle: 'Nasr City' },
  { id: 3, title: 'Mokattam', subtitle: 'Nasr City' }
])

const SelectedZone = ref<Record<number, number[]>>({})

const initializeZones = (locations: TitleInterface[]) => {
  locations.forEach((loc) => {
    if (!SelectedZone.value[loc.id]) {
      SelectedZone.value[loc.id] = []
    }
  })
}

watch(
  () => props.locations,
  (newVal) => {
    AllLocations.value = newVal
    initializeZones(newVal)
  },
  { immediate: true }
)

onMounted(() => {
  initializeZones(AllLocations.value)
})
const UpdateData = () => {
  emit('update:data', SelectedZone.value)
}
</script>

<template>
  <div class="zone-form">
    <div class="zone-container" v-for="(location, index) in AllLocations" :key="location.id">
      <div class="location-header">
        <h2 class="title">
          Location: <span>{{ location.title }}</span>
        </h2>
      </div>


      <div class="zone-content-container">
        <div v-for="zone in Zones" :key="zone.id" class="zone-content" :class="{
          active: SelectedZone[location.id]?.includes(zone.id)
        }">
          <label :for="`${location.id}-${zone.id}`" class="zone-title">
            {{ zone.title }}
          </label>

          <input type="checkbox" :id="`${location.id}-${zone.id}`" :value="zone.id"
            v-model="SelectedZone[location.id]" />
        </div>
      </div>
    </div>

    <button class="confirm-btn btn btn-primary" @click="UpdateData">
      <span>Confirm</span>
    </button>
  </div>
</template>
