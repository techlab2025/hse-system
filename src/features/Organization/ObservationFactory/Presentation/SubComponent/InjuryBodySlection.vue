<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type BodyView = 'front' | 'back'
type BodyRegion = {
  id: string
  label: string
  view: BodyView
  x: number
  y: number
  width: number
  height: number
}

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    idPrefix?: string
    readonly?: boolean
  }>(),
  {
    modelValue: () => [],
    idPrefix: 'injury-body',
    readonly: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const activeView = ref<BodyView>('front')
const selectValue = ref('')
const selectedIds = ref<string[]>([...props.modelValue])

const frontRegions: BodyRegion[] = [
  { id: 'front-scalp', label: 'Scalp', view: 'front', x: 50, y: 5, width: 13, height: 6 },
  { id: 'front-face', label: 'Face / Head', view: 'front', x: 50, y: 11, width: 14, height: 8 },
  { id: 'front-neck', label: 'Front Neck', view: 'front', x: 50, y: 18, width: 10, height: 5 },
  {
    id: 'front-right-shoulder',
    label: 'Right Shoulder',
    view: 'front',
    x: 37,
    y: 23,
    width: 15,
    height: 8,
  },
  {
    id: 'front-left-shoulder',
    label: 'Left Shoulder',
    view: 'front',
    x: 63,
    y: 23,
    width: 15,
    height: 8,
  },
  {
    id: 'front-right-chest',
    label: 'Right Chest',
    view: 'front',
    x: 43,
    y: 30,
    width: 14,
    height: 12,
  },
  {
    id: 'front-left-chest',
    label: 'Left Chest',
    view: 'front',
    x: 57,
    y: 30,
    width: 14,
    height: 12,
  },
  {
    id: 'front-upper-abdomen',
    label: 'Upper Abdomen',
    view: 'front',
    x: 50,
    y: 39,
    width: 19,
    height: 9,
  },
  {
    id: 'front-lower-abdomen',
    label: 'Lower Abdomen',
    view: 'front',
    x: 50,
    y: 47,
    width: 18,
    height: 9,
  },
  {
    id: 'front-pelvic-groin',
    label: 'Pelvic / Groin',
    view: 'front',
    x: 50,
    y: 54,
    width: 17,
    height: 8,
  },
  {
    id: 'front-right-upper-arm',
    label: 'Right Upper Arm',
    view: 'front',
    x: 28,
    y: 33,
    width: 10,
    height: 17,
  },
  {
    id: 'front-left-upper-arm',
    label: 'Left Upper Arm',
    view: 'front',
    x: 72,
    y: 33,
    width: 10,
    height: 17,
  },
  {
    id: 'front-right-elbow',
    label: 'Right Elbow',
    view: 'front',
    x: 23,
    y: 44,
    width: 9,
    height: 7,
  },
  { id: 'front-left-elbow', label: 'Left Elbow', view: 'front', x: 77, y: 44, width: 9, height: 7 },
  {
    id: 'front-right-forearm',
    label: 'Right Forearm',
    view: 'front',
    x: 19,
    y: 54,
    width: 9,
    height: 17,
  },
  {
    id: 'front-left-forearm',
    label: 'Left Forearm',
    view: 'front',
    x: 81,
    y: 54,
    width: 9,
    height: 17,
  },
  {
    id: 'front-right-wrist',
    label: 'Right Wrist',
    view: 'front',
    x: 16,
    y: 64,
    width: 7,
    height: 5,
  },
  { id: 'front-left-wrist', label: 'Left Wrist', view: 'front', x: 84, y: 64, width: 7, height: 5 },
  {
    id: 'front-right-hand',
    label: 'Right Hand / Fingers',
    view: 'front',
    x: 13,
    y: 70,
    width: 10,
    height: 12,
  },
  {
    id: 'front-left-hand',
    label: 'Left Hand / Fingers',
    view: 'front',
    x: 87,
    y: 70,
    width: 10,
    height: 12,
  },
  {
    id: 'front-right-thigh',
    label: 'Right Thigh',
    view: 'front',
    x: 42,
    y: 65,
    width: 14,
    height: 20,
  },
  {
    id: 'front-left-thigh',
    label: 'Left Thigh',
    view: 'front',
    x: 58,
    y: 65,
    width: 14,
    height: 20,
  },
  {
    id: 'front-right-knee',
    label: 'Right Knee',
    view: 'front',
    x: 41,
    y: 77,
    width: 11,
    height: 7,
  },
  { id: 'front-left-knee', label: 'Left Knee', view: 'front', x: 59, y: 77, width: 11, height: 7 },
  {
    id: 'front-right-shin',
    label: 'Right Shin / Lower Leg',
    view: 'front',
    x: 40,
    y: 87,
    width: 11,
    height: 17,
  },
  {
    id: 'front-left-shin',
    label: 'Left Shin / Lower Leg',
    view: 'front',
    x: 60,
    y: 87,
    width: 11,
    height: 17,
  },
  {
    id: 'front-right-ankle',
    label: 'Right Ankle',
    view: 'front',
    x: 39,
    y: 95,
    width: 8,
    height: 5,
  },
  { id: 'front-left-ankle', label: 'Left Ankle', view: 'front', x: 61, y: 95, width: 8, height: 5 },
  {
    id: 'front-right-foot',
    label: 'Right Foot / Toes',
    view: 'front',
    x: 37,
    y: 98,
    width: 13,
    height: 5,
  },
  {
    id: 'front-left-foot',
    label: 'Left Foot / Toes',
    view: 'front',
    x: 63,
    y: 98,
    width: 13,
    height: 5,
  },
]

const backRegions: BodyRegion[] = [
  { id: 'back-head', label: 'Back of Head', view: 'back', x: 50, y: 8, width: 14, height: 11 },
  { id: 'back-neck', label: 'Back of Neck', view: 'back', x: 50, y: 18, width: 10, height: 5 },
  {
    id: 'back-right-scapula',
    label: 'Right Shoulder Blade',
    view: 'back',
    x: 42,
    y: 29,
    width: 14,
    height: 13,
  },
  {
    id: 'back-left-scapula',
    label: 'Left Shoulder Blade',
    view: 'back',
    x: 58,
    y: 29,
    width: 14,
    height: 13,
  },
  { id: 'back-upper-back', label: 'Upper Back', view: 'back', x: 50, y: 34, width: 19, height: 9 },
  {
    id: 'back-middle-back',
    label: 'Middle Back',
    view: 'back',
    x: 50,
    y: 42,
    width: 18,
    height: 9,
  },
  {
    id: 'back-lower-back',
    label: 'Lower Back / Lumbar',
    view: 'back',
    x: 50,
    y: 50,
    width: 18,
    height: 9,
  },
  {
    id: 'back-right-buttock',
    label: 'Right Buttock',
    view: 'back',
    x: 43,
    y: 57,
    width: 14,
    height: 10,
  },
  {
    id: 'back-left-buttock',
    label: 'Left Buttock',
    view: 'back',
    x: 57,
    y: 57,
    width: 14,
    height: 10,
  },
  {
    id: 'back-right-upper-arm',
    label: 'Right Upper Arm / Back',
    view: 'back',
    x: 28,
    y: 33,
    width: 10,
    height: 17,
  },
  {
    id: 'back-left-upper-arm',
    label: 'Left Upper Arm / Back',
    view: 'back',
    x: 72,
    y: 33,
    width: 10,
    height: 17,
  },
  {
    id: 'back-right-elbow',
    label: 'Right Elbow / Back',
    view: 'back',
    x: 23,
    y: 44,
    width: 9,
    height: 7,
  },
  {
    id: 'back-left-elbow',
    label: 'Left Elbow / Back',
    view: 'back',
    x: 77,
    y: 44,
    width: 9,
    height: 7,
  },
  {
    id: 'back-right-forearm',
    label: 'Right Forearm / Back',
    view: 'back',
    x: 19,
    y: 54,
    width: 9,
    height: 17,
  },
  {
    id: 'back-left-forearm',
    label: 'Left Forearm / Back',
    view: 'back',
    x: 81,
    y: 54,
    width: 9,
    height: 17,
  },
  {
    id: 'back-right-hand',
    label: 'Right Hand Back',
    view: 'back',
    x: 13,
    y: 70,
    width: 10,
    height: 12,
  },
  {
    id: 'back-left-hand',
    label: 'Left Hand Back',
    view: 'back',
    x: 87,
    y: 70,
    width: 10,
    height: 12,
  },
  {
    id: 'back-right-hamstring',
    label: 'Right Hamstring',
    view: 'back',
    x: 42,
    y: 66,
    width: 14,
    height: 20,
  },
  {
    id: 'back-left-hamstring',
    label: 'Left Hamstring',
    view: 'back',
    x: 58,
    y: 66,
    width: 14,
    height: 20,
  },
  {
    id: 'back-right-knee',
    label: 'Right Back of Knee',
    view: 'back',
    x: 41,
    y: 77,
    width: 11,
    height: 7,
  },
  {
    id: 'back-left-knee',
    label: 'Left Back of Knee',
    view: 'back',
    x: 59,
    y: 77,
    width: 11,
    height: 7,
  },
  { id: 'back-right-calf', label: 'Right Calf', view: 'back', x: 40, y: 87, width: 11, height: 17 },
  { id: 'back-left-calf', label: 'Left Calf', view: 'back', x: 60, y: 87, width: 11, height: 17 },
  {
    id: 'back-right-heel',
    label: 'Right Heel / Sole',
    view: 'back',
    x: 38,
    y: 97,
    width: 12,
    height: 7,
  },
  {
    id: 'back-left-heel',
    label: 'Left Heel / Sole',
    view: 'back',
    x: 62,
    y: 97,
    width: 12,
    height: 7,
  },
]

const allRegions = [...frontRegions, ...backRegions]
const visibleRegions = computed(() => (activeView.value === 'front' ? frontRegions : backRegions))
const selectedRegions = computed(() =>
  selectedIds.value
    .map((id) => allRegions.find((region) => region.id === id))
    .filter((region): region is BodyRegion => Boolean(region)),
)

const isSelected = (id: string) => selectedIds.value.includes(id)

watch(
  () => props.modelValue,
  (value) => {
    if (
      value.length !== selectedIds.value.length ||
      value.some((id, index) => id !== selectedIds.value[index])
    ) {
      selectedIds.value = [...value]
    }
  },
  { deep: true },
)

function updateSelection(value: string[]) {
  selectedIds.value = value
  emit('update:modelValue', [...value])
}

function toggleRegion(id: string) {
  if (props.readonly) return
  const next = isSelected(id)
    ? selectedIds.value.filter((selectedId) => selectedId !== id)
    : [...selectedIds.value, id]
  updateSelection(next)
}

function selectRegion() {
  if (!selectValue.value) return
  const region = allRegions.find((item) => item.id === selectValue.value)
  if (region) activeView.value = region.view
  if (!isSelected(selectValue.value)) updateSelection([...selectedIds.value, selectValue.value])
  selectValue.value = ''
}
</script>

<template>
  <section class="body-map" :aria-labelledby="`${idPrefix}-title`">
    <header class="body-map__header">
      <div>
        <span class="body-map__eyebrow">Injury location</span>
        <h3 :id="`${idPrefix}-title`">Interactive body map</h3>
        <p>Select one or more affected areas from the body or region list.</p>
      </div>
      <span class="selection-count">{{ selectedIds.length }} selected</span>
    </header>

    <div class="body-map__layout">
      <div class="map-column">
        <div class="view-tabs" role="tablist" aria-label="Body view">
          <button
            v-for="view in ['front', 'back'] as BodyView[]"
            :key="view"
            type="button"
            role="tab"
            :aria-selected="activeView === view"
            :class="{ active: activeView === view }"
            @click="activeView = view"
          >
            {{ view === 'front' ? 'Front' : 'Back' }}
          </button>
        </div>

        <div class="map-stage">
          <svg class="body-silhouette" viewBox="0 0 240 500" aria-hidden="true">
            <defs>
              <linearGradient :id="`${idPrefix}-body-fill`" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="currentColor" stop-opacity=".18" />
                <stop offset="1" stop-color="currentColor" stop-opacity=".07" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="43" r="31" :fill="`url(#${idPrefix}-body-fill)`" />
            <path
              d="M105 70h30l5 27 31 13 27 94-20 7-35-76-3 112 21 105-20 126h-20l-1-116-1 116H99L79 352l21-105-3-112-35 76-20-7 27-94 31-13 5-27Z"
              :fill="`url(#${idPrefix}-body-fill)`"
              stroke="currentColor"
              stroke-opacity=".28"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              v-if="activeView === 'front'"
              d="M120 98v258M98 161h44M92 232h56M88 282h64"
              fill="none"
              stroke="currentColor"
              stroke-opacity=".1"
            />
            <path
              v-else
              d="M120 98v258M92 145q28 28 56 0M91 215h58M88 282h64"
              fill="none"
              stroke="currentColor"
              stroke-opacity=".14"
            />
          </svg>

          <button
            v-for="region in visibleRegions"
            :key="region.id"
            type="button"
            class="hotspot"
            :class="{ selected: isSelected(region.id) }"
            :style="{
              '--x': `${region.x}%`,
              '--y': `${region.y}%`,
              '--w': `${region.width}%`,
              '--h': `${region.height}%`,
            }"
            :aria-label="region.label"
            :aria-pressed="isSelected(region.id)"
            :title="region.label"
            :disabled="readonly"
            @click="toggleRegion(region.id)"
          >
            <span class="sr-only">{{ region.label }}</span>
            <span v-if="isSelected(region.id)" class="hotspot-marker" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <div class="selection-column">
        <label :for="`${idPrefix}-region`">Body region</label>
        <div class="region-select-wrap">
          <select
            :id="`${idPrefix}-region`"
            v-model="selectValue"
            :disabled="readonly"
            @change="selectRegion"
          >
            <option value="">Choose a body region</option>
            <optgroup label="Front">
              <option v-for="region in frontRegions" :key="region.id" :value="region.id">
                {{ region.label }}
              </option>
            </optgroup>
            <optgroup label="Back">
              <option v-for="region in backRegions" :key="region.id" :value="region.id">
                {{ region.label }}
              </option>
            </optgroup>
          </select>
          <span aria-hidden="true">⌄</span>
        </div>

        <div v-if="selectedRegions.length" class="selected-regions" aria-live="polite">
          <div class="selected-regions__heading">
            <strong>Affected areas</strong><small>{{ selectedRegions.length }}</small>
          </div>
          <div class="region-chips">
            <button
              v-for="region in selectedRegions"
              :key="region.id"
              type="button"
              class="region-chip"
              :disabled="readonly"
              :title="`Remove ${region.label}`"
              @click="toggleRegion(region.id)"
            >
              <span class="region-chip__side">{{ region.view === 'front' ? 'F' : 'B' }}</span>
              {{ region.label }}
              <span v-if="!readonly" class="region-chip__remove" aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <div v-else class="selection-empty">
          <span aria-hidden="true">＋</span>
          <div>
            <strong>No area selected</strong
            ><small>Click the body map or use the list above.</small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.body-map {
  display: grid;
  gap: 16px;
  width: 100%;
  padding: clamp(16px, 3vw, 22px);
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 18px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-1)),
    var(--surface-1)
  );
  box-shadow: 0 10px 28px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
}
.body-map__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}
.body-map__eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.65rem;
  font-weight: 850;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.body-map__header h3 {
  margin: 3px 0;
  color: var(--text-strong);
  font-size: 1rem;
}
.body-map__header p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.75rem;
  line-height: 1.5;
}
.selection-count {
  flex: none;
  padding: 7px 10px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-size: 0.68rem;
  font-weight: 800;
}
.body-map__layout {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(280px, 1.2fr);
  gap: 18px;
  align-items: start;
}
.map-column {
  display: grid;
  gap: 10px;
}
.view-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--surface-2);
}
.view-tabs button {
  min-height: 38px;
  border: 0;
  border-radius: 9px;
  color: var(--text-soft);
  background: transparent;
  cursor: pointer;
  font-weight: 800;
}
.view-tabs button.active {
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 7px 16px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
}
.map-stage {
  position: relative;
  width: min(100%, 300px);
  aspect-ratio: 240 / 500;
  margin: auto;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  color: #78b5d8;
  background:
    radial-gradient(
      circle at 50% 32%,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 46%
    ),
    var(--surface-2);
}
.body-silhouette {
  position: absolute;
  inset: 3%;
  width: 94%;
  height: 94%;
}
.hotspot {
  position: absolute;
  display: block !important;
  left: var(--x);
  top: var(--y);
  width: var(--w);
  height: var(--h);
  min-width: 0 !important;
  min-height: 0 !important;
  padding: 0;
  appearance: none;
  transform: translate(-50%, -50%);
  border: 1px solid color-mix(in srgb, #78b5d8 26%, transparent);
  border-radius: 999px;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    box-shadow 0.16s ease;
}
.hotspot:hover,
.hotspot:focus-visible {
  z-index: 2;
  border-color: #c96b00;
  background: color-mix(in srgb, #f3a72d 20%, transparent);
  outline: none;
}
.hotspot.selected {
  z-index: 3;
  border: 2px solid #c96b00 !important;
  background: color-mix(in srgb, #f4ad36 42%, transparent) !important;
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, white 38%, transparent),
    0 2px 7px color-mix(in srgb, #a75600 18%, transparent) !important;
}
.hotspot-marker {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  transform: translate(-50%, -50%);
  border: 1px solid white;
  border-radius: 50%;
  background: #b75f00;
  box-shadow: 0 1px 4px color-mix(in srgb, #7d3d00 35%, transparent);
}
.selection-column {
  display: grid;
  gap: 11px;
}
.selection-column > label {
  color: var(--text-strong);
  font-size: 0.78rem;
  font-weight: 800;
}
.region-select-wrap {
  position: relative;
}
.region-select-wrap select {
  width: 100%;
  min-height: 46px;
  padding: 11px 42px 11px 13px;
  appearance: none;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  outline: none;
  color: var(--text-strong);
  background: var(--surface-1);
  font: inherit;
}
.region-select-wrap select:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
}
.region-select-wrap > span {
  position: absolute;
  top: 50%;
  inset-inline-end: 14px;
  transform: translateY(-50%);
  color: var(--PrimaryColor);
  pointer-events: none;
}
.selected-regions {
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
}
.selected-regions__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.selected-regions__heading strong {
  color: var(--text-strong);
  font-size: 0.78rem;
}
.selected-regions__heading small {
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 7px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-weight: 800;
}
.region-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.region-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 5px 8px 5px 6px;
  border: 1px solid color-mix(in srgb, #c96b00 22%, var(--main-border));
  border-radius: 10px;
  color: var(--text-strong);
  background: color-mix(in srgb, #ffc55c 18%, var(--surface-1));
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 700;
}
.region-chip:hover:not(:disabled) {
  border-color: #c96b00;
  color: #9b5100;
}
.region-chip__side {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  color: #9b5100;
  background: color-mix(in srgb, #ffc55c 30%, var(--surface-1));
  font-size: 0.62rem;
  font-weight: 850;
}
.region-chip__remove {
  color: #9b5100;
  font-size: 1rem;
  line-height: 1;
}
.selection-empty {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 22%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 3%, var(--surface-1));
}
.selection-empty > span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: var(--surface-1);
}
.selection-empty div {
  display: grid;
  gap: 2px;
}
.selection-empty strong {
  color: var(--text-strong);
  font-size: 0.76rem;
}
.selection-empty small {
  color: var(--text-soft);
  font-size: 0.68rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 760px) {
  .body-map__layout {
    grid-template-columns: 1fr;
  }
  .map-stage {
    width: min(100%, 270px);
  }
}

@media (max-width: 440px) {
  .body-map {
    padding: 14px;
  }
  .body-map__header {
    flex-direction: column;
  }
  .selection-count {
    align-self: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hotspot {
    transition: none;
  }
}
</style>
