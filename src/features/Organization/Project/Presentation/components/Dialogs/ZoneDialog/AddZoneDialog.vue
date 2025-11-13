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

const Zones = ref<SohwProjectZoonModel[]>(props.selectedZones)

const ZoonsIds = ref<number[]>([])
const Zoones = ref<string[]>([])

// function to extract zone ids and names
const updateLists = (data: SohwProjectZoonModel[]) => {
  ZoonsIds.value = data.flat().map(el => el.zoons).flat().map(el => el?.id)
  Zoones.value = data.flat().map(z => z.zoons).flat().map(el => el?.titles).flat().map(el => el?.title)
}

updateLists(props.selectedZones)

watch(
  () => props.selectedZones,
  (newVal) => {
    Zones.value = newVal
    updateLists(newVal)
  }
)

const GetData = (data: { zoonTitles: string[], zoonIds: number[] }) => {
  visible.value = false
  Zoones.value = data.zoonTitles
  ZoonsIds.value = data.zoonIds
  emit('update:data', ZoonsIds.value)
}

const deleteZone = (index: number) => {
  ZoonsIds.value.splice(index, 1)
  Zoones.value.splice(index, 1)
  emit('update:data', ZoonsIds.value)
}
</script>

<template>
  <div class="input-wrapper">
    <div class="zones input" @click="visible = true" >
      <div class="zone" v-for="(zone, index) in Zoones" :key="index" @click.stop>
        {{ zone }}
        <CloseDelete class="delete" @click.stop="deleteZone(index)" />
      </div>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem', height: '59%' }">
    <template #header>
      <HeaderSection :img="ZoneDialog" title="Select Zones" subtitle="At least 1 zone required for every location" />
    </template>

    <div v-if="locations.length > 0" class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
      <ZoneDialogForm :locations="locations" @update:data="GetData" :selectedZones="Zones" />
    </div>

    <div v-else class="empty">
      <p>No Selected locations</p>
    </div>
  </Dialog>
</template>
