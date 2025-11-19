<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController.ts'
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import { RiskLevelEnum } from '../../Core/Enums/risk_level_enum'

// Props from parent
const props = defineProps<{
  riskLevel: RiskLevelEnum | null
  is_near_miss: number | null
  modelTakeAction?: 'yes' | 'no' | null
  modelSolved?: 'yes' | 'no' | null
  modelAction?: string
}>()

const emit = defineEmits(['update:data'])
const takeAction = ref<'yes' | 'no' | null>(props.modelTakeAction ?? null)
const solved = ref<'yes' | 'no' | null>(props.modelSolved ?? null)
const description = ref<string>(props.modelAction ?? '')

const hazerd = ref<TitleInterface | null>(null)
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

const showRadioButtons = computed(() => {
  return (
    props.riskLevel === RiskLevelEnum.Low ||
    props.riskLevel === RiskLevelEnum.Medium ||
    props.riskLevel === RiskLevelEnum.High
  )
})

const showSolvedAndDescription = computed(() => {
  return takeAction.value === 'yes'
})

// Watchers
watch([takeAction, solved, description], () => {
  updateEmitData()
})

const setHazerd = (data: TitleInterface) => {
  hazerd.value = data
  updateEmitData()
}

const updateEmitData = () => {
  emit('update:data', {
    hazerd: hazerd.value ? [hazerd.value] : [],
    type_id: hazerd.value?.id ?? null,
    take_action: takeAction.value,
    solved: solved.value,
    action: description.value,
  })
}

</script>

<template>
  <div class="hazard-type-container grid grid-cols-12 gap-4" v-if="showRadioAndDescription">
    <div class="col-span-12">
      <div class="input-wrapper" v-if="showHazardSection">
        <CustomSelectInput
          :modelValue="hazerd"
          :controller="indexHazardController"
          :params="hazerdParams"
          id="Hazerd"
          label="Hazerd Type"
          placeholder="Select Hazerd"
          @update:modelValue="setHazerd"
        />
      </div>

      <div class="grid grid-cols-12 gap-6 radio-container" v-if="showRadioButtons">
        <div class="col-span-12 md:col-span-6">
          <label class="radio-title">{{ $t('take action') }}</label>
          <div class="flex items-center gap-6 radio-answers">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="yes" v-model="takeAction" />
              <span>Yes</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="no" v-model="takeAction" />
              <span>No</span>
            </label>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6" v-show="showSolvedAndDescription">
          <label class="radio-title">{{ $t('solved') }}</label>
          <div class="flex items-center gap-6 radio-answers">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="yes" v-model="solved" />
              <span>Yes</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="no" v-model="solved" />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

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
