<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import type ShowObservationModel from '@/features/setting/Observation/Data/models/observationDetailsModel'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import DatePicker from 'primevue/datepicker'

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
// import { RiskLevelEnum } from '../../Core/Enums/risk_level_enum'
// import { SaveStatusEnum } from '../../Core/Enums/save_status_enum'
// import { TypesEnum } from '../../Core/Enums/types_enum'
import AddHazardParams from '../../../Core/params/addHazardParams'
import EditHazardParams from '../../../Core/params/editHazardParams'
import { SaveStatusEnum } from '../../../Core/Enums/save_status_enum'
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import { TypesEnum } from '../../../Core/Enums/types_enum'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'

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
const image = ref<string[] | null>(null)
const date = ref<Date | null>(null)
const equipmentId = ref<number | null>(null)

const hazardTypeId = ref<number | null>(null)
const riskLevel = ref<RiskLevelEnum | null>(RiskLevelEnum.Low)
const takeAction = ref<'yes' | 'no' | null>('no')
const solved = ref<'yes' | 'no' | null>(null)
const preventiveAction = ref<string>('')
const isNearMiss = ref<boolean | number>(0)
const isResult = ref<boolean>(false)
const capaStatus = ref<boolean>(false)
const isAction = ref<boolean>()
const saveStatus = ref<SaveStatusEnum | null>(SaveStatusEnum.NotSaved)
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
    type: type.value,
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
    is_action: isAction.value,
  }

  // const params: AddObservationParams | EditObservationParams = props.data?.id
  //   ? new EditObservationParams(
  //       props.data.id,
  //       translationsParams,
  //       AllIndustry,
  //       industryIds,
  //       commonData,
  //     )
  //   : new AddObservationParams(commonData)

  const params: AddHazardParams | EditHazardParams = props.data?.id
    ? new EditHazardParams(
        props.data.id,
        title.value,
        description.value,
        image.value.map((el) => el.file),
        type_id.value,
        type.value,
        equipmentId.value,
        zoneId.value,
        37,
        isResult.value,
        riskLevel.value,
        saveStatus.value,
        preventiveAction.value,
        isNearMiss.value,
        null,
        date.value,
        null,
        isAction.value,
      )
    : new AddHazardParams(
        title.value,
        description.value,
        image.value.map((el) => el.file),
        type_id.value,
        type.value,
        equipmentId.value,
        zoneId.value,
        37,
        isResult.value ? 1 : 0,
        riskLevel.value,
        saveStatus.value,
        preventiveAction.value,
        isNearMiss.value,
        null,
        date.value,
        null,
        isAction.value ? 1 : 0,
      )
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
    type.value = newData.is_near_miss === 1 ? TypesEnum.HazardType : TypesEnum.ObservationType
  },
  { immediate: true },
)

const handleObservationLevel = (data: any) => {
  riskLevel.value = data.level
  isNearMiss.value = data.is_near_miss

  type.value = data.is_near_miss === 1 ? TypesEnum.HazardType : TypesEnum.ObservationType

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

const setImages = async (data: string[]) => {
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  console.log(image.value, 'image.value')
  updateData()
}
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
          <span class="text-red-500">*</span>
        </label>
        <DatePicker v-model="date" id="date" />
      </div>

      <div class="col-span-6 md:grid-cols-12">
        <CustomSelectInput
          :required="false"
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
          <!-- <SingleFileUpload
            v-model="image"
            @update:modelValue="setImage"
            label="Image"
            id="image"
            placeholder="upload image"
          /> -->

          <MultiImagesInput :initialImages="image" @update:images="setImages" />
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
      :modelHazerdType="props.data?.type_model ? markRaw(props.data.type_model) : null"
      @update:data="handleHazardData"
    />
  </div>
</template>
