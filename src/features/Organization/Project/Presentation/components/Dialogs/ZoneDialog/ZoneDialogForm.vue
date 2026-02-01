<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexProjectLocationZonesController from '../../../controllers/fetchLocationZonesController'
import IndexProjectLocationZonesParams from '@/features/Organization/Project/Core/params/fetchProjectLocationsZonesParams'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'

const controller = IndexProjectLocationZonesController.getInstance()
const state = ref(controller?.state?.value)

const props = defineProps<{
  locations: TitleInterface[]
  selectedZones?: SohwProjectZoonModel[]
}>()

const emit = defineEmits(['update:data'])

const AllLocations = ref<TitleInterface[]>(props.locations)
const AllZones = ref<SohwProjectZoonModel[]>([])

// Store selections as a Map for better lookup performance
const SelectedZonesMap = ref<Map<number, Set<number>>>(new Map())
const SelectedZoneTitles = ref<Map<number, string>>(new Map())

// Initialize from props
const initializeFromProps = () => {
  SelectedZonesMap.value.clear()
  SelectedZoneTitles.value.clear()

  if (props.selectedZones && props.selectedZones.length > 0) {
    props.selectedZones.forEach(location => {
      if (location.zoons && location.zoons.length > 0) {
        const zoneIdsSet = new Set<number>()

        location.zoons.forEach(zone => {
          zoneIdsSet.add(zone.id)
          SelectedZoneTitles.value.set(zone.id, zone.title || zone.titles?.[0]?.title || '')
        })

        SelectedZonesMap.value.set(location.zoonId, zoneIdsSet)
      }
    })
  }

  console.log('ZoneDialogForm - Initialized SelectedZonesMap:', SelectedZonesMap.value)
}

const GetZones = async () => {
  const params = new IndexProjectLocationZonesParams('', 1, 10, 1, AllLocations.value.map(l => l.id))
  const response = await controller.getData(params)

  if (response.value.data) {
    AllZones.value = response.value.data
    console.log('ZoneDialogForm - Fetched AllZones:', AllZones.value)
    // After zones are loaded, initialize selections
    initializeFromProps()
  }
}

const isZoneSelected = (locationId: number, zoneId: number) => {
  const locationZones = SelectedZonesMap.value.get(locationId)
  return locationZones ? locationZones.has(zoneId) : false
}

const UpdateSelectedZone = (locationId: number, zoneId: number, zoneTitle: string, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked

  if (checked) {
    // Add zone
    if (!SelectedZonesMap.value.has(locationId)) {
      SelectedZonesMap.value.set(locationId, new Set())
    }
    SelectedZonesMap.value.get(locationId)!.add(zoneId)
    SelectedZoneTitles.value.set(zoneId, zoneTitle)
  } else {
    // Remove zone
    const locationZones = SelectedZonesMap.value.get(locationId)
    if (locationZones) {
      locationZones.delete(zoneId)
      if (locationZones.size === 0) {
        SelectedZonesMap.value.delete(locationId)
      }
    }
    SelectedZoneTitles.value.delete(zoneId)
  }
}

const UpdateData = () => {
  // Convert Map to array format
  const zoonIds: { locationId: number; ZoneIds: number[] }[] = []
  const zoonTitles: string[] = []
  const fullZoneData: SohwProjectZoonModel[] = []

  SelectedZonesMap.value.forEach((zoneIds, locationId) => {
    if (zoneIds.size > 0) {
      zoonIds.push({
        locationId,
        ZoneIds: Array.from(zoneIds)
      })

      // Find the location in AllZones to build full structure
      const locationData = AllZones.value.find(loc => loc.zoonId === locationId)
      if (locationData) {
        const selectedZonesForLocation = locationData.zoons?.filter(zone =>
          zoneIds.has(zone.id)
        ) || []

        fullZoneData.push({
          zoonId: locationData.zoonId,
          zoonTitle: locationData.zoonTitle,
          zoons: selectedZonesForLocation
        })

        // Add titles
        selectedZonesForLocation.forEach(zone => {
          const title = zone.title || zone.titles?.[0]?.title || ''
          zoonTitles.push(title)
        })
      }
    }
  })

  console.log('ZoneDialogForm - Emitting data:', { zoonTitles, zoonIds, fullZoneData })

  emit('update:data', {
    zoonTitles,
    zoonIds,
    fullZoneData
  })
}

onMounted(() => {
  GetZones()
})

// Watch for prop changes
watch(() => props.selectedZones, (newVal) => {
  console.log('ZoneDialogForm - Props selectedZones changed:', newVal)
  if (AllZones.value.length > 0) {
    initializeFromProps()
  }
}, { deep: true, immediate: true })

watch(() => props.locations, () => {
  AllLocations.value = props.locations
  GetZones()
}, { deep: true })

watch(() => controller.state.value, (newState) => {
  state.value = newState
})
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="zone-form">
        <div class="zone-container" v-for="(location, index) in AllZones" :key="index">
          <div class="location-header">
            <h2 class="title">
              {{ $t('Location') }}: <span>{{ location.zoonTitle }}</span>
            </h2>
          </div>

          <div class="zone-content-container">
            <div v-if="location.zoons?.length > 0" v-for="(zone, index2) in location.zoons" :key="index2"
              class="zone-content" :class="{ active: isZoneSelected(location.zoonId, zone.id) }">

              <label :for="`${location.zoonTitle}-${zone.title}-${zone.id}`" class="zone-title">
                {{ zone.title }}
              </label>
              <input type="checkbox" :id="`${location.zoonTitle}-${zone.title}-${zone.id}`"
                :checked="isZoneSelected(location.zoonId, zone.id)"
                @change="UpdateSelectedZone(location.zoonId, zone.id, zone?.title, $event)" />
            </div>
            <div v-else class="empty-zone">{{ $t('No Available Zones') }}</div>
          </div>
        </div>
        <button class="confirm-btn btn btn-primary" @click="UpdateData">
          <span>{{ $t('confirm') }}</span>
        </button>
      </div>
    </template>
  </DataStatus>
</template>
