<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  locations: TitleInterface[]
    selectedZones?: { locationId: number, zones: { id: number, title: string }[] }[]

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
  const result = Object.entries(SelectedZone.value).map(([locationId, zoneIds]) => {
    const selectedZones = (zoneIds as number[])
      .map((id) => {
        const zone = Zones.value.find((z) => z.id === id)
        return zone ? { id: zone.id, title: zone.title } : null
      })
      .filter((z) => z !== null)

    return {
      locationId: Number(locationId),
      locationName: props.locations.find((l) => l.id === Number(locationId))?.title,
      zones: selectedZones
    }
  })

  emit('update:data', result)
}

onMounted(() => {
  initializeZones(AllLocations.value)
  if (props.selectedZones) {
    props.selectedZones.forEach((loc) => {
      SelectedZone.value[loc.locationId] = loc.zones.map((z) => z.id)
    })
  }
})
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
