<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref, computed, watch } from 'vue'
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import ZoneDialogForm from './ZoneDialogForm.vue'
import CloseDelete from '@/shared/icons/CloseDelete.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import type ProjectLocationZonesModel from '@/features/Organization/Project/Data/models/ProjectLocationZones'
import { useRoute } from 'vue-router'

const visible = ref(false)
const route = useRoute()
const id = route.params.id

const emit = defineEmits(['update:data'])

const props = defineProps<{
  locations: TitleInterface[]
  selectedZones: ProjectLocationZonesModel[]
}>()


const Zones = ref<ProjectLocationZonesModel[]>(props.selectedZones)


const GetData = (data: ProjectLocationZonesModel[]) => {
  visible.value = false
  Zones.value = data
  emit('update:data', data)
}


const deleteZone = (locationId: number, zoneId: number) => {
  const locationObj = Zones.value.find((l) => l.location.id === locationId)
  if (!locationObj) return

  locationObj.zoons = locationObj.zoons.filter((z) => z.id !== zoneId)

  if (locationObj.zoons.length === 0) {
    Zones.value = Zones.value.filter((l) => l.location.id !== locationId)
  }

  emit('update:data', Zones.value)
}


const formattedZones = computed(() => {
  if (!Zones.value || Zones.value.length === 0) return []

  return Zones.value.map((item , index) => {
    // console.log(Zones.value[index].location.title, "Zones.value");
    // Zones.value[index].location.title
    const zoneTitles = id ?  item.zoons
      .map((z) => z.titles?.[0]?.title || 'Untitled')
      .join(' / ') : item.zoons
        .map((z) => z.title)
        .join(' / ')

    return {
      key: item.location.id,
      text: zoneTitles,
      locationId: item.location.id,
      zoneIds: item.zoons.map((z) => z.id),
    }
  })
})

watch(() => props.selectedZones,
  () => {
    Zones.value = props.selectedZones
    GetData(Zones.value);
  })
</script>

<template>
  <div class="input-wrapper">
    <div class="zones" @click="visible = true">
      <div class="zone" v-for="zone in formattedZones" :key="zone.key" @click.stop>
        <span>{{ zone.text }}</span>
        <CloseDelete class="delete" @click.stop="deleteZone(zone.locationId, zone.zoneIds[0])" />
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
      <ZoneDialogForm :locations="locations" @update:data="GetData" :selectedZones="Zones" />
    </div>

    <div class="empty" v-else>
      <p>No Selected locations</p>
    </div>
  </Dialog>
</template>

<style scoped></style>
