<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import type ShowObservationModel from '@/features/setting/Observation/Data/models/observationDetailsModel'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import EditObservationParams from '@/features/setting/Observation/Core/params/editObservationParams.ts'
import AddObservationParams from '@/features/setting/Observation/Core/params/addObservationParams.ts'
import DatePicker from 'primevue/datepicker'

import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'

import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'

import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import ToDoList from '@/assets/images/to-do-list.png'
import FormPen from '@/shared/icons/FormPen.vue'
import SaveStatusSelector from './SaveStatusSelector.vue'
import ObservationLevel from './ObservationLevel.vue'
import HazerdType from './HazerdType.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import IndexEquipmentParams from '@/features/setting/equipment/Core/params/indexEquipmentParams.ts'
import IndexEquipmentController from '@/features/setting/equipment/Presentation/controllers/indexEquipmentController.ts'
import { RiskLevelEnum } from '../../Core/Enums/risk_level_enum'
import { SaveStatusEnum } from '../../Core/Enums/save_status_enum'
import { TypesEnum } from '../../Core/Enums/types_enum'

const emit = defineEmits(['update:data', 'update:activeTab'])

const props = defineProps<{
  data?: ShowObservationModel
}>()

// languages
const langs = ref<{ locale: string; title: string }[]>([
  { locale: 'en', title: '', icon: USA },
  { locale: 'ar', title: '', icon: SA },
])

// industries
const industry = ref<TitleInterface[]>([])
const allIndustries = ref<boolean>(false)

const equipment = ref<TitleInterface | null>(null)
const equipmentParams = new IndexEquipmentParams('', 0, 10, 1)
const equipmentController = IndexEquipmentController.getInstance()
// dynamic languages from backend
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

const user = useUserStore()

const title = ref<string>('')
const description = ref<string>('')
const image = ref<string | null>(null)
const date = ref<Date | null>(null)
const equipmentId = ref<number | null>(null)

const hazardTypeId = ref<number | null>(null)
const riskLevel = ref<RiskLevelEnum | null>(null)
const takeAction = ref<'yes' | 'no' | null>(null)
const solved = ref<'yes' | 'no' | null>(null)
const preventiveAction = ref<string>('')
const isNearMiss = ref<boolean | number>(0)
const isResult = ref<boolean>(false)
const capaStatus = ref<boolean>(false)
const isAction = ref<boolean>()
const saveStatus = ref<SaveStatusEnum | null>(null)
const actionText = ref<string>('')
const zoneId = ref<number | null>(null)
const LocationIds = ref<number[]>([])
const type_id = ref<number | null>(null)
const type = ref<TypesEnum>(TypesEnum.ObservationType)

// البيانات من HazardType component
const hazardData = ref({
  hazerd: [],
  take_action: null,
  solved: null,
  description: '',
})

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const AllIndustry = user.user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null

  const industryIds = industry.value.map((i) => i.id)

  const commonData = {
    title: title.value,
    description: description.value,
    type: TypesEnum.ObservationType,
    image: image.value,
    type_id: type_id.value || undefined,
    equipment_id: equipmentId.value || undefined,
    zoon_id: zoneId.value || undefined,
    project_id: undefined,
    date: date.value?.toISOString().split('T')[0],
    hazard_type_id: hazardData.value.hazerd?.id || null,
    take_action: hazardData.value.take_action,
    solved: hazardData.value.solved,
    preventive_action: preventiveAction.value,
    is_result: isResult.value,
    risk_level: riskLevel.value || undefined,
    save_status: saveStatus.value || undefined,
    action: hazardData.value.action,
    is_near_miss: isNearMiss.value,
    // capa_status: capaStatus.value,
    is_action: isAction.value,
  }

  const params: AddObservationParams | EditObservationParams = props.data?.id
    ? new EditObservationParams(
        props.data.id,
        translationsParams,
        AllIndustry,
        industryIds,
        commonData,
      )
    : new AddObservationParams(commonData)

  emit('update:data', params)
}

const setEquipment = (data: TitleInterface) => {
  equipment.value = data
  equipmentId.value = data.id
  updateData()
}
// init values
watch(
  () => props.data,
  (newData) => {
    if (!newData) return

    title.value = newData.title || ''
    if (newData.date) date.value = new Date(newData.date)
    equipment.value = newData.equipment
    image.value = newData.image
    saveStatus.value = newData.save_status as SaveStatusEnum
    riskLevel.value = newData.risk_level as RiskLevelEnum
    isNearMiss.value = newData.is_near_miss
    isResult.value = newData.is_result
    isAction.value = newData.is_action
    actionText.value = newData.action
  },
  { immediate: true },
)

const handleObservationLevel = (data: any) => {
  riskLevel.value = data.level
  isNearMiss.value = data.is_near_miss
  updateData()
}

const handleHazardData = (data: any) => {
  hazardData.value = data
  type_id.value = data.type_id
  isAction.value = data.take_action === 'yes'
  isResult.value = data.solved === 'yes'
  actionText.value = data.action
  updateData()
}

watch([title, date, riskLevel, isNearMiss, saveStatus], () => {
  updateData()
})
</script>

<template>
  <div class="observation-form">
    <HeaderPage
      :title="$t('create Observations')"
      subtitle="Document what you observe to improve workplace safety"
      :img="ToDoList"
    />

    <TabsSelection :LocationIds="[137]" @update:data="zoneId = $event" />

    <p class="first-section-par">
      <component :is="FormPen" />
      {{ $t('Observation ') }}<span>(#001)</span>
    </p>

    <!-- first section -->
    <div class="first-section lg:grid grid-cols-12 md:grid-cols-12 sm:grid-cols-1 gap-4">
      <div class="input-wrapper col-span-12">
        <label for="text">{{ $t('Text') }}</label>
        <input
          class="input"
          :placeholder="$t('add your title')"
          type="text"
          id="title"
          v-model="title"
        />
      </div>

      <div class="flex flex-col gap-2 input-wrapper col-span-6 md:grid-cols-12">
        <label for="date">
          {{ $t('date') }}
        </label>
        <DatePicker v-model="date" id="date" />
      </div>

      <div class="col-span-6 md:grid-cols-12">
        <CustomSelectInput
          :modelValue="equipment"
          :controller="equipmentController"
          :params="equipmentParams"
          label="Equipment"
          id="Equipment"
          placeholder="Select Equipment"
          @update:modelValue="setEquipment"
        />
      </div>

      <div class="col-span-12">
        <div class="flex flex-col gap-2 input-wrapper">
          <label>{{ $t('upload image') }}</label>
          <SingleFileUpload
            v-model="image"
            @update:modelValue="setImage"
            label="Image"
            id="image"
            placeholder="upload image"
          />
        </div>
      </div>
    </div>

    <SaveStatusSelector :modelValue="saveStatus" @update:saveStatus="saveStatus = $event" />

    <ObservationLevel
      :modelRiskLevel="riskLevel"
      :modelIsNearMiss="isNearMiss"
      @update:data="handleObservationLevel"
    />
    <HazerdType
      :riskLevel="riskLevel"
      :is_near_miss="isNearMiss"
      :modelTakeAction="isAction ? 'yes' : 'no'"
      :modelSolved="isResult ? 'yes' : 'no'"
      :modelAction="actionText"
      @update:data="handleHazardData"
    />
  </div>
</template>
