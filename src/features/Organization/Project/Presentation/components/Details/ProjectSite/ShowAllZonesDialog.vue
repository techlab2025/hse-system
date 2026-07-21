<script setup lang="ts">
import { ref } from 'vue'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import Dialog from 'primevue/dialog'
import LocationCard from './LocationCard.vue'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'

const visible = ref(false)
const { locations, projectId } = defineProps<{
  projectId: number | undefined
  locations: LocationDetailsModel[] | undefined
}>()
const emit = defineEmits(['update:data'])
</script>
<template>
  <button type="button" @click.prevent="visible = true" class="show-all-btn">
    <span>{{ $t('show_all') }}</span
    ><span class="show-all-arrow" aria-hidden="true">→</span>
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :dismissable-mask="true"
    class="all-zones-dialog"
    :style="{ width: 'min(58rem, calc(100vw - 24px))' }"
  >
    <template #header>
      <HeaderSection
        :img="ZoneDialog"
        :title="$t('All Zones')"
        :subtitle="$t('Show All Locations Zones')"
      />
    </template>
    <div class="all-zones-summary">
      <span>{{ locations?.length || 0 }} {{ $t('Locations') }}</span>
      <span>{{ $t('All operational zones in one view') }}</span>
    </div>
    <div class="card-section all-zones-grid">
      <LocationCard
        v-for="(card, index) in locations"
        :key="index"
        :title="card.title"
        :zoneLength="card.zoons.length"
        :zoons="card.zoons"
        :LocationId="card?.id"
        :projectId="projectId"
        class="dialog"
      />
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.show-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  gap: 8px;
  padding: 7px 8px 7px 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 11px;
  background: var(--PrimaryColor);
  color: white !important;
  font-size: 0.7rem;
  font-weight: 900;
  width: 120px;
  cursor: pointer;
}

.show-all-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  border-radius: 7px;
  background: color-mix(in srgb, white 18%, transparent);
}

[dir='rtl'] .show-all-arrow {
  transform: rotate(180deg);
}

.all-zones-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--surface-2);
  color: var(--text-soft);
  font-size: 0.7rem;
}

.all-zones-summary span:first-child {
  color: var(--PrimaryColor);
  font-weight: 900;
}

.all-zones-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  max-height: 65vh;
  padding: 2px 4px 8px;
  overflow-y: auto;
}

@media (max-width: 680px) {
  .all-zones-grid {
    grid-template-columns: 1fr;
  }

  .all-zones-summary {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
