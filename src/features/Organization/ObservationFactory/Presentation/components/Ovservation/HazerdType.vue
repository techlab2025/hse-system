<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import RadioButton from 'primevue/radiobutton'

import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController.ts'
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import { label } from '@primeuix/themes/aura/metergroup'

// Props from parent
const props = defineProps<{
  riskLevel: RiskLevelEnum | null
  is_near_miss: number | null
  modelTakeAction?: 'yes' | 'no' | null
  modelSolved?: 'yes' | 'no' | null
  modelAction?: string
  modelHazerdType?: TitleInterface | null
}>()

const emit = defineEmits(['update:data'])

const takeAction = ref<'yes' | 'no' | null>(props.modelTakeAction ?? null)
const solved = ref<'yes' | 'no' | null>(props.modelSolved ?? null)
const description = ref<string>(props.modelAction ?? '')

const hazerd = ref<TitleInterface | null>(props.modelHazerdType ?? null)
const hazardTypeId = ref<number | null>(props.modelHazerdType?.id ?? null)

const indexHazardController = IndexHazardTypeController.getInstance()
const hazerdParams = new IndexHazardTypeParams('', 1, 10, 1)

const showHazardSection = computed(() => {
  return props.riskLevel === RiskLevelEnum.Medium && props.is_near_miss === 1
})

const showRadioAndDescription = computed(() => {
  return (
    props.riskLevel === RiskLevelEnum.Low ||
    props.riskLevel === RiskLevelEnum.Medium ||
    props.riskLevel === RiskLevelEnum.High
  )
})

const showRadioButtons = computed(() => showRadioAndDescription.value)
const showSolvedAndDescription = computed(() => takeAction.value === 'yes')

// Sync when parent updates (important for edit mode)
watch(
  () => props.modelHazerdType,
  (val) => {
    hazerd.value = val ?? null
  },
  { immediate: true },
)

// Emit updated data
watch([takeAction, solved, description], () => {
  updateEmitData()
})

const setHazerd = (data: TitleInterface) => {
  hazerd.value = data
  hazardTypeId.value = data.id
  updateEmitData()
}

const updateEmitData = () => {
  emit('update:data', {
    hazerd: hazerd.value ? [hazerd.value] : [],
    type_id: hazardTypeId.value ?? null,
    take_action: takeAction.value,
    solved: solved.value,
    action: description.value,
  })
}
</script>

<template>
  <div class="hazard-type-container grid grid-cols-12 gap-4" v-if="showRadioAndDescription">
    <div class="col-span-12">
      <!-- Hazard Type Select -->
      <div class="input-wrapper" v-if="showHazardSection">
        <CustomSelectInput
          :modelValue="hazerd"
          :controller="indexHazardController"
          :params="hazerdParams"
          id="Hazerd"
          label="Hazard Type"
          placeholder="Select Hazard"
          @update:modelValue="setHazerd"
        />
      </div>

      <!-- Take Action & Solved Radios -->
      <div class="grid grid-cols-12 gap-1 radio-container" v-if="showRadioButtons">
        <!-- Take Action -->
        <div class="col-span-12 md:col-span-6">
          <label class="radio-title">{{ $t('take action') }}</label>
          <div class="radio-answers">
            <div class="radio-selection" :class="{ selected: takeAction === 'yes' }">
              <RadioButton v-model="takeAction" name="takeAction" value="yes" />
              <label>Yes</label>
            </div>

            <div class=" radio-selection" :class="{ selected: takeAction === 'no' }">
              <RadioButton v-model="takeAction" name="takeAction" value="no" />
              <label>No</label>
            </div>
          </div>
        </div>

        <!-- Solved -->
        <div class="col-span-12 md:col-span-6" v-show="showSolvedAndDescription">
          <label class="radio-title">{{ $t('solved') }}</label>
          <div class="radio-answers">
            <div class="radio-selection" :class="{ selected: solved === 'yes' }">
              <RadioButton v-model="solved" name="solved" value="yes" />
              <label>Yes</label>
            </div>

            <div class="radio-selection" :class="{ selected: solved === 'no' }">
              <RadioButton v-model="solved" name="solved" value="no" />
              <label>No</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Description -->
      <div class="col-span-12" v-show="showSolvedAndDescription">
        <div class="input-wrapper">
          <label>{{ $t('action Description') }}</label>
          <input
            class="input"
            :placeholder="$t('add your description')"
            type="text"
            v-model="description"
          />
        </div>
      </div>
    </div>
  </div>
</template>
