<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref, computed } from 'vue'
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import ZoneDialogForm from './ZoneDialogForm.vue'
import CloseDelete from '@/shared/icons/CloseDelete.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'

const visible = ref(false)

const emit = defineEmits(['update:data'])
const props = defineProps<{
  locations: TitleInterface[]
}>()

const Zones = ref<{ locationId: number; locationName: string; zones: { id: number; title: string }[] }[]>([])

const GetData = (data: { locationId: number; locationName: string; zones: any[] }[]) => {
  visible.value = false
  Zones.value = data
  emit('update:data', data)
}

const deleteZone = (locationId: number, zoneId: number) => {
  const location = Zones.value.find((l) => l.locationId === locationId)
  if (!location) return
  location.zones = location.zones.filter((z) => z.id !== zoneId)
  if (location.zones.length === 0) {
    Zones.value = Zones.value.filter((l) => l.locationId !== locationId)
  }
  emit('update:data', Zones.value)
}

const formattedZones = computed(() => {
  if (!Zones.value || Zones.value.length === 0) return []

  return Zones.value.map((location) => {
    const zoneTitles = location.zones.map((z) => z.title).join(' / ')
    return {
      key: location.locationId,
      text: zoneTitles,
      locationId: location.locationId,
      zoneIds: location.zones.map((z) => z.id),
    }
  })
})

</script>

<template>
  <div class="input-wrapper">
    <div class="zones" @click="visible = true">
      <div class="zone" v-for="zone in formattedZones" :key="zone.key" @click.stop>
        <span>{{ zone.text }}</span>
        <CloseDelete class="delete" @click.stop="deleteZone(zone.locationId, zone.zoneId)" />
      </div>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem', height: '59%' }">
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection :img="ZoneDialog" title="Select Zones" subtitle="At least 1 zone required for every location" />
      </div>
    </template>

    <div class="equipment-dialog-data" v-if="locations.length > 0">
      <hr class="add-equipment-hr" />
      <ZoneDialogForm :locations="locations" @update:data="GetData" :selected-zones="Zones" />
    </div>
    <div class="empty" v-else>
      <p>No Selected locations </p>
    </div>
  </Dialog>
</template>

<style scoped>

</style>
