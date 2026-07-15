<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import DatePicker from 'primevue/datepicker'
import QrCard from './EquipmentUtils/QrCard.vue'
import DemoCard from './EquipmentUtils/DemoCard.vue'
import Car from '@/shared/icons/car.vue'
import Tabs from './tabs.vue'
import Dialog from 'primevue/dialog'
import TranslationsParams from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
import AddEquipmentParams from '../../Core/params/addEquipmentParams'
import EditEquipmentParams from '../../Core/params/editEquipmentParams'
import { LangsMap } from '@/constant/langs'
import { useI18n } from 'vue-i18n'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type EquipmentDetailsModel from '../../Data/models/equipmentDetailsModel'
import { EquipmentStatus } from '../../Core/enum/equipmentStatus'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import IndexContractorController from '@/features/setting/contractor/Presentation/controllers/indexContractorController'
import IndexContractorParams from '@/features/setting/contractor/Core/params/indexContractorParams'
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel'
import { RentTypeEnum } from '../../Core/enum/RentTypeEnum'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import IndexWhereHouseController from '@/features/Organization/WhereHouse/Presentation/controllers/indexWhereHouseController'
import IndexWhereHouseParams from '@/features/Organization/WhereHouse/Core/params/indexWhereHouseParams'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import EquipmentTypeForm from '@/features/setting/EquipmentType/Presentation/components/EquipmentTypeForm.vue'
import { formatTime } from '@/base/Presentation/utils/time_format'
import AddEquipmentType from '@/features/setting/EquipmentType/Presentation/components/AddEquipmentType.vue'
import AddContractor from '@/features/setting/contractor/Presentation/components/AddContractor.vue'
import OwnedIcon from '@/shared/icons/OwnedIcon.vue'
import RentIcon from '@/shared/icons/RentIcon.vue'
import AddWhereHouse from '@/features/Organization/WhereHouse/Presentation/components/AddWhereHouse.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { useThemeMode } from '@/composables/useThemeMode'
// import AddWhereHouse from '@/views/Organization/WhereHouse/AddWhereHouse.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: EquipmentDetailsModel }>()
const { isDarkMode } = useThemeMode()

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const { user } = useUserStore()
const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const industry = ref<TitleInterface[]>([])
const equipmentType = ref<TitleInterface | null>(null)
const allIndustries = ref(0)
const inspectionDuration = ref<string | null>(null)
const licenseNumber = ref<string | null>(null)
const licensePlateNumber = ref<string | null>(null)
const equipmentStatus = ref<TitleInterface | null>(null)
const { t } = useI18n()
const activeTab = ref<EquipmentTypesEnum>(EquipmentTypesEnum.EQUIPMENT)
const SerialNumber = ref()

const equipmentStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Owned') }),
])

const setEquipmentStatus = (data: TitleInterface) => {
  equipmentStatus.value = data
  updateData()
}

const image = ref<string | null>(null)
const decommissioningDate = ref<string | null>(null)
const decommissioningDateObj = ref<Date | null>(null)
const certificateImage = ref<string | null>(null)
const langTitleValid = ref(false)

const indexEquipmentTypeController = IndexEquipmentTypeController.getInstance()
const indexEquipmentTypeParams = ref(
  new IndexEquipmentTypeParams(
    '',
    null,
    null,
    null,
    null,
    Number(activeTab.value) || EquipmentTypesEnum.EQUIPMENT,
  ),
)
const EquipmentTypeState = ref(indexEquipmentTypeController.state.value)

const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const fetchLang = async () => {
  if (user?.languages?.length) {
    langDefault.value = user.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code]?.icon),
    }))
    return
  }

  const controller = await IndexLangController.getInstance().getData(
    new IndexLangParams('', 1, 10, 0),
  )
  const response = controller.value

  langDefault.value = response?.data?.length
    ? response.data.map((item: any) => ({
        locale: item.code,
        title: '',
        icon: markRaw(LangsMap[item.code]?.icon),
      }))
    : [
        { locale: 'en', icon: LangsMap.en.icon, title: '' },
        { locale: 'ar', icon: LangsMap.ar.icon, title: '' },
      ]
}

const AllEquipmentTypes = ref<EquipmentTypeModel[]>()

const GetEquipmentType = async () => {
  const indexEquipmentTypeParams = new IndexEquipmentTypeParams(
    '',
    null,
    null,
    null,
    null,
    Number(activeTab.value) || EquipmentTypesEnum.EQUIPMENT,
  )
  const response = await indexEquipmentTypeController.getData(indexEquipmentTypeParams)

  if (response.value.data?.length > 0) {
    AllEquipmentTypes.value = response.value.data
  } else {
    AllEquipmentTypes.value = []
  }
}

onMounted(() => {
  fetchLang()
  GetEquipmentType()
  // Set start date to now if creating new equipment
  if (!props.data?.id) {
    StartDate.value = new Date()
  }
})

const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  updateData()
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  langTitleValid.value = data.some((l) => l.title?.trim()?.length > 0)
  updateData()
}

const setEquipmentType = (data: TitleInterface) => {
  equipmentType.value = data
  updateData()
}

const originalImage = ref<string | null>(null)

// const setImage = async (value: string) => {
//   image.value = typeof value === 'string' ? value : await filesToBase64(value)
//   // if (value?.length < 1) {
//   //   image.value = "*"
//   // }
//   updateData()
// }
const resolveImage = () => {
  // ADD
  if (!props.data?.id) {
    return isBase64(image.value) ? image.value : '*'
  }

  // EDIT
  // 1) not changed
  if (image.value === originalImage.value) {
    return undefined // مش هيتبعت
  }

  // 2) deleted
  if (!image.value) {
    return '*'
  }

  // 3) updated
  if (isBase64(image.value)) {
    return image.value
  }

  return undefined
}

const setImage = async (value: any) => {
  if (!value) {
    // user deleted image
    image.value = ''
  } else if (typeof value === 'string') {
    image.value = value
  } else {
    image.value = await filesToBase64(value)
  }
  updateData()
}

// const setCertificateImage = async (value: string) => {
//   // console.log(value, "value");
//   certificateImage.value = typeof value === 'string' ? value : await filesToBase64(value)
//   updateData()
// }
const originalCertificateImage = ref<string | null>(null)
const resolveCertificateImage = () => {
  // ADD
  if (!props.data?.id) {
    return isBase64(certificateImage.value) ? certificateImage.value : ''
  }

  // EDIT
  // 1) not changed
  if (certificateImage.value === originalCertificateImage.value) {
    return undefined // <-- key مش هيتبعت
  }

  // 2) deleted
  if (!certificateImage.value) {
    return '*'
  }

  // 3) updated
  if (isBase64(certificateImage.value)) {
    return certificateImage.value
  }

  return undefined
}

const setCertificateImage = async (value: any) => {
  if (!value) {
    // user deleted image
    certificateImage.value = ''
  } else if (typeof value === 'string') {
    certificateImage.value = value
  } else {
    certificateImage.value = await filesToBase64(value)
  }
  updateData()
}

const equipmentName = computed(() => {
  const defaultLang = langDefault.value[0]?.locale
  const lang = langs.value.find((l) => l.locale === defaultLang)
  return lang?.title || ''
})

function isBase64(str: any): boolean {
  if (typeof str !== 'string') return false

  // remove base64 prefix if exists
  const base64 = str.includes('base64,') ? str.split('base64,')[1] : str

  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

  return base64Regex.test(base64)
}

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => translationsParams.setTranslation('title', lang.locale, lang.title))

  const AllIndustry = user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null
  const StartDateFormat = StartDate.value
    ? formatJoinDate(StartDate.value) + ' ' + formatTime(StartDate.value)
    : null
  const EndDateFormat = EndDate.value
    ? formatJoinDate(EndDate.value) + ' ' + formatTime(EndDate.value)
    : null

  console.log(certificateImage.value, 'certificateImage.value')
  // if (certificateImage.value?.length < 1) {
  //   certificateImage.value = "*"
  // }
  // if (image.value?.length < 1) {
  //   image.value = "*"
  // }

  const CertificateImageValue = computed(() => {
    return certificateImage.value?.length > 1 && isBase64(certificateImage.value)
      ? certificateImage.value
      : '*'
  })
  // const ImageValue = computed(()=>{
  //   rey
  // })
  const certificateImagePayload = resolveCertificateImage()
  const imagePayload = resolveImage()
  // deviceStatus.value == EquipmentStatus.OWN ? null :
  const params = props.data?.id
    ? new EditEquipmentParams({
        id: +route.params.id,
        translation: translationsParams,
        equipmentTypeId: equipmentType.value?.id,
        date: decommissioningDate.value,
        status: deviceStatus.value,
        inspectionDuration: inspectionDuration.value,
        licenseNumber: licenseNumber.value,
        licensePlateNumber: licensePlateNumber.value,
        image: imagePayload,
        certificateImage: certificateImagePayload,
        AllIndustry: AllIndustry,
        industry: industry.value?.map((item) => item.id),
        parentId: +route.params.parent_id,
        constructorId: SelectedContractor.value?.id || ' ',
        equipmentRentType:
          deviceStatus.value == EquipmentStatus.RENT ? SelectedRentType?.value?.id : null,
        equipmentRentTime: deviceStatus.value == EquipmentStatus.RENT ? Rent.value : null,
        equipmentRentStartDate: deviceStatus.value == EquipmentStatus.OWN ? null : StartDateFormat,
        VehicleKm:
          activeTab.value === EquipmentTypesEnum.EQUIPMENT && isVehicle.value
            ? VehicleKm.value
            : ' ',
        SelectedWhereHosue: SelectedWhereHosue.value?.id || ' ',
        equipmentRentEndDate:
          deviceStatus.value == EquipmentStatus.RENT && Rent.value ? EndDateFormat : null,
      })
    : new AddEquipmentParams({
        translation: translationsParams,
        equipmentTypeId: equipmentType.value?.id,
        date: decommissioningDate.value,
        status: deviceStatus.value,
        inspectionDuration: inspectionDuration.value,
        licenseNumber: licenseNumber.value,
        licensePlateNumber: licensePlateNumber.value,
        image: imagePayload,
        certificateImage: certificateImagePayload,
        AllIndustry: AllIndustry,
        industry: industry.value?.map((item) => item.id),
        parentId: +route.params.parent_id,
        constructorId: SelectedContractor.value?.id || ' ',
        equipmentRentType:
          deviceStatus.value == EquipmentStatus.RENT ? SelectedRentType?.value?.id : null,
        equipmentRentTime: deviceStatus.value == EquipmentStatus.RENT ? Rent.value : null,
        equipmentRentStartDate: deviceStatus.value == EquipmentStatus.RENT ? StartDateFormat : null,
        VehicleKm:
          activeTab.value === EquipmentTypesEnum.EQUIPMENT && isVehicle.value
            ? VehicleKm.value
            : ' ',
        SelectedWhereHosue: SelectedWhereHosue.value?.id || ' ',
        equipmentRentEndDate:
          deviceStatus.value == EquipmentStatus.RENT && Rent.value ? EndDateFormat : null,
        serialNumber: SerialNumber.value,
      })

  emit('update:data', params)
}

const breadcrumbs = [
  {
    title: t('equipment'),
    link: '',
  },
  {
    title: t('heavy'),
    link: '',
  },
]

const indexContractorController = IndexContractorController.getInstance()
const indexContractorTypeParams = new IndexContractorParams('', 1, 10, 0, false)
const SelectedContractor = ref<TitleInterface>()
const setContructor = (data: TitleInterface) => {
  SelectedContractor.value = data
  updateData()
}

const deviceStatus = ref<number>(EquipmentStatus.RENT)
const deviceStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Owned') }),
])

const UpdateDeviceStatus = (data) => {
  deviceStatus.value = data.target.value
  updateData()
}
watch(
  () => deviceStatus.value,
  (newValue) => {
    deviceStatus.value = newValue
    updateData()

    // console.log(newValue, "deviceStatus.value");
  },
)

const getLocalizedTitleInterface = (titles: any[]) => {
  const locale = localStorage.getItem('lang') || 'en'
  const found = titles?.find((t) => t.locale === locale) || titles?.[0]
  return new TitleInterface({
    id: found?.id ?? null,
    title: found?.title ?? '',
  })
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, defaults]) => {
    if (!defaults.length) return

    langs.value = defaults.map((l) => {
      const existing = newData?.titles?.find((t) => t.locale === l.locale)
      return existing ? { ...l, title: existing.title } : { ...l }
    })

    if (route.params.id) {
      industry.value = newData?.industries ?? []

      const selectedEquipmentType = new TitleInterface({
        id: newData?.equipment_type?.id,
        title: getLocalizedTitleInterface(newData?.equipment_type?.titles).title,
      })

      equipmentType.value = selectedEquipmentType
      allIndustries.value = newData?.allIndustries == 1 ? true : false
      inspectionDuration.value = newData?.inspectionDuration || null
      licenseNumber.value = newData?.licenseNumber || null
      licensePlateNumber.value = newData?.licensePlateNumber || null
      deviceStatus.value = newData?.status
      image.value = newData?.image
      decommissioningDate.value = newData?.date || null
      decommissioningDateObj.value = newData?.date ? new Date(newData.date) : null
      certificateImage.value = newData?.certificateImage
      langTitleValid.value = langs.value.some((l) => l.title?.trim()?.length > 0)
      activeTab.value = newData?.equipment_type?.type
      indexEquipmentTypeParams.value = new IndexEquipmentTypeParams(
        '',
        1,
        10,
        1,
        null,
        activeTab.value,
      )
      SelectedContractor.value = new TitleInterface({
        id: newData?.contractor?.id,
        title: newData?.contractor?.name,
      })
      SelectedRentType.value = RentTypes.value.find((item) => item.id === newData?.RentType)
      Rent.value = newData?.RentTime
      StartDate.value = newData?.checkinDate ? new Date(newData.checkinDate) : null
      VehicleKm.value = newData?.kilometer
      isVehicle.value = newData?.kilometer ? true : false
      SelectedWhereHosue.value = new TitleInterface({
        id: newData?.warehouse?.id,
        title: newData?.warehouse?.name,
      })
      EndDate.value = newData?.RentEndDate ? new Date(newData.RentEndDate) : null
      //  certificateImage.value = newData?.certificateImage
      originalCertificateImage.value = newData?.certificateImage
      originalImage.value = newData?.image
    }
  },
  { immediate: true },
)

watch(
  () => activeTab.value,
  (Newvalue) => {
    indexEquipmentTypeParams.value = new IndexEquipmentTypeParams(
      '',
      null,
      null,
      null,
      null,
      Newvalue,
    )
  },
)

const RentTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: RentTypeEnum.HOUR, title: 'Hour' }),
  new TitleInterface({ id: RentTypeEnum.DAY, title: 'Day' }),
  new TitleInterface({ id: RentTypeEnum.MONTH, title: 'Month' }),
  new TitleInterface({ id: RentTypeEnum.YEAR, title: 'Year' }),
])

const SelectedRentType = ref<TitleInterface>(
  new TitleInterface({ id: RentTypeEnum.HOUR, title: 'Hour' }),
)

const setRentType = (data: TitleInterface) => {
  SelectedRentType.value = data
  calculateEndDate()
  updateData()
}

const Rent = ref<string>(1)

const setRentTime = (time: string) => {
  Rent.value = time.target.value
  calculateEndDate()
  updateData()
}

const setDecoDate = (date: Date | null) => {
  decommissioningDateObj.value = date
  decommissioningDate.value = date ? formatJoinDate(date) : null
  updateData()
}

const StartDate = ref<Date>(new Date())

const setStartDate = (date) => {
  StartDate.value = date
  calculateEndDate()
  updateData()
}

const VehicleKm = ref()

const setVehicleKm = (data) => {
  VehicleKm.value = data.target.value
  updateData()
}

const isVehicle = ref(false)

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: false,
  },
])

const projtecStateus = useProjectAppStatusStore()
const UpdateSerial = (data) => {
  SerialNumber.value = data.target.value
  updateData()
}

const indexWhereHouseController = IndexWhereHouseController.getInstance()
const indexWhereHouseParams = new IndexWhereHouseParams('', 1, 10, 1, false)
const SelectedWhereHosue = ref<TitleInterface>()

const setSelectedWhereHouse = (data: TitleInterface) => {
  SelectedWhereHosue.value = data
  updateData()
}

const EndDate = ref<Date>()

const setEndDate = (data) => {
  EndDate.value = data
  updateData()
}

const calculateEndDate = () => {
  if (!StartDate.value || !Rent.value || !SelectedRentType.value) {
    EndDate.value = null
    return
  }

  const start = new Date(StartDate.value)
  const end = new Date(start)

  switch (SelectedRentType.value.id) {
    case RentTypeEnum.HOUR:
      end.setHours(end.getHours() + Number(Rent.value))
      break
    case RentTypeEnum.DAY:
      end.setDate(end.getDate() + Number(Rent.value))
      break
    case RentTypeEnum.MONTH:
      end.setMonth(end.getMonth() + Number(Rent.value))
      break
    case RentTypeEnum.YEAR:
      end.setFullYear(end.getFullYear() + Number(Rent.value))
      break
  }

  EndDate.value = end
  updateData()
}

watch([Rent, SelectedRentType, () => StartDate.value], () => {
  calculateEndDate()
})

watch(
  () => activeTab.value,
  (newVal) => {
    if (newVal != EquipmentTypesEnum.EQUIPMENT) {
      VehicleKm.value = ''
    }
  },
)

const EquipmentTypeDialog = ref(false)
const ContractorDialog = ref(false)
const wearHouseDialog = ref(false)
const UpdateActiveTap = (data) => {
  activeTab.value = data
  updateData()
}

const GetEquipmentTitle = (equipmenttype: EquipmentTypesEnum) => {
  switch (equipmenttype) {
    case EquipmentTypesEnum.EQUIPMENT:
      return t('Equipment')
    case EquipmentTypesEnum.DEVICE:
      return t('Device')
    case EquipmentTypesEnum.TOOL:
      return t('Tool')
  }
}

const WarehouseDialog = ref(false)
import Checkbox from 'primevue/checkbox'
import CheckboxGroup from 'primevue/checkboxgroup'

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0
const hasLangValue = () => langs.value.some((lang) => hasValue(lang.title))
const hasSelectedId = (value?: TitleInterface | null) => Boolean(value?.id)

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'langs',
    message: `${GetEquipmentTitle(activeTab.value)} Name Is Required`,
    isMissing: () => !hasLangValue(),
  },
  {
    key: 'equipmentType',
    message: `${GetEquipmentTitle(activeTab.value)} Type Is Required`,
    isMissing: () => !hasSelectedId(equipmentType.value),
  },
  {
    key: 'deviceStatus',
    message: 'Status Is Required',
    isMissing: () =>
      user?.type === OrganizationTypeEnum.ORGANIZATION &&
      (deviceStatus.value === null || deviceStatus.value === undefined),
  },
  {
    key: 'SelectedContractor',
    message: 'Contractor Is Required',
    isMissing: () =>
      user?.type === OrganizationTypeEnum.ORGANIZATION &&
      deviceStatus.value === EquipmentStatus.RENT &&
      !hasSelectedId(SelectedContractor.value),
  },
  {
    key: 'SelectedRentType',
    message: 'Rent Type Is Required',
    isMissing: () =>
      user?.type === OrganizationTypeEnum.ORGANIZATION &&
      deviceStatus.value === EquipmentStatus.RENT &&
      !hasSelectedId(SelectedRentType.value),
  },
  {
    key: 'Rent',
    message: 'Rent Period Is Required',
    isMissing: () =>
      user?.type === OrganizationTypeEnum.ORGANIZATION &&
      deviceStatus.value === EquipmentStatus.RENT &&
      (!hasValue(Rent.value) || Number(Rent.value) < 1),
  },
  {
    key: 'StartDate',
    message: 'Rent Start Date Is Required',
    isMissing: () =>
      user?.type === OrganizationTypeEnum.ORGANIZATION &&
      deviceStatus.value === EquipmentStatus.RENT &&
      !StartDate.value,
  },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const clearResolvedRequiredErrors = () => {
  requiredFields.value.forEach((field) => {
    if (requiredFieldErrors.value[field.key] && !field.isMissing()) {
      const { [field.key]: _removed, ...rest } = requiredFieldErrors.value
      requiredFieldErrors.value = rest
    }
  })
}

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  clearResolvedRequiredErrors()
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
  <div :class="['w-full col-span-6 equipment-form', { 'is-dark': isDarkMode }]">
    <Tabs @update:activeTab="UpdateActiveTap" :activeTabData="activeTab" />

    <div class="vehicle flex w-full col-span-6" v-if="activeTab === EquipmentTypesEnum.EQUIPMENT">
      <div class="flex gap-2 w-full col-span-6">
        <Car />
        <div class="input-wrapper check-box">
          <label for="vehicle">
            <p>Mark if this equipment is a <b>vehicle</b></p>
          </label>
          <!-- <Checkbox v-model="isVehicle" @change="updateData" type="checkbox" id="vehicle" binary /> -->

          <input v-model="isVehicle" @change="updateData" type="checkbox" id="vehicle" />
        </div>
      </div>
      <div class="input-wrapper w-1/2" v-if="isVehicle">
        <input
          class="input"
          placeholder="Enter Vehicle Km"
          type="text"
          id="inspection_duration"
          v-model="VehicleKm"
          @input="setVehicleKm"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mt-8">
      <div class="col-span-2 md:col-span-1" data-required-field="langs">
        <LangTitleInput
          :label="`${GetEquipmentTitle(activeTab)} Name`"
          :langs="langDefault"
          :modelValue="langs"
          @update:modelValue="setLangs"
        />
        <p v-if="getFieldError('langs')" class="required-field-message">
          {{ getFieldError('langs') }}
        </p>
      </div>

      <div class="col-span-2 md:col-span-1 flex flex-col gap-2 input-wrapper" v-if="!data?.id">
        <label for="serialNumber">{{ $t('serial_number') }}</label>
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
        />
      </div>

      <div class="col-span-2 md:col-span-1" data-required-field="equipmentType">
        <UpdatedCustomInputSelect
          @update:reload="GetEquipmentType"
          :modelValue="equipmentType"
          :controller="indexEquipmentTypeController"
          :params="indexEquipmentTypeParams"
          :label="`${GetEquipmentTitle(activeTab)} Type`"
          :id="`${GetEquipmentTitle(activeTab)} Type`"
          :placeholder="`Select ${GetEquipmentTitle(activeTab)} Type`"
          @update:modelValue="setEquipmentType"
          :isDialog="true"
          v-model:dialogVisible="EquipmentTypeDialog"
        >
          <template #LabelHeader>
            <span class="add-dialog" @click="EquipmentTypeDialog = true">New</span>
          </template>
          <template #Dialog>
            <AddEquipmentType @close:data="EquipmentTypeDialog = false" />
          </template>
        </UpdatedCustomInputSelect>
        <p v-if="getFieldError('equipmentType')" class="required-field-message">
          {{ getFieldError('equipmentType') }}
        </p>
      </div>

      <div class="flex flex-col gap-2 input-wrapper col-span-2 md:col-span-1">
        <label>{{ $t('upload image') }}</label>
        <SingleFileUpload
          :returnType="`base64`"
          v-model="image"
          @update:modelValue="setImage"
          label="Image"
          id="image"
          index="1"
          placeholder="upload image"
        />
      </div>

      <!-- {{ certificateImage }} -->
      <div class="flex flex-col gap-2 input-wrapper col-span-2 md:col-span-1">
        <label class="flex justify-between flex-wrap">
          <p>{{ $t('Certification / Inspection Image upload') }}</p>
        </label>
        <SingleFileUpload
          :returnType="`base64`"
          v-model="certificateImage"
          @update:modelValue="setCertificateImage"
          label="Certification upload"
          id="Certification upload"
          index="2"
          placeholder="Certification upload"
        />
      </div>

      <div class="flex flex-col gap-2 input-wrapper col-span-2 md:col-span-1">
        <label>{{ $t('certification / Inspection expiry date') }}</label>
        <DatePicker
          :model-value="decommissioningDateObj"
          id="Date of Decommissioning"
          placeholder="certification expiry date"
          @update:modelValue="setDecoDate"
        />
      </div>

      <div
        v-if="user?.type === OrganizationTypeEnum.ORGANIZATION"
        class="col-span-2 flex item-center justify-start gap-4"
        data-required-field="deviceStatus"
      >
        <div
          class="radio-wrapper"
          :class="deviceStatus == option?.id ? 'active' : ''"
          v-for="(option, index) in deviceStatusOptions"
          :key="index"
          @click="deviceStatus = option?.id"
        >
          <div class="flex items-center justify-center gap-1 w-full h-full">
            <label
              class="text-lg w-full flex justify-center"
              :for="`${option?.id}-${option?.title}`"
            >
              {{ option?.title }}
            </label>
            <RentIcon class="w-10 h-10" v-if="option?.id == EquipmentStatus.RENT" />
            <OwnedIcon class="w-10 h-10" v-if="option?.id == EquipmentStatus.OWN" />
          </div>
          <input
            :id="`${option?.id}-${option?.title}`"
            type="radio"
            v-model="deviceStatus"
            :value="option?.id"
            name="radio"
            @change="UpdateDeviceStatus"
          />
        </div>
        <p v-if="getFieldError('deviceStatus')" class="required-field-message">
          {{ getFieldError('deviceStatus') }}
        </p>
      </div>

      <div
        v-if="
          deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
        "
        class="col-span-2 md:col-span-1"
        data-required-field="SelectedContractor"
      >
        <UpdatedCustomInputSelect
          :modelValue="SelectedContractor"
          :controller="indexContractorController"
          :params="indexContractorTypeParams"
          :label="`Contructor`"
          id="Contructor"
          :placeholder="`Select Contructor`"
          @update:modelValue="setContructor"
          :isDialog="true"
          v-model:dialogVisible="ContractorDialog"
        >
          <template #LabelHeader>
            <span class="add-dialog" @click="ContractorDialog = true">New</span>
          </template>
          <template #Dialog>
            <AddContractor @update:data="ContractorDialog = false" />
          </template>
        </UpdatedCustomInputSelect>
        <p v-if="getFieldError('SelectedContractor')" class="required-field-message">
          {{ getFieldError('SelectedContractor') }}
        </p>
      </div>

      <div
        v-if="
          deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
        "
        class="col-span-2 md:col-span-1"
        data-required-field="SelectedRentType"
      >
        <CustomSelectInput
          :staticOptions="RentTypes"
          :modelValue="SelectedRentType"
          label="Rent Type"
          id="Rent Type"
          placeholder="Selected Rent Type.."
          @update:modelValue="setRentType"
        />
        <p v-if="getFieldError('SelectedRentType')" class="required-field-message">
          {{ getFieldError('SelectedRentType') }}
        </p>
      </div>
      <div class="col-span-2 md:col-span-1" v-if="!data?.id">
        <!-- <CustomSelectInput :controller="indexWhereHouseController" :params="indexWhereHouseParams"
          :modelValue="SelectedWhereHosue" label="Warehouse" id="Warehouse" placeholder="Select Warehouse.."
          @update:modelValue="setSelectedWhereHouse" /> -->

        <UpdatedCustomInputSelect
          :controller="indexWhereHouseController"
          :params="indexWhereHouseParams"
          :modelValue="SelectedWhereHosue"
          label="Warehouse"
          id="Warehouse"
          placeholder="Select Warehouse.."
          @update:modelValue="setSelectedWhereHouse"
          :isDialog="true"
          v-model:dialogVisible="WarehouseDialog"
        >
          <template #LabelHeader>
            <span class="add-dialog" @click="WarehouseDialog = true">New</span>
          </template>
          <template #Dialog>
            <AddWhereHouse @update:data="WarehouseDialog = false" />
          </template>
        </UpdatedCustomInputSelect>
      </div>

      <div
        class="input-wrapper col-span-2 md:col-span-1"
        v-if="
          deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
        "
        data-required-field="Rent"
      >
        <label for="rent-time"
          >Rent {{ RentTypes.find((el) => el.id == SelectedRentType?.id)?.title }}</label
        >
        <input
          class="input"
          placeholder="Enter Rent Time"
          type="text"
          id="rent-time"
          v-model="Rent"
          @input="setRentTime"
        />
        <p v-if="getFieldError('Rent')" class="required-field-message">
          {{ getFieldError('Rent') }}
        </p>
      </div>

      <div
        class="flex flex-col gap-2 input-wrapper col-span-2 md:col-span-1"
        v-if="
          deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
        "
        data-required-field="StartDate"
      >
        <label>{{ $t('start_date') }}</label>
        <DatePicker
          v-model="StartDate"
          id="start_date"
          placeholder="Enter Start Date"
          :showTime="true"
          @update:modelValue="setStartDate"
        />
        <p v-if="getFieldError('StartDate')" class="required-field-message">
          {{ getFieldError('StartDate') }}
        </p>
      </div>

      <div
        class="flex flex-col gap-2 input-wrapper col-span-2 md:col-span-1"
        v-if="
          deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
        "
      >
        <label>{{ $t('end_date') }}</label>
        <DatePicker
          :showTime="true"
          v-model="EndDate"
          id="end_date"
          placeholder="Auto-calculated end date"
          disabled
        />
      </div>

      <div class="input-wrapper col-span-2 md:col-span-1">
        <label for="License Plate Number">
          {{ $t('License Plate No.') }}
        </label>
        <input
          type="text"
          id="License Plate Number"
          v-model="licensePlateNumber"
          @input="updateData"
          :placeholder="$t('License Plate Number')"
        />
      </div>

      <div
        class="input-wrapper col-span-2 md:col-span-1"
        v-if="user?.type == OrganizationTypeEnum?.ADMIN"
      >
        <CustomCheckbox
          :title="'all_industries'"
          :checked="allIndustries"
          @update:checked="allIndustries = $event"
          :index="2"
        />
      </div>
      <div class="input-wrapper" v-if="deviceStatus == EquipmentStatus.RENT"></div>

      <div
        class="col-span-2 md:col-span-1"
        v-if="!allIndustries && user?.type == OrganizationTypeEnum?.ADMIN"
      >
        <CustomSelectInput
          :modelValue="industry"
          :controller="industryController"
          :params="industryParams"
          label="Industry"
          id="EquipmentType"
          placeholder="Select industry"
          :type="2"
          @update:modelValue="setIndustry"
        />
      </div>

      <div class="col-span-2 md:col-span-2 card_Qr">
        <div class="machine_card">
          <h6>{{ EquipmentTypesEnum[activeTab] }} card</h6>
          <p>Preview only — data shown is illustrative. Confirm to add the equipment</p>
        </div>
        <div class="Qr_EQUIPMENt">
          <DemoCard
            v-if="user?.type === OrganizationTypeEnum.ORGANIZATION"
            :equipmentName="equipmentName"
            :isForm="true"
            :inspectionDuration="inspectionDuration || $t('Determined')"
            :image="image || ''"
            :selctedequipment="langs"
            :selectedequipmentType="equipmentType"
            :decommissioningDate="decommissioningDate || ''"
            :isBreadCramp="true"
            :BreadCramps="breadcrumbs || []"
            :langDefault="langDefault"
            :cardType="EquipmentTypesEnum[activeTab]"
            :expiredate="decommissioningDate"
            :startDate="StartDate"
            :EndDate="EndDate"
            :rentType="RentTypes.find((el) => el.id == SelectedRentType?.id)?.id"
            :typerent="user?.type === OrganizationTypeEnum.ORGANIZATION"
            :deviceStatus="deviceStatus"
          />
          <!-- <img src="@/assets/images/qr.png" alt="qr" class="qr-scan" /> -->
        </div>
      </div>
      <!-- <QrCard v-if="user?.type === OrganizationTypeEnum.ORGANIZATION" /> -->
    </div>
  </div>
</template>

<style scoped>
.Qr_EQUIPMENt {
  display: flex;
  align-items: center;
}

.add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;
  color: var(--brand-primary-500);
  text-decoration: underline;
  font-family: 'Regular';
}

.add-dialog svg {
  width: 18px;
  height: 18px;
}

.radio-wrapper {
  padding: 0;
}

.h-full {
  height: 100%;
  padding: 12px;
}

.check-box {
  input {
    width: 15px !important;
    height: 15px !important;
    transform: translateY(8px);

    &::before {
      width: 15px !important;
      height: 15px !important;
    }

    /* &::after {
      width: 5px !important;
      height: 5px !important;
      top: 30% !important;
      left: 30% !important;
      transform: translate(-50%, -50%) !important;
      display: flex;
      align-items: center;
      justify-content: center;
    } */
  }
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

.equipment-form.is-dark {
  color: var(--text-strong);
}

.equipment-form.is-dark .vehicle,
.equipment-form.is-dark .card_Qr,
.equipment-form.is-dark .machine_card,
.equipment-form.is-dark .Qr_EQUIPMENt,
.equipment-form.is-dark .radio-wrapper {
  background: var(--surface-1) !important;
  border-color: var(--main-border) !important;
  color: var(--text-strong) !important;
  box-shadow: 0 14px 34px color-mix(in srgb, var(--text-strong) 20%, transparent) !important;
}

.equipment-form.is-dark .machine_card p,
.equipment-form.is-dark .radio-wrapper label,
.equipment-form.is-dark label,
.equipment-form.is-dark .input-wrapper label {
  color: var(--text-soft) !important;
}

.equipment-form.is-dark .machine_card h6 {
  color: var(--text-strong) !important;
}

.equipment-form.is-dark .radio-wrapper.active {
  background: color-mix(in srgb, var(--PrimaryColor) 18%, var(--surface-1)) !important;
  border-color: color-mix(in srgb, var(--PrimaryColor) 48%, var(--main-border)) !important;
}

.equipment-form.is-dark input {
  background-color: var(--surface-2) !important;
  border-color: var(--main-border) !important;
  color: var(--text-strong) !important;
}

.equipment-form.is-dark input::placeholder {
  color: var(--text-muted) !important;
}

@media (max-width: 768px) {
  .equipment-form {
    width: 100%;
    min-width: 0;

    > .grid {
      grid-template-columns: minmax(0, 1fr) !important;
      gap: 16px;
      margin-top: 20px;
    }

    > .grid > * {
      grid-column: 1 / -1 !important;
      min-width: 0;
    }
  }

  .vehicle {
    align-items: stretch;
    flex-direction: column !important;

    > div,
    .input-wrapper,
    .w-1\/2 {
      width: 100% !important;
    }
  }

  .card_Qr {
    grid-template-columns: minmax(0, 1fr) !important;
    padding: 16px !important;
  }

  .Qr_EQUIPMENt {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .equipment-form > .grid {
    gap: 12px;
    margin-top: 14px;
  }

  .equipment-form .col-span-2.flex.item-center {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;

    .radio-wrapper {
      width: 100%;
    }
  }

  .card_Qr {
    border-radius: 14px !important;
    padding: 12px !important;
  }

  .Qr_EQUIPMENt {
    align-items: stretch;
    flex-direction: column;
    padding: 10px;
  }
}
</style>
