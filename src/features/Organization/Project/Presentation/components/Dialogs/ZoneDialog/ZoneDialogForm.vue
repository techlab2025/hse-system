<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexProjectLocationZonesController from '../../../controllers/fetchLocationZonesController'
import IndexProjectLocationZonesParams from '@/features/Organization/Project/Core/params/fetchProjectLocationsZonesParams'
import type ZoonModel from '@/features/Organization/Project/Data/models/ZoonModel'
import type ProjectLocationZonesModel from '@/features/Organization/Project/Data/models/ProjectLocationZones'

const props = defineProps<{
  locations: TitleInterface[]
  selectedZones?: ProjectLocationZonesModel[]
}>()

const emit = defineEmits(['update:data'])


const AllLocations = ref<TitleInterface[]>(props.locations)
const AllZones = ref<ProjectLocationZonesModel[]>([])
const SelectedZone = ref<Record<number, number[]>>({})


const GetZones = async () => {
  const params = new IndexProjectLocationZonesParams('', 1, 10, 1, AllLocations.value.map((l) => l.id))
  const controller = IndexProjectLocationZonesController.getInstance()
  const response = await controller.getData(params)

  if (response.value.data) {
    AllZones.value = response.value.data
  }
}


const initializeZones = (locations: TitleInterface[]) => {
  locations.forEach((loc) => {
    if (!SelectedZone.value[loc.id]) {
      SelectedZone.value[loc.id] = []
    }
  })
}


const UpdateData = () => {
  const result = Object.entries(SelectedZone.value)
    .map(([locationId, zoneIds]) => {
      const locationObj = props.locations.find((l) => l.id === Number(locationId))
      if (!locationObj) return null

      const locationZones = AllZones.value.find(
        (lz) => lz.location.id === Number(locationId)
      )?.zoons || []

      const selectedZoons = (zoneIds as number[])
        .map((id) => locationZones.find((z) => z.id === id))
        .filter((z): z is ZoonModel => !!z)

      if (selectedZoons.length === 0) return null

      return {
        location: locationObj,
        zoons: selectedZoons,
      }
    })
    .filter((item): item is { location: TitleInterface; zoons: ZoonModel[] } => !!item)

  emit('update:data', result)
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
  GetZones()

  if (props.selectedZones && props.selectedZones.length > 0) {
    props.selectedZones.forEach((loc) => {
      SelectedZone.value[loc.location.id] = loc.zoons.map((z) => z.id)
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
        <div v-for="zone in (AllZones.find((z) => z.location.id === location.id)?.zoons || [])" :key="zone.id"
          class="zone-content" :class="{ active: SelectedZone[location.id]?.includes(zone.id) }">
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

<style scoped></style>
