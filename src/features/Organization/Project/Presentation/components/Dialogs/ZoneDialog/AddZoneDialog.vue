<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import Dialog from 'primevue/dialog'
import { ref, watch, useId } from 'vue'
import ProjectIcon from '../../ProjectUtils/ProjectIcon.vue'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import ZoneDialogForm from './ZoneDialogForm.vue'
import CloseDelete from '@/shared/icons/CloseDelete.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'

defineOptions({ inheritAttrs: false })

const visible = ref(false)
const dialogId = useId()
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

  props.selectedZones.forEach((location) => {
    if (location.zoons && location.zoons.length > 0) {
      location.zoons.forEach((zone) => {
        const title = zone.title || zone.titles?.[0]?.title || 'Unknown'
        currentZoneTitles.value.push(title)
      })
    }
  })

  console.log('AddZoneDialog - Initialized:', {
    mergedSelectedZones: mergedSelectedZones.value,
    currentZoneTitles: currentZoneTitles.value,
  })
}

initializeFromProps()

watch(
  () => props.selectedZones,
  (newVal) => {
    console.log('AddZoneDialog - Props selectedZones changed:', newVal)
    initializeFromProps()
  },
  { deep: true },
)

const GetData = (data: {
  zoonTitles: string[]
  zoonIds: { locationId: number; ZoneIds: number[] }[]
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
        const dataToEmit = mergedSelectedZones.value.map((loc) => ({
          locationId: loc.zoonId,
          ZoneIds: loc.zoons?.map((z) => z.id) || [],
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
  <div
    data-hse-project
    v-project-panels
    class="hse-project-root hse-identity hse-zone-picker hse-project-field input-wrapper"
    v-bind="$attrs"
  >
    <div class="hse-zone-picker__control" @click="visible = true">
      <div v-if="currentZoneTitles.length" class="hse-zone-picker__chips">
        <span
          v-for="(zone, index) in currentZoneTitles"
          :key="index"
          class="hse-zone-picker__chip"
          @click.stop
        >
          <span>{{ zone }}</span>
          <button
            type="button"
            :aria-label="`${$t('delete')} ${zone}`"
            @click.stop="deleteZone(index)"
          >
            <CloseDelete aria-hidden="true" />
          </button>
        </span>
      </div>
      <button
        type="button"
        class="hse-zone-picker__open"
        aria-haspopup="dialog"
        :aria-expanded="visible"
        :aria-controls="dialogId"
        @click.stop="visible = true"
      >
        <ProjectIcon name="grid" aria-hidden="true" />
        <span>{{ $t('Select Zones') }}</span>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  </div>

  <Dialog
    data-hse-project
    class="hse-project-root hse-project-overlay hse-identity hse-zone-dialog"
    :id="dialogId"
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    v-model:visible="visible"
    modal
    :dismissable-mask="true"
    :style="{ width: '42rem', maxWidth: 'calc(100vw - 32px)' }"
  >
    <template #header>
      <HeaderSection
        icon="map-marker"
        :title="$t('Select Zones')"
        :subtitle="$t('At least 1 zone required for every location')"
      />
    </template>

    <div v-if="locations.length > 0" class="hse-zone-dialog__body">
      <ZoneDialogForm
        :locations="locations"
        @update:data="GetData"
        :selectedZones="mergedSelectedZones"
      />
    </div>

    <div v-else class="hse-zone-dialog__empty">
      <p>{{ $t('No Selected locations') }}</p>
    </div>
  </Dialog>
</template>

<style scoped>
.hse-zone-picker__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 7px 10px;
  border: 1px solid var(--hse-project-line);
  border-radius: 9px;
  background: var(--hse-project-input-bg);
  font-family: var(--hse-control-font);
  cursor: pointer;
}
.hse-zone-picker__control:hover,
.hse-zone-picker__control:focus-within {
  border-color: var(--hse-project-blue);
}
.hse-zone-picker__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}
.hse-zone-picker__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 9%, var(--hse-project-surface));
  font-size: 12px;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.hse-zone-picker__chip button,
.hse-zone-picker__open {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.hse-zone-picker__chip button {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}
.hse-zone-picker__chip button :deep(svg) {
  width: 16px;
  height: 16px;
}
.hse-zone-picker__open {
  color: var(--hse-project-muted);
  min-height: 30px;
  font-size: 13px;
}
.hse-zone-picker__open svg {
  width: 17px;
  height: 17px;
  color: var(--hse-project-blue);
}
.hse-zone-picker__open:focus-visible,
.hse-zone-picker__chip button:focus-visible {
  outline: 2px solid var(--hse-project-blue);
  outline-offset: 3px;
  border-radius: 5px;
}
</style>

<style>
.hse-project-root.hse-identity.hse-zone-dialog .hse-project-root {
  --hse-project-surface: inherit;
  --hse-project-ink: inherit;
  --hse-project-muted: inherit;
  --hse-project-line: inherit;
  --hse-project-input-bg: inherit;
  --hse-project-surface-soft: inherit;
}
.hse-project-root.hse-identity.hse-zone-dialog,
.hse-project-root.hse-identity.hse-zone-dialog :is(.p-dialog-header, .p-dialog-content) {
  background: var(--hse-project-surface) !important;
}
.hse-project-root.hse-identity.hse-zone-dialog
  :is(.zone-form, .zone-container, .location-header, .zone-content-container) {
  background: transparent !important;
  box-shadow: none !important;
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-form .zone-content {
  background: var(--hse-project-input-bg) !important;
  box-shadow: none !important;
}
.hse-project-root.hse-identity.hse-zone-dialog .confirm-btn,
.hse-project-root.hse-identity.hse-zone-dialog .confirm-btn span {
  color: white !important;
}

.hse-project-root.hse-identity.hse-zone-dialog,
.hse-project-root.hse-identity.hse-zone-dialog .hse-project-root {
  --hse-project-font: var(--hse-control-font);
}
.hse-project-root.hse-identity.hse-zone-dialog {
  font-family: var(--hse-control-font);
}
.hse-project-root.hse-identity.hse-zone-dialog .section-header .title {
  font-family: var(--hse-control-font);
  font-weight: 750;
}
.hse-project-root.hse-identity.hse-zone-dialog .section-header .subtitle {
  font-family: var(--hse-control-font);
  font-size: 12px;
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-form {
  margin: 0;
  gap: 20px;
  font-family: var(--hse-control-font);
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-container {
  gap: 10px;
}
.hse-project-root.hse-identity.hse-zone-dialog .location-header .title {
  margin: 0;
  font: 650 13px var(--hse-control-font);
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-content-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 0;
  border: 0;
  gap: 10px;
  border-radius: 0;
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-content {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  border: 1px solid var(--hse-project-line);
  border-radius: 9px;
  background: var(--hse-project-input-bg);
  padding-inline-end: 12px;
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-content.active {
  border-color: var(--hse-project-blue);
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-content .zone-title {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 13px 12px;
  background: transparent;
  color: var(--hse-project-ink);
  font: 600 13px var(--hse-control-font);
  overflow-wrap: anywhere;
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-form .zone-content.active .zone-title {
  background: transparent;
  color: var(--hse-project-ink);
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-content input {
  display: block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  accent-color: var(--hse-project-blue);
  cursor: pointer;
}
.hse-project-root.hse-identity.hse-zone-dialog .zone-content:focus-within {
  outline: 2px solid var(--hse-project-blue);
  outline-offset: 2px;
}
.hse-project-root.hse-identity.hse-zone-dialog .confirm-btn {
  font-family: var(--hse-control-font);
  border-radius: 9px;
  margin: 0;
}
.hse-zone-dialog__empty,
.hse-project-root.hse-identity.hse-zone-dialog .empty-zone {
  grid-column: 1 / -1;
  padding: 28px 16px;
  border: 1px dashed var(--hse-project-line);
  border-radius: 12px;
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-muted);
  font-size: 13px;
  text-align: center;
}
@media (max-width: 540px) {
  .hse-project-root.hse-identity.hse-zone-dialog .zone-content-container {
    grid-template-columns: 1fr;
  }
}
</style>
