<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import frontBodyImage from './body-front.png'
import backBodyImage from './body-back.png'

type BodyView = 'front' | 'back'
type BodyRegion = { id: string; label: string; view: BodyView; x: number; y: number; width: number; height: number; z?: number }

const props = withDefaults(defineProps<{
  modelValue?: string[]
  idPrefix?: string
  readonly?: boolean
}>(), { modelValue: () => [], idPrefix: 'injury-body', readonly: false })
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const activeView = ref<BodyView>('front')
const selectValue = ref('')
const selectedIds = ref<string[]>([...props.modelValue])

const frontRegions: BodyRegion[] = [
  {"id": "front-scalp", "label": "Scalp", "view": "front", "x": 50.0, "y": 5.0, "width": 20.0, "height": 8.0, "z": 840},
  {"id": "front-forehead", "label": "Forehead", "view": "front", "x": 50.0, "y": 7.0, "width": 18.0, "height": 5.0, "z": 910},
  {"id": "front-right-eye", "label": "Right Eye", "view": "front", "x": 45.0, "y": 9.0, "width": 8.0, "height": 4.0, "z": 968},
  {"id": "front-left-eye", "label": "Left Eye", "view": "front", "x": 55.0, "y": 9.0, "width": 8.0, "height": 4.0, "z": 968},
  {"id": "front-nose", "label": "Nose", "view": "front", "x": 50.0, "y": 11.0, "width": 7.0, "height": 5.0, "z": 965},
  {"id": "front-mouth", "label": "Mouth & Teeth", "view": "front", "x": 50.0, "y": 13.0, "width": 11.0, "height": 4.0, "z": 956},
  {"id": "front-right-ear", "label": "Right Ear", "view": "front", "x": 40.0, "y": 9.0, "width": 7.0, "height": 8.0, "z": 944},
  {"id": "front-left-ear", "label": "Left Ear", "view": "front", "x": 60.0, "y": 9.0, "width": 7.0, "height": 8.0, "z": 944},
  {"id": "front-jaw-face", "label": "Jaw & Face", "view": "front", "x": 50.0, "y": 12.0, "width": 20.0, "height": 10.0, "z": 800},
  {"id": "front-neck", "label": "Front Neck / Larynx", "view": "front", "x": 50.0, "y": 17.0, "width": 16.0, "height": 7.0, "z": 888},
  {"id": "front-right-shoulder", "label": "Right Shoulder / Front", "view": "front", "x": 32.0, "y": 20.0, "width": 15.0, "height": 9.0, "z": 865},
  {"id": "front-left-shoulder", "label": "Left Shoulder / Front", "view": "front", "x": 68.0, "y": 20.0, "width": 15.0, "height": 9.0, "z": 865},
  {"id": "front-right-chest", "label": "Right Chest", "view": "front", "x": 42.0, "y": 26.0, "width": 17.0, "height": 13.0, "z": 779},
  {"id": "front-left-chest", "label": "Left Chest", "view": "front", "x": 58.0, "y": 26.0, "width": 17.0, "height": 13.0, "z": 779},
  {"id": "front-center-chest", "label": "Center Chest / Sternum", "view": "front", "x": 50.0, "y": 26.0, "width": 13.0, "height": 12.0, "z": 844},
  {"id": "front-upper-abdomen", "label": "Upper Abdomen", "view": "front", "x": 50.0, "y": 35.0, "width": 20.0, "height": 10.0, "z": 800},
  {"id": "front-lower-abdomen", "label": "Lower Abdomen", "view": "front", "x": 50.0, "y": 42.0, "width": 21.0, "height": 10.0, "z": 790},
  {"id": "front-pelvic-groin", "label": "Pelvic / Groin Area", "view": "front", "x": 50.0, "y": 49.0, "width": 19.0, "height": 9.0, "z": 829},
  {"id": "front-right-upper-arm", "label": "Right Upper Arm", "view": "front", "x": 25.0, "y": 27.0, "width": 13.0, "height": 15.0, "z": 805},
  {"id": "front-left-upper-arm", "label": "Left Upper Arm", "view": "front", "x": 75.0, "y": 27.0, "width": 13.0, "height": 15.0, "z": 805},
  {"id": "front-right-elbow", "label": "Right Elbow", "view": "front", "x": 21.0, "y": 35.0, "width": 10.0, "height": 7.0, "z": 930},
  {"id": "front-left-elbow", "label": "Left Elbow", "view": "front", "x": 79.0, "y": 35.0, "width": 10.0, "height": 7.0, "z": 930},
  {"id": "front-right-forearm", "label": "Right Forearm", "view": "front", "x": 18.0, "y": 42.0, "width": 12.0, "height": 15.0, "z": 820},
  {"id": "front-left-forearm", "label": "Left Forearm", "view": "front", "x": 82.0, "y": 42.0, "width": 12.0, "height": 15.0, "z": 820},
  {"id": "front-right-wrist", "label": "Right Wrist", "view": "front", "x": 17.0, "y": 47.0, "width": 8.0, "height": 5.0, "z": 960},
  {"id": "front-left-wrist", "label": "Left Wrist", "view": "front", "x": 83.0, "y": 47.0, "width": 8.0, "height": 5.0, "z": 960},
  {"id": "front-right-palm", "label": "Right Palm", "view": "front", "x": 16.0, "y": 49.0, "width": 12.0, "height": 8.0, "z": 904},
  {"id": "front-left-palm", "label": "Left Palm", "view": "front", "x": 84.0, "y": 49.0, "width": 12.0, "height": 8.0, "z": 904},
  {"id": "front-right-fingers", "label": "Right Fingers", "view": "front", "x": 14.0, "y": 53.0, "width": 14.0, "height": 9.0, "z": 874},
  {"id": "front-left-fingers", "label": "Left Fingers", "view": "front", "x": 86.0, "y": 53.0, "width": 14.0, "height": 9.0, "z": 874},
  {"id": "front-right-thigh", "label": "Right Thigh", "view": "front", "x": 42.0, "y": 59.0, "width": 15.0, "height": 17.0, "z": 745},
  {"id": "front-left-thigh", "label": "Left Thigh", "view": "front", "x": 58.0, "y": 59.0, "width": 15.0, "height": 17.0, "z": 745},
  {"id": "front-right-knee", "label": "Right Knee", "view": "front", "x": 41.0, "y": 68.0, "width": 12.0, "height": 8.0, "z": 904},
  {"id": "front-left-knee", "label": "Left Knee", "view": "front", "x": 59.0, "y": 68.0, "width": 12.0, "height": 8.0, "z": 904},
  {"id": "front-right-shin", "label": "Right Shin / Lower Leg", "view": "front", "x": 40.0, "y": 79.0, "width": 12.0, "height": 17.0, "z": 796},
  {"id": "front-left-shin", "label": "Left Shin / Lower Leg", "view": "front", "x": 60.0, "y": 79.0, "width": 12.0, "height": 17.0, "z": 796},
  {"id": "front-right-ankle", "label": "Right Ankle", "view": "front", "x": 39.0, "y": 90.0, "width": 8.0, "height": 5.0, "z": 960},
  {"id": "front-left-ankle", "label": "Left Ankle", "view": "front", "x": 61.0, "y": 90.0, "width": 8.0, "height": 5.0, "z": 960},
  {"id": "front-right-foot-top", "label": "Right Foot Top", "view": "front", "x": 37.0, "y": 95.0, "width": 13.0, "height": 6.0, "z": 922},
  {"id": "front-left-foot-top", "label": "Left Foot Top", "view": "front", "x": 63.0, "y": 95.0, "width": 13.0, "height": 6.0, "z": 922},
  {"id": "front-right-toes", "label": "Right Toes", "view": "front", "x": 36.0, "y": 98.0, "width": 12.0, "height": 4.0, "z": 952},
  {"id": "front-left-toes", "label": "Left Toes", "view": "front", "x": 64.0, "y": 98.0, "width": 12.0, "height": 4.0, "z": 952},
]
const backRegions: BodyRegion[] = [
  {"id": "back-occiput", "label": "Occiput / Back Of Head", "view": "back", "x": 50.0, "y": 7.0, "width": 21.0, "height": 10.0, "z": 790},
  {"id": "back-neck", "label": "Back Of Neck", "view": "back", "x": 50.0, "y": 16.0, "width": 16.0, "height": 7.0, "z": 888},
  {"id": "back-right-scapula", "label": "Right Shoulder Blade / Scapula", "view": "back", "x": 39.0, "y": 23.0, "width": 19.0, "height": 13.0, "z": 753},
  {"id": "back-left-scapula", "label": "Left Shoulder Blade / Scapula", "view": "back", "x": 61.0, "y": 23.0, "width": 19.0, "height": 13.0, "z": 753},
  {"id": "back-upper-back", "label": "Upper Back", "view": "back", "x": 50.0, "y": 24.0, "width": 31.0, "height": 14.0, "z": 566},
  {"id": "back-middle-back", "label": "Middle Back", "view": "back", "x": 50.0, "y": 33.0, "width": 27.0, "height": 14.0, "z": 622},
  {"id": "back-lower-back", "label": "Lower Back / Lumbar", "view": "back", "x": 50.0, "y": 40.0, "width": 27.0, "height": 11.0, "z": 703},
  {"id": "back-coccyx", "label": "Coccyx / Tailbone", "view": "back", "x": 50.0, "y": 45.0, "width": 14.0, "height": 7.0, "z": 902},
  {"id": "back-right-buttock", "label": "Right Buttock", "view": "back", "x": 42.0, "y": 49.0, "width": 17.0, "height": 13.0, "z": 779},
  {"id": "back-left-buttock", "label": "Left Buttock", "view": "back", "x": 58.0, "y": 49.0, "width": 17.0, "height": 13.0, "z": 779},
  {"id": "back-right-upper-arm", "label": "Right Upper Arm / Back", "view": "back", "x": 26.0, "y": 27.0, "width": 13.0, "height": 15.0, "z": 805},
  {"id": "back-left-upper-arm", "label": "Left Upper Arm / Back", "view": "back", "x": 74.0, "y": 27.0, "width": 13.0, "height": 15.0, "z": 805},
  {"id": "back-right-elbow", "label": "Right Elbow / Back", "view": "back", "x": 21.0, "y": 35.0, "width": 10.0, "height": 7.0, "z": 930},
  {"id": "back-left-elbow", "label": "Left Elbow / Back", "view": "back", "x": 79.0, "y": 35.0, "width": 10.0, "height": 7.0, "z": 930},
  {"id": "back-right-forearm", "label": "Right Forearm / Back", "view": "back", "x": 18.0, "y": 42.0, "width": 12.0, "height": 15.0, "z": 820},
  {"id": "back-left-forearm", "label": "Left Forearm / Back", "view": "back", "x": 82.0, "y": 42.0, "width": 12.0, "height": 15.0, "z": 820},
  {"id": "back-right-hand", "label": "Right Hand Back", "view": "back", "x": 15.0, "y": 50.0, "width": 13.0, "height": 12.0, "z": 844},
  {"id": "back-left-hand", "label": "Left Hand Back", "view": "back", "x": 85.0, "y": 50.0, "width": 13.0, "height": 12.0, "z": 844},
  {"id": "back-right-hamstring", "label": "Right Hamstring", "view": "back", "x": 42.0, "y": 59.0, "width": 16.0, "height": 17.0, "z": 728},
  {"id": "back-left-hamstring", "label": "Left Hamstring", "view": "back", "x": 58.0, "y": 59.0, "width": 16.0, "height": 17.0, "z": 728},
  {"id": "back-right-knee", "label": "Right Back Of Knee", "view": "back", "x": 41.0, "y": 68.0, "width": 13.0, "height": 7.0, "z": 909},
  {"id": "back-left-knee", "label": "Left Back Of Knee", "view": "back", "x": 59.0, "y": 68.0, "width": 13.0, "height": 7.0, "z": 909},
  {"id": "back-right-calf", "label": "Right Calf", "view": "back", "x": 40.0, "y": 78.0, "width": 13.0, "height": 16.0, "z": 792},
  {"id": "back-left-calf", "label": "Left Calf", "view": "back", "x": 60.0, "y": 78.0, "width": 13.0, "height": 16.0, "z": 792},
  {"id": "back-right-heel", "label": "Right Heel", "view": "back", "x": 39.0, "y": 91.0, "width": 9.0, "height": 6.0, "z": 946},
  {"id": "back-left-heel", "label": "Left Heel", "view": "back", "x": 61.0, "y": 91.0, "width": 9.0, "height": 6.0, "z": 946},
  {"id": "back-right-sole", "label": "Right Sole", "view": "back", "x": 37.0, "y": 96.0, "width": 13.0, "height": 7.0, "z": 909},
  {"id": "back-left-sole", "label": "Left Sole", "view": "back", "x": 63.0, "y": 96.0, "width": 13.0, "height": 7.0, "z": 909},
]
const selectOptions: { id: string; label: string }[] = [
  {"id": "front-scalp", "label": "Scalp"},
  {"id": "front-forehead", "label": "Forehead"},
  {"id": "front-right-eye", "label": "Right Eye"},
  {"id": "front-left-eye", "label": "Left Eye"},
  {"id": "front-nose", "label": "Nose"},
  {"id": "front-mouth", "label": "Mouth & Teeth"},
  {"id": "front-right-ear", "label": "Right Ear"},
  {"id": "front-left-ear", "label": "Left Ear"},
  {"id": "front-jaw-face", "label": "Jaw & Face"},
  {"id": "front-neck", "label": "Front Neck / Larynx"},
  {"id": "front-right-shoulder", "label": "Right Shoulder / Front"},
  {"id": "front-left-shoulder", "label": "Left Shoulder / Front"},
  {"id": "front-right-chest", "label": "Right Chest"},
  {"id": "front-left-chest", "label": "Left Chest"},
  {"id": "front-center-chest", "label": "Center Chest / Sternum"},
  {"id": "front-upper-abdomen", "label": "Upper Abdomen"},
  {"id": "front-lower-abdomen", "label": "Lower Abdomen"},
  {"id": "front-pelvic-groin", "label": "Pelvic / Groin Area"},
  {"id": "front-right-upper-arm", "label": "Right Upper Arm"},
  {"id": "front-left-upper-arm", "label": "Left Upper Arm"},
  {"id": "front-right-elbow", "label": "Right Elbow"},
  {"id": "front-left-elbow", "label": "Left Elbow"},
  {"id": "front-right-forearm", "label": "Right Forearm"},
  {"id": "front-left-forearm", "label": "Left Forearm"},
  {"id": "front-right-wrist", "label": "Right Wrist"},
  {"id": "front-left-wrist", "label": "Left Wrist"},
  {"id": "front-right-palm", "label": "Right Palm"},
  {"id": "front-left-palm", "label": "Left Palm"},
  {"id": "front-right-fingers", "label": "Right Fingers"},
  {"id": "front-left-fingers", "label": "Left Fingers"},
  {"id": "front-right-thigh", "label": "Right Thigh"},
  {"id": "front-left-thigh", "label": "Left Thigh"},
  {"id": "front-right-knee", "label": "Right Knee"},
  {"id": "front-left-knee", "label": "Left Knee"},
  {"id": "front-right-shin", "label": "Right Shin / Lower Leg"},
  {"id": "front-left-shin", "label": "Left Shin / Lower Leg"},
  {"id": "front-right-ankle", "label": "Right Ankle"},
  {"id": "front-left-ankle", "label": "Left Ankle"},
  {"id": "front-right-foot-top", "label": "Right Foot Top"},
  {"id": "front-left-foot-top", "label": "Left Foot Top"},
  {"id": "front-right-toes", "label": "Right Toes"},
  {"id": "front-left-toes", "label": "Left Toes"},
  {"id": "back-occiput", "label": "Occiput / Back Of Head"},
  {"id": "back-neck", "label": "Back Of Neck"},
  {"id": "back-right-scapula", "label": "Right Shoulder Blade / Scapula"},
  {"id": "back-left-scapula", "label": "Left Shoulder Blade / Scapula"},
  {"id": "back-upper-back", "label": "Upper Back"},
  {"id": "back-middle-back", "label": "Middle Back"},
  {"id": "back-lower-back", "label": "Lower Back / Lumbar"},
  {"id": "back-coccyx", "label": "Coccyx / Tailbone"},
  {"id": "back-right-buttock", "label": "Right Buttock"},
  {"id": "back-left-buttock", "label": "Left Buttock"},
  {"id": "back-right-upper-arm", "label": "Right Upper Arm / Back"},
  {"id": "back-left-upper-arm", "label": "Left Upper Arm / Back"},
  {"id": "back-right-elbow", "label": "Right Elbow / Back"},
  {"id": "back-left-elbow", "label": "Left Elbow / Back"},
  {"id": "back-right-forearm", "label": "Right Forearm / Back"},
  {"id": "back-left-forearm", "label": "Left Forearm / Back"},
  {"id": "back-right-hand", "label": "Right Hand Back"},
  {"id": "back-left-hand", "label": "Left Hand Back"},
  {"id": "back-right-hamstring", "label": "Right Hamstring"},
  {"id": "back-left-hamstring", "label": "Left Hamstring"},
  {"id": "back-right-knee", "label": "Right Back Of Knee"},
  {"id": "back-left-knee", "label": "Left Back Of Knee"},
  {"id": "back-right-calf", "label": "Right Calf"},
  {"id": "back-left-calf", "label": "Left Calf"},
  {"id": "back-right-heel", "label": "Right Heel"},
  {"id": "back-left-heel", "label": "Left Heel"},
  {"id": "back-right-sole", "label": "Right Sole"},
  {"id": "back-left-sole", "label": "Left Sole"},
]
const allRegions = [...frontRegions, ...backRegions]
const visibleRegions = computed(() => activeView.value === 'front' ? frontRegions : backRegions)
const selectedRegions = computed(() => selectedIds.value.map(id => allRegions.find(r => r.id === id)).filter((r): r is BodyRegion => Boolean(r)))
const isSelected = (id: string) => selectedIds.value.includes(id)

watch(() => props.modelValue, value => {
  if (value.length !== selectedIds.value.length || value.some((id, i) => id !== selectedIds.value[i])) {
    selectedIds.value = [...value]
  }
}, { deep: true })
function updateSelection(value: string[]) {
  selectedIds.value = value
  emit('update:modelValue', [...value])
}
function toggleRegion(id: string) {
  if (props.readonly) return
  updateSelection(isSelected(id) ? selectedIds.value.filter(item => item !== id) : [...selectedIds.value, id])
}
function selectRegion() {
  if (props.readonly || !selectValue.value) return
  const region = allRegions.find(item => item.id === selectValue.value)
  if (region) activeView.value = region.view
  if (!isSelected(selectValue.value)) updateSelection([...selectedIds.value, selectValue.value])
  selectValue.value = ''
}
</script>

<template>
  <section class="injury-map" :aria-labelledby="`${idPrefix}-title`">
    <h3 :id="`${idPrefix}-title`" class="injury-map__title">Injury Location / Interactive Body Map</h3>
    <div class="injury-map__layout">
      <div class="injury-map__left">
        <div class="injury-map__tabs" role="tablist" aria-label="Body view">
          <button v-for="view in (['front', 'back'] as BodyView[])" :key="view" type="button" role="tab"
            :aria-selected="activeView === view" :class="{ active: activeView === view }"
            @click="activeView = view">{{ view === 'front' ? 'Front' : 'Back' }}</button>
        </div>
        <div class="injury-map__stage" :class="{ 'injury-map__stage--back': activeView === 'back' }">
          <img v-if="activeView === 'front'" class="injury-map__body" :src="frontBodyImage" alt="Front human anatomy outline" draggable="false" />
          <img v-else class="injury-map__body" :src="backBodyImage" alt="Back human anatomy outline" draggable="false" />
          <button v-for="region in visibleRegions" :key="region.id" type="button"
            class="injury-map__hotspot" :class="{ selected: isSelected(region.id) }"
            :style="{ '--x': `${region.x}%`, '--y': `${region.y}%`, '--w': `${region.width}%`, '--h': `${region.height}%`, '--z': region.z ?? 100 }"
            :title="region.label" :aria-label="region.label" :aria-pressed="isSelected(region.id)"
            :disabled="readonly" @click="toggleRegion(region.id)">
            <span class="sr-only">{{ region.label }}</span>
          </button>
        </div>
      </div>
      <div class="injury-map__right">
        <label :for="`${idPrefix}-region`">Body region</label>
        <select :id="`${idPrefix}-region`" v-model="selectValue" :disabled="readonly" @change="selectRegion">
          <option value="">Select</option>
          <option v-for="option in selectOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
        </select>
        <div v-if="selectedRegions.length" class="injury-map__chips" aria-live="polite">
          <button v-for="region in selectedRegions" :key="region.id" type="button" :disabled="readonly"
            :title="`Remove ${region.label}`" @click="toggleRegion(region.id)">{{ region.label }} <span aria-hidden="true">×</span></button>
        </div>
        <p v-else class="injury-map__hint">Select the injury location if known.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.injury-map { width: 100%; background: #fff; color: #092438; font-family: Arial, sans-serif; padding: 0; }
.injury-map__title { font-size: 12px; font-weight: 700; margin: 0 0 12px; line-height: 1.4; }
.injury-map__layout { display: grid; grid-template-columns: 205px minmax(0,1fr); column-gap: 20px; align-items: start; }
.injury-map__left { min-width: 0; }
.injury-map__tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.injury-map__tabs button { padding: 9px 12px; background: white; border: 1px solid #d3e0e4; border-radius: 4px; color: #152d3b; font-size: 12px; cursor: pointer; }
.injury-map__tabs button.active { background: #007c6c; color: #fff; border-color: #007c6c; }
.injury-map__stage { position: relative; width: 205px; max-width: 100%; aspect-ratio: 560 / 1024; }
.injury-map__stage--back { aspect-ratio: 550 / 1024; }
.injury-map__body { display: block; width: 100%; height: 100%; object-fit: contain; user-select: none; pointer-events: none; }
.injury-map__hotspot { position: absolute; left: var(--x); top: var(--y); width: var(--w); height: var(--h); transform: translate(-50%,-50%); z-index: var(--z); border: 0; border-radius: 45%; background: transparent; padding: 0; cursor: pointer; }
.injury-map__hotspot:hover:not(:disabled), .injury-map__hotspot:focus-visible { background: rgba(0, 124, 108, .2); outline: 1px solid #008c82; }
.injury-map__hotspot.selected { background: rgba(244, 173, 54, .43); outline: 1px solid #c96b00; }
.injury-map__hotspot:disabled { cursor: default; }
.injury-map__right { min-width: 0; display: flex; flex-direction: column; align-items: stretch; }
.injury-map__right label { font-size: 12px; margin: 0 0 1px; }
.injury-map__right select { width: 100%; height: 36px; padding: 6px 12px; border: 1px solid #aec6c6; background: white; border-radius: 5px; color: #213a47; font-size: 12px; }
.injury-map__hint { margin: 18px 0 0; color: #ba5d25; font-size: 11px; }
.injury-map__chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; }
.injury-map__chips button { cursor: pointer; border: 1px solid #c96b00; border-radius: 6px; background: #fff4dd; color: #643d13; padding: 5px 8px; font-size: 11px; }
.injury-map__chips button span { font-size: 14px; padding-left: 4px; }
.sr-only { position: absolute; height: 1px; width: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
@media(max-width: 600px) { .injury-map__layout { grid-template-columns: 1fr; gap: 18px; } .injury-map__stage { margin: 0 auto; } }
</style>