<script setup lang="ts">
import { translate as localizeUi } from '@/localization/i18n'

import { computed, ref, watch } from 'vue'
import frontBodyImage from './body-front.png'
import backBodyImage from './body-back.png'

type BodyView = 'front' | 'back'
type BodyRegion = {
  id: string
  label: string
  view: BodyView
  x: number
  y: number
  width: number
  height: number
  z?: number
}

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    idPrefix?: string
    readonly?: boolean
  }>(),
  { modelValue: () => [], idPrefix: 'injury-body', readonly: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const activeView = ref<BodyView>('front')
const selectValue = ref('')
const selectedIds = ref<string[]>([...props.modelValue])

const frontRegions: BodyRegion[] = [
  {
    id: 'front-scalp',
    get label() {
      return localizeUi('Scalp')
    },
    view: 'front',
    x: 50.0,
    y: 5.0,
    width: 20.0,
    height: 8.0,
    z: 840,
  },
  {
    id: 'front-forehead',
    get label() {
      return localizeUi('Forehead')
    },
    view: 'front',
    x: 50.0,
    y: 7.0,
    width: 18.0,
    height: 5.0,
    z: 910,
  },
  {
    id: 'front-right-eye',
    get label() {
      return localizeUi('Right Eye')
    },
    view: 'front',
    x: 45.0,
    y: 9.0,
    width: 8.0,
    height: 4.0,
    z: 968,
  },
  {
    id: 'front-left-eye',
    get label() {
      return localizeUi('Left Eye')
    },
    view: 'front',
    x: 55.0,
    y: 9.0,
    width: 8.0,
    height: 4.0,
    z: 968,
  },
  {
    id: 'front-nose',
    get label() {
      return localizeUi('Nose')
    },
    view: 'front',
    x: 50.0,
    y: 11.0,
    width: 7.0,
    height: 5.0,
    z: 965,
  },
  {
    id: 'front-mouth',
    get label() {
      return localizeUi('Mouth & Teeth')
    },
    view: 'front',
    x: 50.0,
    y: 13.0,
    width: 11.0,
    height: 4.0,
    z: 956,
  },
  {
    id: 'front-right-ear',
    get label() {
      return localizeUi('Right Ear')
    },
    view: 'front',
    x: 40.0,
    y: 9.0,
    width: 7.0,
    height: 8.0,
    z: 944,
  },
  {
    id: 'front-left-ear',
    get label() {
      return localizeUi('Left Ear')
    },
    view: 'front',
    x: 60.0,
    y: 9.0,
    width: 7.0,
    height: 8.0,
    z: 944,
  },
  {
    id: 'front-jaw-face',
    get label() {
      return localizeUi('Jaw & Face')
    },
    view: 'front',
    x: 50.0,
    y: 12.0,
    width: 20.0,
    height: 10.0,
    z: 800,
  },
  {
    id: 'front-neck',
    get label() {
      return localizeUi('Front Neck / Larynx')
    },
    view: 'front',
    x: 50.0,
    y: 17.0,
    width: 16.0,
    height: 7.0,
    z: 888,
  },
  {
    id: 'front-right-shoulder',
    get label() {
      return localizeUi('Right Shoulder / Front')
    },
    view: 'front',
    x: 32.0,
    y: 20.0,
    width: 15.0,
    height: 9.0,
    z: 865,
  },
  {
    id: 'front-left-shoulder',
    get label() {
      return localizeUi('Left Shoulder / Front')
    },
    view: 'front',
    x: 68.0,
    y: 20.0,
    width: 15.0,
    height: 9.0,
    z: 865,
  },
  {
    id: 'front-right-chest',
    get label() {
      return localizeUi('Right Chest')
    },
    view: 'front',
    x: 42.0,
    y: 26.0,
    width: 17.0,
    height: 13.0,
    z: 779,
  },
  {
    id: 'front-left-chest',
    get label() {
      return localizeUi('Left Chest')
    },
    view: 'front',
    x: 58.0,
    y: 26.0,
    width: 17.0,
    height: 13.0,
    z: 779,
  },
  {
    id: 'front-center-chest',
    get label() {
      return localizeUi('Center Chest / Sternum')
    },
    view: 'front',
    x: 50.0,
    y: 26.0,
    width: 13.0,
    height: 12.0,
    z: 844,
  },
  {
    id: 'front-upper-abdomen',
    get label() {
      return localizeUi('Upper Abdomen')
    },
    view: 'front',
    x: 50.0,
    y: 35.0,
    width: 20.0,
    height: 10.0,
    z: 800,
  },
  {
    id: 'front-lower-abdomen',
    get label() {
      return localizeUi('Lower Abdomen')
    },
    view: 'front',
    x: 50.0,
    y: 42.0,
    width: 21.0,
    height: 10.0,
    z: 790,
  },
  {
    id: 'front-pelvic-groin',
    get label() {
      return localizeUi('Pelvic / Groin Area')
    },
    view: 'front',
    x: 50.0,
    y: 49.0,
    width: 19.0,
    height: 9.0,
    z: 829,
  },
  {
    id: 'front-right-upper-arm',
    get label() {
      return localizeUi('Right Upper Arm')
    },
    view: 'front',
    x: 25.0,
    y: 27.0,
    width: 13.0,
    height: 15.0,
    z: 805,
  },
  {
    id: 'front-left-upper-arm',
    get label() {
      return localizeUi('Left Upper Arm')
    },
    view: 'front',
    x: 75.0,
    y: 27.0,
    width: 13.0,
    height: 15.0,
    z: 805,
  },
  {
    id: 'front-right-elbow',
    get label() {
      return localizeUi('Right Elbow')
    },
    view: 'front',
    x: 21.0,
    y: 35.0,
    width: 10.0,
    height: 7.0,
    z: 930,
  },
  {
    id: 'front-left-elbow',
    get label() {
      return localizeUi('Left Elbow')
    },
    view: 'front',
    x: 79.0,
    y: 35.0,
    width: 10.0,
    height: 7.0,
    z: 930,
  },
  {
    id: 'front-right-forearm',
    get label() {
      return localizeUi('Right Forearm')
    },
    view: 'front',
    x: 18.0,
    y: 42.0,
    width: 12.0,
    height: 15.0,
    z: 820,
  },
  {
    id: 'front-left-forearm',
    get label() {
      return localizeUi('Left Forearm')
    },
    view: 'front',
    x: 82.0,
    y: 42.0,
    width: 12.0,
    height: 15.0,
    z: 820,
  },
  {
    id: 'front-right-wrist',
    get label() {
      return localizeUi('Right Wrist')
    },
    view: 'front',
    x: 17.0,
    y: 47.0,
    width: 8.0,
    height: 5.0,
    z: 960,
  },
  {
    id: 'front-left-wrist',
    get label() {
      return localizeUi('Left Wrist')
    },
    view: 'front',
    x: 83.0,
    y: 47.0,
    width: 8.0,
    height: 5.0,
    z: 960,
  },
  {
    id: 'front-right-palm',
    get label() {
      return localizeUi('Right Palm')
    },
    view: 'front',
    x: 16.0,
    y: 49.0,
    width: 12.0,
    height: 8.0,
    z: 904,
  },
  {
    id: 'front-left-palm',
    get label() {
      return localizeUi('Left Palm')
    },
    view: 'front',
    x: 84.0,
    y: 49.0,
    width: 12.0,
    height: 8.0,
    z: 904,
  },
  {
    id: 'front-right-fingers',
    get label() {
      return localizeUi('Right Fingers')
    },
    view: 'front',
    x: 14.0,
    y: 53.0,
    width: 14.0,
    height: 9.0,
    z: 874,
  },
  {
    id: 'front-left-fingers',
    get label() {
      return localizeUi('Left Fingers')
    },
    view: 'front',
    x: 86.0,
    y: 53.0,
    width: 14.0,
    height: 9.0,
    z: 874,
  },
  {
    id: 'front-right-thigh',
    get label() {
      return localizeUi('Right Thigh')
    },
    view: 'front',
    x: 42.0,
    y: 59.0,
    width: 15.0,
    height: 17.0,
    z: 745,
  },
  {
    id: 'front-left-thigh',
    get label() {
      return localizeUi('Left Thigh')
    },
    view: 'front',
    x: 58.0,
    y: 59.0,
    width: 15.0,
    height: 17.0,
    z: 745,
  },
  {
    id: 'front-right-knee',
    get label() {
      return localizeUi('Right Knee')
    },
    view: 'front',
    x: 41.0,
    y: 68.0,
    width: 12.0,
    height: 8.0,
    z: 904,
  },
  {
    id: 'front-left-knee',
    get label() {
      return localizeUi('Left Knee')
    },
    view: 'front',
    x: 59.0,
    y: 68.0,
    width: 12.0,
    height: 8.0,
    z: 904,
  },
  {
    id: 'front-right-shin',
    get label() {
      return localizeUi('Right Shin / Lower Leg')
    },
    view: 'front',
    x: 40.0,
    y: 79.0,
    width: 12.0,
    height: 17.0,
    z: 796,
  },
  {
    id: 'front-left-shin',
    get label() {
      return localizeUi('Left Shin / Lower Leg')
    },
    view: 'front',
    x: 60.0,
    y: 79.0,
    width: 12.0,
    height: 17.0,
    z: 796,
  },
  {
    id: 'front-right-ankle',
    get label() {
      return localizeUi('Right Ankle')
    },
    view: 'front',
    x: 39.0,
    y: 90.0,
    width: 8.0,
    height: 5.0,
    z: 960,
  },
  {
    id: 'front-left-ankle',
    get label() {
      return localizeUi('Left Ankle')
    },
    view: 'front',
    x: 61.0,
    y: 90.0,
    width: 8.0,
    height: 5.0,
    z: 960,
  },
  {
    id: 'front-right-foot-top',
    get label() {
      return localizeUi('Right Foot Top')
    },
    view: 'front',
    x: 37.0,
    y: 95.0,
    width: 13.0,
    height: 6.0,
    z: 922,
  },
  {
    id: 'front-left-foot-top',
    get label() {
      return localizeUi('Left Foot Top')
    },
    view: 'front',
    x: 63.0,
    y: 95.0,
    width: 13.0,
    height: 6.0,
    z: 922,
  },
  {
    id: 'front-right-toes',
    get label() {
      return localizeUi('Right Toes')
    },
    view: 'front',
    x: 36.0,
    y: 98.0,
    width: 12.0,
    height: 4.0,
    z: 952,
  },
  {
    id: 'front-left-toes',
    get label() {
      return localizeUi('Left Toes')
    },
    view: 'front',
    x: 64.0,
    y: 98.0,
    width: 12.0,
    height: 4.0,
    z: 952,
  },
]
const backRegions: BodyRegion[] = [
  {
    id: 'back-occiput',
    get label() {
      return localizeUi('Occiput / Back Of Head')
    },
    view: 'back',
    x: 50.0,
    y: 7.0,
    width: 21.0,
    height: 10.0,
    z: 790,
  },
  {
    id: 'back-neck',
    get label() {
      return localizeUi('Back of Neck')
    },
    view: 'back',
    x: 50.0,
    y: 16.0,
    width: 16.0,
    height: 7.0,
    z: 888,
  },
  {
    id: 'back-right-scapula',
    get label() {
      return localizeUi('Right Shoulder Blade / Scapula')
    },
    view: 'back',
    x: 39.0,
    y: 23.0,
    width: 19.0,
    height: 13.0,
    z: 753,
  },
  {
    id: 'back-left-scapula',
    get label() {
      return localizeUi('Left Shoulder Blade / Scapula')
    },
    view: 'back',
    x: 61.0,
    y: 23.0,
    width: 19.0,
    height: 13.0,
    z: 753,
  },
  {
    id: 'back-upper-back',
    get label() {
      return localizeUi('Upper Back')
    },
    view: 'back',
    x: 50.0,
    y: 24.0,
    width: 31.0,
    height: 14.0,
    z: 566,
  },
  {
    id: 'back-middle-back',
    get label() {
      return localizeUi('Middle Back')
    },
    view: 'back',
    x: 50.0,
    y: 33.0,
    width: 27.0,
    height: 14.0,
    z: 622,
  },
  {
    id: 'back-lower-back',
    get label() {
      return localizeUi('Lower Back / Lumbar')
    },
    view: 'back',
    x: 50.0,
    y: 40.0,
    width: 27.0,
    height: 11.0,
    z: 703,
  },
  {
    id: 'back-coccyx',
    get label() {
      return localizeUi('Coccyx / Tailbone')
    },
    view: 'back',
    x: 50.0,
    y: 45.0,
    width: 14.0,
    height: 7.0,
    z: 902,
  },
  {
    id: 'back-right-buttock',
    get label() {
      return localizeUi('Right Buttock')
    },
    view: 'back',
    x: 42.0,
    y: 49.0,
    width: 17.0,
    height: 13.0,
    z: 779,
  },
  {
    id: 'back-left-buttock',
    get label() {
      return localizeUi('Left Buttock')
    },
    view: 'back',
    x: 58.0,
    y: 49.0,
    width: 17.0,
    height: 13.0,
    z: 779,
  },
  {
    id: 'back-right-upper-arm',
    get label() {
      return localizeUi('Right Upper Arm / Back')
    },
    view: 'back',
    x: 26.0,
    y: 27.0,
    width: 13.0,
    height: 15.0,
    z: 805,
  },
  {
    id: 'back-left-upper-arm',
    get label() {
      return localizeUi('Left Upper Arm / Back')
    },
    view: 'back',
    x: 74.0,
    y: 27.0,
    width: 13.0,
    height: 15.0,
    z: 805,
  },
  {
    id: 'back-right-elbow',
    get label() {
      return localizeUi('Right Elbow / Back')
    },
    view: 'back',
    x: 21.0,
    y: 35.0,
    width: 10.0,
    height: 7.0,
    z: 930,
  },
  {
    id: 'back-left-elbow',
    get label() {
      return localizeUi('Left Elbow / Back')
    },
    view: 'back',
    x: 79.0,
    y: 35.0,
    width: 10.0,
    height: 7.0,
    z: 930,
  },
  {
    id: 'back-right-forearm',
    get label() {
      return localizeUi('Right Forearm / Back')
    },
    view: 'back',
    x: 18.0,
    y: 42.0,
    width: 12.0,
    height: 15.0,
    z: 820,
  },
  {
    id: 'back-left-forearm',
    get label() {
      return localizeUi('Left Forearm / Back')
    },
    view: 'back',
    x: 82.0,
    y: 42.0,
    width: 12.0,
    height: 15.0,
    z: 820,
  },
  {
    id: 'back-right-hand',
    get label() {
      return localizeUi('Right Hand Back')
    },
    view: 'back',
    x: 15.0,
    y: 50.0,
    width: 13.0,
    height: 12.0,
    z: 844,
  },
  {
    id: 'back-left-hand',
    get label() {
      return localizeUi('Left Hand Back')
    },
    view: 'back',
    x: 85.0,
    y: 50.0,
    width: 13.0,
    height: 12.0,
    z: 844,
  },
  {
    id: 'back-right-hamstring',
    get label() {
      return localizeUi('Right Hamstring')
    },
    view: 'back',
    x: 42.0,
    y: 59.0,
    width: 16.0,
    height: 17.0,
    z: 728,
  },
  {
    id: 'back-left-hamstring',
    get label() {
      return localizeUi('Left Hamstring')
    },
    view: 'back',
    x: 58.0,
    y: 59.0,
    width: 16.0,
    height: 17.0,
    z: 728,
  },
  {
    id: 'back-right-knee',
    get label() {
      return localizeUi('Right Back of Knee')
    },
    view: 'back',
    x: 41.0,
    y: 68.0,
    width: 13.0,
    height: 7.0,
    z: 909,
  },
  {
    id: 'back-left-knee',
    get label() {
      return localizeUi('Left Back of Knee')
    },
    view: 'back',
    x: 59.0,
    y: 68.0,
    width: 13.0,
    height: 7.0,
    z: 909,
  },
  {
    id: 'back-right-calf',
    get label() {
      return localizeUi('Right Calf')
    },
    view: 'back',
    x: 40.0,
    y: 78.0,
    width: 13.0,
    height: 16.0,
    z: 792,
  },
  {
    id: 'back-left-calf',
    get label() {
      return localizeUi('Left Calf')
    },
    view: 'back',
    x: 60.0,
    y: 78.0,
    width: 13.0,
    height: 16.0,
    z: 792,
  },
  {
    id: 'back-right-heel',
    get label() {
      return localizeUi('Right Heel')
    },
    view: 'back',
    x: 39.0,
    y: 91.0,
    width: 9.0,
    height: 6.0,
    z: 946,
  },
  {
    id: 'back-left-heel',
    get label() {
      return localizeUi('Left Heel')
    },
    view: 'back',
    x: 61.0,
    y: 91.0,
    width: 9.0,
    height: 6.0,
    z: 946,
  },
  {
    id: 'back-right-sole',
    get label() {
      return localizeUi('Right Sole')
    },
    view: 'back',
    x: 37.0,
    y: 96.0,
    width: 13.0,
    height: 7.0,
    z: 909,
  },
  {
    id: 'back-left-sole',
    get label() {
      return localizeUi('Left Sole')
    },
    view: 'back',
    x: 63.0,
    y: 96.0,
    width: 13.0,
    height: 7.0,
    z: 909,
  },
]
const selectOptions: { id: string; label: string }[] = [
  {
    id: 'front-scalp',
    get label() {
      return localizeUi('Scalp')
    },
  },
  {
    id: 'front-forehead',
    get label() {
      return localizeUi('Forehead')
    },
  },
  {
    id: 'front-right-eye',
    get label() {
      return localizeUi('Right Eye')
    },
  },
  {
    id: 'front-left-eye',
    get label() {
      return localizeUi('Left Eye')
    },
  },
  {
    id: 'front-nose',
    get label() {
      return localizeUi('Nose')
    },
  },
  {
    id: 'front-mouth',
    get label() {
      return localizeUi('Mouth & Teeth')
    },
  },
  {
    id: 'front-right-ear',
    get label() {
      return localizeUi('Right Ear')
    },
  },
  {
    id: 'front-left-ear',
    get label() {
      return localizeUi('Left Ear')
    },
  },
  {
    id: 'front-jaw-face',
    get label() {
      return localizeUi('Jaw & Face')
    },
  },
  {
    id: 'front-neck',
    get label() {
      return localizeUi('Front Neck / Larynx')
    },
  },
  {
    id: 'front-right-shoulder',
    get label() {
      return localizeUi('Right Shoulder / Front')
    },
  },
  {
    id: 'front-left-shoulder',
    get label() {
      return localizeUi('Left Shoulder / Front')
    },
  },
  {
    id: 'front-right-chest',
    get label() {
      return localizeUi('Right Chest')
    },
  },
  {
    id: 'front-left-chest',
    get label() {
      return localizeUi('Left Chest')
    },
  },
  {
    id: 'front-center-chest',
    get label() {
      return localizeUi('Center Chest / Sternum')
    },
  },
  {
    id: 'front-upper-abdomen',
    get label() {
      return localizeUi('Upper Abdomen')
    },
  },
  {
    id: 'front-lower-abdomen',
    get label() {
      return localizeUi('Lower Abdomen')
    },
  },
  {
    id: 'front-pelvic-groin',
    get label() {
      return localizeUi('Pelvic / Groin Area')
    },
  },
  {
    id: 'front-right-upper-arm',
    get label() {
      return localizeUi('Right Upper Arm')
    },
  },
  {
    id: 'front-left-upper-arm',
    get label() {
      return localizeUi('Left Upper Arm')
    },
  },
  {
    id: 'front-right-elbow',
    get label() {
      return localizeUi('Right Elbow')
    },
  },
  {
    id: 'front-left-elbow',
    get label() {
      return localizeUi('Left Elbow')
    },
  },
  {
    id: 'front-right-forearm',
    get label() {
      return localizeUi('Right Forearm')
    },
  },
  {
    id: 'front-left-forearm',
    get label() {
      return localizeUi('Left Forearm')
    },
  },
  {
    id: 'front-right-wrist',
    get label() {
      return localizeUi('Right Wrist')
    },
  },
  {
    id: 'front-left-wrist',
    get label() {
      return localizeUi('Left Wrist')
    },
  },
  {
    id: 'front-right-palm',
    get label() {
      return localizeUi('Right Palm')
    },
  },
  {
    id: 'front-left-palm',
    get label() {
      return localizeUi('Left Palm')
    },
  },
  {
    id: 'front-right-fingers',
    get label() {
      return localizeUi('Right Fingers')
    },
  },
  {
    id: 'front-left-fingers',
    get label() {
      return localizeUi('Left Fingers')
    },
  },
  {
    id: 'front-right-thigh',
    get label() {
      return localizeUi('Right Thigh')
    },
  },
  {
    id: 'front-left-thigh',
    get label() {
      return localizeUi('Left Thigh')
    },
  },
  {
    id: 'front-right-knee',
    get label() {
      return localizeUi('Right Knee')
    },
  },
  {
    id: 'front-left-knee',
    get label() {
      return localizeUi('Left Knee')
    },
  },
  {
    id: 'front-right-shin',
    get label() {
      return localizeUi('Right Shin / Lower Leg')
    },
  },
  {
    id: 'front-left-shin',
    get label() {
      return localizeUi('Left Shin / Lower Leg')
    },
  },
  {
    id: 'front-right-ankle',
    get label() {
      return localizeUi('Right Ankle')
    },
  },
  {
    id: 'front-left-ankle',
    get label() {
      return localizeUi('Left Ankle')
    },
  },
  {
    id: 'front-right-foot-top',
    get label() {
      return localizeUi('Right Foot Top')
    },
  },
  {
    id: 'front-left-foot-top',
    get label() {
      return localizeUi('Left Foot Top')
    },
  },
  {
    id: 'front-right-toes',
    get label() {
      return localizeUi('Right Toes')
    },
  },
  {
    id: 'front-left-toes',
    get label() {
      return localizeUi('Left Toes')
    },
  },
  {
    id: 'back-occiput',
    get label() {
      return localizeUi('Occiput / Back Of Head')
    },
  },
  {
    id: 'back-neck',
    get label() {
      return localizeUi('Back of Neck')
    },
  },
  {
    id: 'back-right-scapula',
    get label() {
      return localizeUi('Right Shoulder Blade / Scapula')
    },
  },
  {
    id: 'back-left-scapula',
    get label() {
      return localizeUi('Left Shoulder Blade / Scapula')
    },
  },
  {
    id: 'back-upper-back',
    get label() {
      return localizeUi('Upper Back')
    },
  },
  {
    id: 'back-middle-back',
    get label() {
      return localizeUi('Middle Back')
    },
  },
  {
    id: 'back-lower-back',
    get label() {
      return localizeUi('Lower Back / Lumbar')
    },
  },
  {
    id: 'back-coccyx',
    get label() {
      return localizeUi('Coccyx / Tailbone')
    },
  },
  {
    id: 'back-right-buttock',
    get label() {
      return localizeUi('Right Buttock')
    },
  },
  {
    id: 'back-left-buttock',
    get label() {
      return localizeUi('Left Buttock')
    },
  },
  {
    id: 'back-right-upper-arm',
    get label() {
      return localizeUi('Right Upper Arm / Back')
    },
  },
  {
    id: 'back-left-upper-arm',
    get label() {
      return localizeUi('Left Upper Arm / Back')
    },
  },
  {
    id: 'back-right-elbow',
    get label() {
      return localizeUi('Right Elbow / Back')
    },
  },
  {
    id: 'back-left-elbow',
    get label() {
      return localizeUi('Left Elbow / Back')
    },
  },
  {
    id: 'back-right-forearm',
    get label() {
      return localizeUi('Right Forearm / Back')
    },
  },
  {
    id: 'back-left-forearm',
    get label() {
      return localizeUi('Left Forearm / Back')
    },
  },
  {
    id: 'back-right-hand',
    get label() {
      return localizeUi('Right Hand Back')
    },
  },
  {
    id: 'back-left-hand',
    get label() {
      return localizeUi('Left Hand Back')
    },
  },
  {
    id: 'back-right-hamstring',
    get label() {
      return localizeUi('Right Hamstring')
    },
  },
  {
    id: 'back-left-hamstring',
    get label() {
      return localizeUi('Left Hamstring')
    },
  },
  {
    id: 'back-right-knee',
    get label() {
      return localizeUi('Right Back of Knee')
    },
  },
  {
    id: 'back-left-knee',
    get label() {
      return localizeUi('Left Back of Knee')
    },
  },
  {
    id: 'back-right-calf',
    get label() {
      return localizeUi('Right Calf')
    },
  },
  {
    id: 'back-left-calf',
    get label() {
      return localizeUi('Left Calf')
    },
  },
  {
    id: 'back-right-heel',
    get label() {
      return localizeUi('Right Heel')
    },
  },
  {
    id: 'back-left-heel',
    get label() {
      return localizeUi('Left Heel')
    },
  },
  {
    id: 'back-right-sole',
    get label() {
      return localizeUi('Right Sole')
    },
  },
  {
    id: 'back-left-sole',
    get label() {
      return localizeUi('Left Sole')
    },
  },
]
const allRegions = [...frontRegions, ...backRegions]
const visibleRegions = computed(() => (activeView.value === 'front' ? frontRegions : backRegions))
const selectedRegions = computed(() =>
  selectedIds.value
    .map((id) => allRegions.find((r) => r.id === id))
    .filter((r): r is BodyRegion => Boolean(r)),
)
const isSelected = (id: string) => selectedIds.value.includes(id)

watch(
  () => props.modelValue,
  (value) => {
    if (
      value.length !== selectedIds.value.length ||
      value.some((id, i) => id !== selectedIds.value[i])
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
  updateSelection(
    isSelected(id) ? selectedIds.value.filter((item) => item !== id) : [...selectedIds.value, id],
  )
}
function selectRegion() {
  if (props.readonly || !selectValue.value) return
  const region = allRegions.find((item) => item.id === selectValue.value)
  if (region) activeView.value = region.view
  if (!isSelected(selectValue.value)) updateSelection([...selectedIds.value, selectValue.value])
  selectValue.value = ''
}
</script>

<template>
  <section class="injury-map" :aria-labelledby="`${idPrefix}-title`">
    <h3 :id="`${idPrefix}-title`" class="injury-map__title">
      {{ $t('Injury Location / Interactive Body Map') }}
    </h3>
    <div class="injury-map__layout">
      <div class="injury-map__left">
        <div class="injury-map__tabs" role="tablist" :aria-label="$t('Body view')">
          <button
            v-for="view in ['front', 'back'] as BodyView[]"
            :key="view"
            type="button"
            role="tab"
            :aria-selected="activeView === view"
            :class="{ active: activeView === view }"
            @click="activeView = view"
          >
            {{ view === 'front' ? $t('bodyView.front') : $t('bodyView.back') }}
          </button>
        </div>
        <div
          class="injury-map__stage"
          :class="{ 'injury-map__stage--back': activeView === 'back' }"
        >
          <img
            v-if="activeView === 'front'"
            class="injury-map__body"
            :src="frontBodyImage"
            :alt="$t('Front human anatomy outline')"
            draggable="false"
          />
          <img
            v-else
            class="injury-map__body"
            :src="backBodyImage"
            :alt="$t('Back human anatomy outline')"
            draggable="false"
          />
          <button
            v-for="region in visibleRegions"
            :key="region.id"
            type="button"
            class="injury-map__hotspot"
            :class="{ selected: isSelected(region.id) }"
            :style="{
              '--x': `${region.x}%`,
              '--y': `${region.y}%`,
              '--w': `${region.width}%`,
              '--h': `${region.height}%`,
              '--z': region.z ?? 100,
            }"
            :title="region.label"
            :aria-label="region.label"
            :aria-pressed="isSelected(region.id)"
            :disabled="readonly"
            @click="toggleRegion(region.id)"
          >
            <span class="sr-only">{{ region.label }}</span>
          </button>
        </div>
      </div>
      <div class="injury-map__right">
        <label :for="`${idPrefix}-region`">{{ $t('Body region') }}</label>
        <select
          :id="`${idPrefix}-region`"
          v-model="selectValue"
          :disabled="readonly"
          @change="selectRegion"
        >
          <option value="">{{ $t('Select') }}</option>
          <option v-for="option in selectOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
        <div v-if="selectedRegions.length" class="injury-map__chips" aria-live="polite">
          <button
            v-for="region in selectedRegions"
            :key="region.id"
            type="button"
            :disabled="readonly"
            :title="$t('uiDynamic.removeItem', { p0: region.label })"
            @click="toggleRegion(region.id)"
          >
            {{ region.label }} <span aria-hidden="true">×</span>
          </button>
        </div>
        <p v-else class="injury-map__hint">{{ $t('Select the injury location if known.') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.injury-map {
  width: 100%;
  background: #fff;
  color: #092438;
  font-family: Arial, sans-serif;
  padding: 0;
}
.injury-map__title {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 12px;
  line-height: 1.4;
}
.injury-map__layout {
  display: grid;
  grid-template-columns: 205px minmax(0, 1fr);
  column-gap: 20px;
  align-items: start;
}
.injury-map__left {
  min-width: 0;
}
.injury-map__tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.injury-map__tabs button {
  padding: 9px 12px;
  background: white;
  border: 1px solid #d3e0e4;
  border-radius: 4px;
  color: #152d3b;
  font-size: 12px;
  cursor: pointer;
}
.injury-map__tabs button.active {
  background: #007c6c;
  color: #fff;
  border-color: #007c6c;
}
.injury-map__stage {
  position: relative;
  width: 205px;
  max-width: 100%;
  aspect-ratio: 560 / 1024;
}
.injury-map__stage--back {
  aspect-ratio: 550 / 1024;
}
.injury-map__body {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}
.injury-map__hotspot {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--w);
  height: var(--h);
  transform: translate(-50%, -50%);
  z-index: var(--z);
  border: 0;
  border-radius: 45%;
  background: transparent;
  padding: 0;
  cursor: pointer;
}
.injury-map__hotspot:hover:not(:disabled),
.injury-map__hotspot:focus-visible {
  background: rgba(0, 124, 108, 0.2);
  outline: 1px solid #008c82;
}
.injury-map__hotspot.selected {
  background: rgba(244, 173, 54, 0.43);
  outline: 1px solid #c96b00;
}
.injury-map__hotspot:disabled {
  cursor: default;
}
.injury-map__right {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.injury-map__right label {
  font-size: 12px;
  margin: 0 0 1px;
}
.injury-map__right select {
  width: 100%;
  height: 36px;
  padding: 6px 12px;
  border: 1px solid #aec6c6;
  background: white;
  border-radius: 5px;
  color: #213a47;
  font-size: 12px;
}
.injury-map__hint {
  margin: 18px 0 0;
  color: #ba5d25;
  font-size: 11px;
}
.injury-map__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
}
.injury-map__chips button {
  cursor: pointer;
  border: 1px solid #c96b00;
  border-radius: 6px;
  background: #fff4dd;
  color: #643d13;
  padding: 5px 8px;
  font-size: 11px;
}
.injury-map__chips button span {
  font-size: 14px;
  padding-inline-start: 4px;
}
.sr-only {
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
@media (max-width: 600px) {
  .injury-map__layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .injury-map__stage {
    margin: 0 auto;
  }
}
</style>
