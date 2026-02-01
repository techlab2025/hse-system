<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref, watch } from 'vue'
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import ZoneDialogForm from './ZoneDialogForm.vue'
import CloseDelete from '@/shared/icons/CloseDelete.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'

const visible = ref(false)
const emit = defineEmits(['update:data'])
const props = defineProps<{
  locations: TitleInterface[]
  selectedZones: SohwProjectZoonModel[]
}>()

// Merge existing selections with new ones
const mergedSelectedZones = ref<SohwProjectZoonModel[]>([])
const currentZoneTitles = ref<string[]>([])

const initializeFromProps = () => {
  mergedSelectedZones.value = [...props.selectedZones]
  currentZoneTitles.value = []

  props.selectedZones.forEach(location => {
    if (location.zoons && location.zoons.length > 0) {
      location.zoons.forEach(zone => {
        const title = zone.title || zone.titles?.[0]?.title || 'Unknown'
        currentZoneTitles.value.push(title)
      })
    }
  })

  console.log('AddZoneDialog - Initialized:', { mergedSelectedZones: mergedSelectedZones.value, currentZoneTitles: currentZoneTitles.value })
}

initializeFromProps()

watch(
  () => props.selectedZones,
  (newVal) => {
    console.log('AddZoneDialog - Props selectedZones changed:', newVal)
    initializeFromProps()
  },
  { deep: true }
)

const GetData = (data: {
  zoonTitles: string[],
  zoonIds: { locationId: number; ZoneIds: number[] }[],
  fullZoneData?: SohwProjectZoonModel[]
}) => {
  console.log('AddZoneDialog - Received data from form:', data)

  currentZoneTitles.value = data.zoonTitles

  // Update merged selections with the full structure if provided
  if (data.fullZoneData) {
    mergedSelectedZones.value = data.fullZoneData
  }

  visible.value = false

  // Emit the structured data
  emit('update:data', data.zoonIds)

  console.log('AddZoneDialog - Emitted to parent:', data.zoonIds)
}

const deleteZone = (index: number) => {
  const titleToDelete = currentZoneTitles.value[index]
  console.log('AddZoneDialog - Deleting zone at index:', index, 'Title:', titleToDelete)

  currentZoneTitles.value.splice(index, 1)

  // Remove from merged selections
  let globalIndex = 0
  for (let i = 0; i < mergedSelectedZones.value.length; i++) {
    const location = mergedSelectedZones.value[i]
    if (!location.zoons) continue

    for (let j = 0; j < location.zoons.length; j++) {
      if (globalIndex === index) {
        location.zoons.splice(j, 1)
        if (location.zoons.length === 0) {
          mergedSelectedZones.value.splice(i, 1)
        }

        // Convert back to the format expected by parent
        const dataToEmit = mergedSelectedZones.value.map(loc => ({
          locationId: loc.zoonId,
          ZoneIds: loc.zoons?.map(z => z.id) || []
        }))

        console.log('AddZoneDialog - After delete, emitting:', dataToEmit)
        emit('update:data', dataToEmit)
        return
      }
      globalIndex++
    }
  }
}
</script>

<template>
  <div class="input-wrapper">
    <div class="zones input" @click="visible = true">
      <div class="zone" v-for="(zone, index) in currentZoneTitles" :key="index" @click.stop>
        {{ zone }}
        <CloseDelete class="delete" @click.stop="deleteZone(index)" />
      </div>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem', height: '59%' }">
    <template #header>
      <HeaderSection :img="ZoneDialog" :title="$t('Select Zones')" :subtitle="$t('At least 1 zone required for every location')" />
    </template>

    <div v-if="locations.length > 0" class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
      <ZoneDialogForm
        :locations="locations"
        @update:data="GetData"
        :selectedZones="mergedSelectedZones"
      />
    </div>

    <div v-else class="empty">
      <p>{{ $t('No Selected locations') }}</p>
    </div>
  </Dialog>
</template>
