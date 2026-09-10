<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import FactorItemIcon from '@/shared/icons/FactorItemIcon.vue'
import type FactoryModel from '@/features/setting/Factory/Data/models/FactoryModel'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const { factors, subfactors } = defineProps<{
  factors: FactoryModel[]
  subfactors: FactoryItemModel[]
}>()

const selectedFactors = ref<number[]>([])
const selectedSubs = ref<Record<number, number[]>>({})

const emit = defineEmits(['update:data', 'update:sub-factors'])

const isFactorSelected = (factorId: number) => selectedFactors.value.includes(factorId)

const isSubFactorSelected = (factorId: number, subfactorId: number) =>
  selectedSubs.value[factorId]?.includes(subfactorId) ?? false

const handleFactorChange = async (factorId: number) => {
  await nextTick()

  if (isFactorSelected(factorId)) {
    selectedSubs.value[factorId] ??= []
    emit('update:sub-factors', factorId)
    return
  }

  delete selectedSubs.value[factorId]
}

watch(
  [selectedFactors, selectedSubs],
  () => {
    const result = selectedFactors.value.map((factor) => ({
      factor,
      subs: selectedSubs.value[factor] || [],
    }))

    emit('update:data', result)
  },
  { deep: true },
)
</script>

<template>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full factor-item factor-items-container">
    <div class="factor-selection-header">
      <label class="flex gap-2 factot-title">
        <FactorItemIcon />
        <div class="flex flex-col gap-1">
          <span>Factors</span>
          <span class="subtitle">Select the main factor</span>
        </div>
        <FieldHelpIcon
          text="Select each contributing factor, then choose the specific sub-factors supported by the investigation evidence."
        />
      </label>

      <span v-if="selectedFactors.length" class="selected-summary" aria-live="polite">
        {{ selectedFactors.length }} Selected
      </span>
    </div>

    <div class="radio-grid">
      <div
        v-for="factor in factors"
        :key="factor.id"
        class="radio-column"
        :class="{ 'is-selected': isFactorSelected(factor.id) }"
      >
        <label class="radio-item" :for="`factor-${factor.id}`">
          <span class="radio-label">{{ factor.title }}</span>
          <span class="selection-state">
            <Checkbox
              v-model="selectedFactors"
              :inputId="`factor-${factor.id}`"
              :value="factor.id"
              name="factors"
              @change="handleFactorChange(factor.id)"
            />
            <span>{{ isFactorSelected(factor.id) ? 'Selected' : 'Select' }}</span>
          </span>
        </label>

        <div v-if="isFactorSelected(factor.id)" class="sub-radio-group">
          <span class="subfactor-heading">Sub-factors</span>
          <label
            class="sub-radio-item"
            v-for="(subfactor, subindex) in subfactors?.filter(
              (sub) => sub.factory?.id === factor.id,
            )"
            :key="subfactor.id ?? subindex"
            :for="`subfactor-${factor.id}-${subfactor.id}`"
            :class="{ 'is-selected': isSubFactorSelected(factor.id, subfactor.id) }"
          >
            <Checkbox
              v-model="selectedSubs[factor.id]"
              :value="subfactor?.id"
              :inputId="`subfactor-${factor.id}-${subfactor.id}`"
              name="sub-factors"
            />
            <span class="sub-radio-label">{{ subfactor.title }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.factor-items-container {
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 16%, var(--main-border));
  background: color-mix(in srgb, var(--brand-primary-50) 32%, var(--surface-1));
}

.factor-selection-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.factot-title {
  align-items: flex-start;
  margin: 0;
}

.subtitle {
  color: var(--text-soft);
  font-size: 14px;
  font-weight: 500;
}

.selected-summary {
  flex: 0 0 auto;
  padding: 7px 12px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 30%, transparent);
  border-radius: 999px;
  background: var(--brand-primary-50);
  color: var(--brand-primary-700);
  font-size: 13px;
  font-weight: 700;
}

.factor-items-container .radio-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 12px;
}

.factor-items-container .radio-column {
  display: block;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-1);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--text-strong) 5%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.factor-items-container .radio-column:hover {
  border-color: color-mix(in srgb, var(--brand-primary-500) 45%, var(--main-border));
  transform: translateY(-1px);
}

.factor-items-container .radio-column:focus-within {
  border-color: var(--brand-primary-500) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary-500) 16%, transparent);
}

.factor-items-container .radio-column.is-selected {
  border-color: var(--brand-primary-500) !important;
  background: color-mix(in srgb, var(--brand-primary-50) 72%, var(--surface-1)) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.factor-items-container .radio-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 62px;
  padding: 13px 14px;
  cursor: pointer;
}

.factor-items-container .radio-label {
  flex: 1;
  min-width: 0;
  color: var(--text-strong);
  font-size: 15px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.selection-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
}

.radio-column.is-selected .selection-state {
  color: var(--brand-primary-700);
}

.factor-items-container .sub-radio-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 8px;
  margin: 0;
  padding: 12px 14px 14px;
  border-top: 1px solid color-mix(in srgb, var(--brand-primary-500) 16%, var(--main-border));
  background: color-mix(in srgb, var(--surface-2) 50%, transparent);
}

.subfactor-heading {
  grid-column: 1 / -1;
  color: var(--text-soft);
  font-size: 12px;
  font-weight: 700;
}

.factor-items-container .sub-radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  background: var(--surface-1);
  cursor: pointer;
}

.factor-items-container .sub-radio-item.is-selected {
  border-color: var(--brand-primary-500) !important;
  background: var(--brand-primary-50) !important;
}

.factor-items-container .sub-radio-label {
  min-width: 0;
  color: var(--text-strong);
  font-size: 13px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

@media (max-width: 668px) {
  .factor-items-container {
    padding: 14px;
  }

  .factor-selection-header {
    align-items: stretch;
    flex-direction: column;
  }

  .selected-summary {
    align-self: flex-start;
  }

  .factor-items-container .radio-grid,
  .factor-items-container .sub-radio-group {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .selection-state > span:last-child {
    display: none;
  }
}
</style>
