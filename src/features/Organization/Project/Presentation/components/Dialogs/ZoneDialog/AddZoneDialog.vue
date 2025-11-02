<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref, computed } from 'vue'
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import ZoneDialogForm from './ZoneDialogForm.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'

const visible = ref(false)

const emit = defineEmits(['update:data'])
const props = defineProps<{
  locations: TitleInterface[]
}>()

const Zones = ref<{ id: number, title: string }[]>([])
const GetData = (data: Record<number, number[]>) => {
  visible.value = false
  Zones.value = data
  console.log('Selected zones:', Zones.value)
  emit('update:data', data)
}

const formattedZones = computed(() => {
  if (!Zones.value || Object.keys(Zones.value).length === 0) return ''

  return Object.entries(Zones.value)
    .map(([locId, zoneIds]) => `Location ${locId}: [${zoneIds.join(', ')}]`)
    .join(' | ')
})
</script>

<template>
  <div class="input-wrapper">
    <input type="text" class="input" readonly @click="visible = true" :value="formattedZones"
      placeholder="Select zones" />
  </div>

  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem', height: '59%' }">
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection :img="ZoneDialog" title="Select Zones" subtitle="At least 1 zone required for every location" />
      </div>
    </template>

    <div class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
      <ZoneDialogForm :locations="locations" @update:data="GetData" />
    </div>
  </Dialog>
</template>
