<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexProjectLocationZonesController from '../../../controllers/fetchLocationZonesController'
import IndexProjectLocationZonesParams from '@/features/Organization/Project/Core/params/fetchProjectLocationsZonesParams'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'

const props = defineProps<{
  locations: TitleInterface[]
  selectedZones?: SohwProjectZoonModel[]
}>()

const emit = defineEmits(['update:data'])

const AllLocations = ref<TitleInterface[]>(props.locations)
const AllZones = ref<SohwProjectZoonModel[]>([])

const SelectedZones = ref<{ locationId: number; ZoneIds: number[] }[]>(props.selectedZones)
// const SelectedZones = ref<{ locationId: number; ZoneIds: number[] }[]>([])


const GetZones = async () => {
  const params = new IndexProjectLocationZonesParams('', 1, 10, 1, AllLocations.value.map(l => l.id))
  const controller = IndexProjectLocationZonesController.getInstance()
  const response = await controller.getData(params)

  if (response.value.data) {
    AllZones.value = response.value.data
  }
}

const SelectedZoneTitles = ref<string[]>([])
const isZoneSelected = (locationId: number, zoneId: number) => {
  const loc = SelectedZones.value?.find(z => z.locationId === locationId)
  return loc ? loc.ZoneIds.includes(zoneId) : false
}


const UpdateSelectedZone = (locationId: number, zoneId: number, zoneTitle: string, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  let locationEntry = SelectedZones.value.find(z => z.locationId === locationId)

  if (!locationEntry) {
    if (checked) {
      SelectedZones.value.push({ locationId, ZoneIds: [zoneId] })
      SelectedZoneTitles.value.push(zoneTitle)
    }
    return
  }

  if (checked) {
    if (!locationEntry.ZoneIds.includes(zoneId)) locationEntry.ZoneIds.push(zoneId); SelectedZoneTitles.value.push(zoneTitle)
  } else {
    locationEntry.ZoneIds = locationEntry.ZoneIds.filter(id => id !== zoneId)
    if (locationEntry.ZoneIds.length === 0) {
      SelectedZones.value = SelectedZones.value.filter(z => z.locationId !== locationId)
    }
  }

}

onMounted(() => {
  GetZones()
})

const UpdateData = () => {
  emit('update:data', {
    zoonTitles: SelectedZoneTitles.value,
    zoonIds: SelectedZones.value
  })
}



</script>

<template>
  <div class="zone-form">
    <div class="zone-container" v-for="(location, index) in AllZones" :key="index">
      <div class="location-header">
        <h2 class="title">
          Location: <span>{{ location.zoonTitle }}</span>
        </h2>
      </div>

      <div class="zone-content-container">
        <div v-if="location.zoons?.length > 0" v-for="(zone, index2) in location.zoons" :key="index2" class="zone-content"
          :class="{ active: isZoneSelected(location.zoonId, zone.id) }">

          <label :for="`${location.zoonTitle}-${zone.title}-${zone.id}`" class="zone-title">
            {{ zone.title }}
          </label>
          <input type="checkbox" :id="`${location.zoonTitle}-${zone.title}-${zone.id}`"
            :checked="isZoneSelected(location.zoonId, zone.id)"
            @change="UpdateSelectedZone(location.zoonId, zone.id, zone?.title, $event)" />

        </div>
        <div v-else class="empty-zone"> No Available Zones</div>

      </div>
    </div>
    <button class="confirm-btn btn btn-primary" @click="UpdateData">
      <span>Confirm</span>
    </button>
  </div>
</template>
