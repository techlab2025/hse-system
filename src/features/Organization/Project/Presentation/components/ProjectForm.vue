<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useRoute } from 'vue-router'
import DatePicker from 'primevue/datepicker'
import { useUserStore } from '@/stores/user'
import type ProjectDetailsModel from '../../Data/models/ProjectDetailsModel'
import EditProjectParams from '../../Core/params/editProjectParams'
import AddProjectParams from '../../Core/params/addProjectParams'
import PagesHeader from '../../../../../shared/HelpersComponents/PagesHeader.vue'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import AddZoneDialog from './Dialogs/ZoneDialog/AddZoneDialog.vue'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import type SohwProjectZoonModel from '../../Data/models/ShowProjectZone'
import IndexContractorController from '@/features/setting/contractor/Presentation/controllers/indexContractorController'
import IndexContractorParams from '@/features/setting/contractor/Core/params/indexContractorParams'
import ContructorSelectDialog from './SelectDialogs/ContructorSelectDialog.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import LocationSelectDialog from './SelectDialogs/LocationSelectDialog.vue'
import AddProjectZoneDialog from './Dialogs/AddProjectZoneDialog.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import StarRequiredInput from '@/shared/icons/StarRequiredInput.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])
const SerialNumber = ref<string>('')

const props = defineProps<{
  data?: ProjectDetailsModel
}>()
const indexLocationStatesParams = ref<IndexLocationParams | null>(null)
const indexLocationCityParams = ref<IndexLocationParams | null>(null)
const indexLocationAreasController = IndexLocationController.getInstance()
const indexLocationAreasParams = ref<IndexLocationParams | null>(null)
const SelectedCountry = ref<TitleInterface[]>()
const SelectedState = ref<TitleInterface[]>()
const SelectedCity = ref<TitleInterface[]>()
const SelectedArea = ref<TitleInterface[]>()
const EvaluatingMethod = ref<TitleInterface[] | null>([])
const ContractorIds = ref<TitleInterface[]>([])
const location = ref<TitleInterface[]>([])
const setContractorIds = (data: TitleInterface[]) => {
  ContractorIds.value = data
  updateData()
}

const indexContractorController = IndexContractorController.getInstance()
const indexContractorTypeParams = new IndexContractorParams('', 0, 0, 0)

const route = useRoute()
const id = route.params.parent_id

const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const langsDescription = ref<
  {
    locale: string
    icon?: any
    description: string
  }[]
>([])
const langDefault = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const langDefaultDescription = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()
const ZoneIds = ref<number[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))

    langDefaultDescription.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))

    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexProjectController = await IndexLangController.getInstance().getData(params)

  const response = indexProjectController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))

    langDefaultDescription.value = response.data.map((item: any) => ({
      locale: item.code,
      description: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
    langDefaultDescription.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})
const date = ref(new Date())

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })
  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.description)
  })
  const params = props.data?.id
    ? new EditProjectParams(
        props.data.id,
        translationsParams,
        ContractorIds.value?.map((p) => p.id),
        date.value,
        location.value.map((l) => l.id),
        ZoneIds.value.filter((z): z is number => typeof z === 'number'),
        EvaluatingMethod.value?.map((p) => p.id),
        endDate.value,
      )
    : new AddProjectParams({
        translation: translationsParams,
        ContractorIds: ContractorIds.value?.map((p) => p.id),
        startDate: date.value,
        locationIds: location.value.map((l) => l.id),
        zoonIds: ZoneIds.value.filter((z): z is number => typeof z === 'number'),
        methodIds: EvaluatingMethod.value?.map((p) => p.id),
        SerialNumber: SerialNumber.value,
        endDate: endDate.value,
        serial: !fields.value[0].enabled ? SerialNumber.value : undefined,
      })
  emit('update:data', params)
}

watch(
  [() => props.data, () => langDefault.value, () => langDefaultDescription.value],
  ([newData, newDefault, newDefaultDesc]) => {
    if (newDefault.length) {
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      if (newData?.descriptions?.length) {
        langsDescription.value = newDefaultDesc.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, description: '' }
        })
      } else {
        langsDescription.value = newDefaultDesc.map((l) => ({
          locale: l.locale,
          description: '',
        }))
      }

      SerialNumber.value = newData?.SerialNumber
      date.value = newData?.startDate || new Date()
      SelectedCountry.value = newData?.country ?? []
      indexLocationStatesParams.value = new IndexLocationParams(
        '',
        0,
        0,
        0,
        LocationEnum.STATE,
        null,
        SelectedCountry.value?.map((c) => c?.id),
      )
      SelectedState.value = newData?.state ?? []
      indexLocationCityParams.value = new IndexLocationParams(
        '',
        0,
        0,
        0,
        LocationEnum.CITY,
        null,
        SelectedState.value?.map((c) => c?.id),
      )
      SelectedCity.value = newData?.city ?? []
      indexLocationAreasParams.value = new IndexLocationParams(
        '',
        0,
        0,
        0,
        LocationEnum.AREA,
        null,
        null,
      )

      console.log(newData?.area, 'newData?.area')
      location.value = newData?.area ?? []
      EvaluatingMethod.value = newData?.methods ?? []
      ContractorIds.value = newData?.contractors ?? []
      SelectedZones.value = newData?.Zones ?? []
      endDate.value = newData?.endDate
      console.log('data', newData)
      updateData()
    }
  },
  { immediate: true, deep: true },
)

const SelectedZones = ref<SohwProjectZoonModel[]>([])
const UpdateZones = (data: { locationId: number; ZoneIds: number[] }[]) => {
  ZoneIds.value = data.flatMap((item) => item.ZoneIds || [])
  updateData()
}

watch(
  () => props.data?.Zones,
  (newZones) => {
    if (newZones) {
      SelectedZones.value = newZones
      const zoneIdsFromProps: number[] = []
      newZones.forEach((location) => {
        if (location.zoons) {
          location.zoons.forEach((zone) => {
            zoneIdsFromProps.push(zone.id)
          })
        }
      })
      ZoneIds.value = zoneIdsFromProps
    }
  },
  { deep: true, immediate: true },
)
const projtecStateus = useProjectAppStatusStore()

const UpdateDate = (newDate) => {
  date.value = newDate || new Date()
  updateData()
}

const endDate = ref()
const UpdateEndDate = (date) => {
  endDate.value = date
  updateData()
}

const SetAreaSelection = (data: TitleInterface[]) => {
  SelectedArea.value = data
  location.value = data
  updateData()
}

watch(
  () => langs.value,
  () => {
    updateData()
  },
)
watch(
  () => langsDescription.value,
  () => {
    updateData()
  },
)

const ContructorVisible = ref(false)
const ShowContructorDialog = () => {
  ContructorVisible.value = true
}
const LocationVisible = ref(false)
const ShowLocationDialog = () => {
  LocationVisible.value = true
}

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])
const UpdateSerial = (data) => {
  SerialNumber.value = data.SerialNumber
  console.log(SerialNumber.value, 'data')
  updateData()
}

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0
const hasLangValue = () => langs.value.some((lang) => hasValue(lang.title))

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'langs',
    message: 'Project Name Is Required',
    isMissing: () => !hasLangValue(),
  },
  {
    key: 'date',
    message: 'Start Date Is Required',
    isMissing: () => !date.value,
  },
  {
    key: 'endDate',
    message: 'End Date Is Required',
    isMissing: () => !endDate.value,
  },
  {
    key: 'location',
    message: 'Location Is Required',
    isMissing: () => !location.value?.length,
  },
  {
    key: 'ZoneIds',
    message: 'Zone Is Required',
    isMissing: () => !ZoneIds.value?.length,
  },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((errors, field) => {
    errors[field.key] = field.message
    return errors
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})
</script>

<template>
  <div class="col-span-4">
    <PagesHeader :title="$t(`project_info`)" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper" data-required-field="langs">
    <LangTitleInput
      :label="`Project Name`"
      :langs="langDefault"
      :modelValue="langs"
      help-text="Enter the project name in each available language so it is clear throughout the system."
      @update:modelValue="(val) => (langs = val)"
    />
    <p v-if="getFieldError('langs')" class="required-field-message">
      {{ getFieldError('langs') }}
    </p>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper" v-if="!data?.id">
    <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :isAuto="true"
      :switch_reverse="true"
      help-text="Enter a unique project serial number, or enable automatic generation to let the system create it."
      @update:value="UpdateSerial"
    />
    <!-- <label for="serialNumber">{{ $t('serial_number') }}</label>
    <input
      type="text"
      v-model="SerialNumber"
      @input="UpdateSerial"
      id="serialNumber"
      :disabled="projtecStateus.isSerialNumberAuto()"
      :placeholder="
        projtecStateus.isSerialNumberAuto()
          ? 'You can leave it (auto-generated)'
          : 'Enter Your Serial Number'
      "
    /> -->
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper" data-required-field="date">
    <label for="date" class="flex gap-2 items-center">
      {{ $t('start_date') }}
      <StarRequiredInput />
      <FieldHelpIcon text="Select the planned date when work on this project starts." />
    </label>
    <DatePicker
      v-model="date"
      @date-select="UpdateDate"
      id="date"
      :placeholder="`select the date`"
    />
    <p v-if="getFieldError('date')" class="required-field-message">
      {{ getFieldError('date') }}
    </p>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper" data-required-field="endDate">
    <label for="end-date" class="flex gap-2 items-center">
      {{ $t('end_date') }}
      <StarRequiredInput />
      <FieldHelpIcon text="Select the planned completion date for this project." />
    </label>
    <DatePicker
      v-model="endDate"
      @date-select="UpdateEndDate"
      id="end-date"
      :placeholder="`select the end date`"
    />
    <p v-if="getFieldError('endDate')" class="required-field-message">
      {{ getFieldError('endDate') }}
    </p>
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper" data-required-field="location">
    <CustomSelectInput
      :required="false"
      :modelValue="ContractorIds"
      @update:modelValue="setContractorIds"
      :type="2"
      :controller="indexContractorController"
      :params="indexContractorTypeParams"
      label="contractors"
      :placeholder="$t('sub_contractors')"
      :onclick="ShowContructorDialog"
      help-text="Select every contractor or subcontractor assigned to work on this project."
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :required="true"
      :modelValue="location"
      @update:modelValue="SetAreaSelection"
      :controller="indexLocationAreasController"
      :params="indexLocationAreasParams"
      label="location"
      placeholder="location"
      :type="2"
      :onclick="ShowLocationDialog"
      help-text="Select the project locations or work areas where project activities will take place."
    />
    <p v-if="getFieldError('location')" class="required-field-message">
      {{ getFieldError('location') }}
    </p>
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper" data-required-field="ZoneIds">
    <label for="zone" class="flex flex-start item-center gap-2">
      <span class="flex items-center gap-2">
        <span>{{ $t('zones') }}</span>
        <StarRequiredInput />
        <FieldHelpIcon text="Select the specific zones within the chosen project locations." />
      </span>
      <AddProjectZoneDialog @update:data="UpdateZones" />
    </label>

    <AddZoneDialog
      id="zone"
      class="input"
      :locations="location"
      @update:data="UpdateZones"
      :selectedZones="SelectedZones"
    />
    <p v-if="getFieldError('ZoneIds')" class="required-field-message">
      {{ getFieldError('ZoneIds') }}
    </p>
  </div>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <LangTitleInput
      label="project_scope_of_work"
      :langs="langDefault"
      :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)"
      field-type="description"
      type="textarea"
      :placeholder="`What is the project scope of work?`"
      :required="false"
      help-text="Describe the project scope, main activities, and work boundaries in each available language."
    />
  </div>
  <ContructorSelectDialog v-model:visible="ContructorVisible" />
  <LocationSelectDialog v-model:visible="LocationVisible" />
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
