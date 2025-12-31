<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue'
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

const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: EquipmentDetailsModel }>()

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
    Number(activeTab.value) || EquipmentTypesEnum.EQUIPMENT
  )
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
    new IndexLangParams('', 1, 10, 0)
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
    Number(activeTab.value) || EquipmentTypesEnum.EQUIPMENT
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

const setImage = async (value: string) => {
  image.value = typeof value === 'string' ? value : await filesToBase64(value)
  updateData()
}

const setCertificateImage = async (value: string) => {
  certificateImage.value = typeof value === 'string' ? value : await filesToBase64(value)
  updateData()
}

const equipmentName = computed(() => {
  const defaultLang = langDefault.value[0]?.locale
  const lang = langs.value.find((l) => l.locale === defaultLang)
  return lang?.title || ''
})

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) =>
    translationsParams.setTranslation('title', lang.locale, lang.title)
  )

  const AllIndustry = user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null
  const StartDateFormat = formatJoinDate(StartDate.value) + ' ' + formatTime(StartDate.value)
  const EndDateFormat = formatJoinDate(EndDate.value) + ' ' + formatTime(EndDate.value)

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
      image: typeof image.value === 'string' ? image.value : '',
      certificateImage: typeof certificateImage.value === 'string' ? certificateImage.value : '',
      AllIndustry: AllIndustry,
      industry: industry.value?.map((item) => item.id),
      parentId: +route.params.parent_id,
      constructorId: SelectedContractor.value?.id,
      equipmentRentType: SelectedRentType?.value?.id,
      equipmentRentTime: Rent.value,
      equipmentRentStartDate: StartDateFormat,
      VehicleKm: VehicleKm.value,
      serialNumber: SerialNumber.value?.SerialNumber,
      SelectedWhereHosue: SelectedWhereHosue.value?.id,
      equipmentRentEndDate: deviceStatus.value == EquipmentStatus.RENT && Rent.value ? EndDateFormat : null,
    })
    : new AddEquipmentParams({
      translation: translationsParams,
      equipmentTypeId: equipmentType.value?.id,
      date: decommissioningDate.value,
      status: deviceStatus.value,
      inspectionDuration: inspectionDuration.value,
      licenseNumber: licenseNumber.value,
      licensePlateNumber: licensePlateNumber.value,
      image: image.value,
      certificateImage: certificateImage.value,
      AllIndustry: AllIndustry,
      industry: industry.value?.map((item) => item.id),
      parentId: +route.params.parent_id,
      constructorId: SelectedContractor.value?.id,
      equipmentRentType: SelectedRentType?.value?.id,
      equipmentRentTime: Rent.value,
      equipmentRentStartDate: deviceStatus.value == EquipmentStatus.RENT ? StartDateFormat : null,
      VehicleKm: VehicleKm.value,
      serialNumber: SerialNumber.value?.SerialNumber,
      SelectedWhereHosue: SelectedWhereHosue.value?.id,
      equipmentRentEndDate: deviceStatus.value == EquipmentStatus.RENT && Rent.value ? EndDateFormat : null,

    })

  console.log(StartDateFormat, "date")
  console.log(EndDateFormat, "time")
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
const indexContractorTypeParams = new IndexContractorParams('', 1, 10, 1, false)
const SelectedContractor = ref<TitleInterface>()

const setContructor = (data: TitleInterface) => {
  SelectedContractor.value = data
  updateData()
}

const deviceStatus = ref<number>(null)

const deviceStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Owned') }),
])

const UpdateDeviceStatus = (data) => {
  deviceStatus.value = data.target.value
  updateData()
}

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
      image.value = newData?.image || null
      decommissioningDate.value = newData?.date || null
      certificateImage.value = newData?.certificateImage || null
      langTitleValid.value = langs.value.some((l) => l.title?.trim()?.length > 0)
      activeTab.value = newData?.equipment_type?.type
      indexEquipmentTypeParams.value = new IndexEquipmentTypeParams('', 1, 10, 1, null, activeTab.value)
      SelectedContractor.value = newData?.constructor
      SelectedRentType.value = RentTypes.value.find((item) => item.id === newData?.RentType)
      Rent.value = newData?.RentTime
      StartDate.value = newData?.checkinDate ? new Date(newData.checkinDate) : null
      VehicleKm.value = newData?.kilometer
      isVehicle.value = newData?.kilometer ? true : false
      SelectedWhereHosue.value = newData?.wareHouse
      EndDate.value = newData?.RentEndDate ? new Date(newData.RentEndDate) : null
    }
  },
  { immediate: true }
)

watch(
  () => activeTab.value,
  (Newvalue) => {
    indexEquipmentTypeParams.value = new IndexEquipmentTypeParams('', null, null, null, null, Newvalue)
  }
)

const RentTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: RentTypeEnum.HOUR, title: 'Hour' }),
  new TitleInterface({ id: RentTypeEnum.DAY, title: 'Day' }),
  new TitleInterface({ id: RentTypeEnum.MONTH, title: 'Month' }),
  new TitleInterface({ id: RentTypeEnum.YEAR, title: 'Year' }),
])

const SelectedRentType = ref<TitleInterface>(
  new TitleInterface({ id: RentTypeEnum.HOUR, title: 'Hour' })
)

const setRentType = (data: TitleInterface) => {
  SelectedRentType.value = data
  calculateEndDate()
  updateData()
}

const Rent = ref<string>()

const setRentTime = (time: string) => {
  Rent.value = time.target.value
  calculateEndDate()
  updateData()
}

const setDecoDate = (date) => {
  decommissioningDate.value = formatJoinDate(date)
  updateData()
}

const StartDate = ref<Date>()

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
    enabled: props?.data?.id ? false : true,
  },
])

const UpdateSerial = (data) => {
  SerialNumber.value = data
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

const EquipmentTypeDialog = ref(false)
const ContractorDialog = ref(false)
</script>

<template>
  <div class="w-full col-span-6 equipment-form">
    <Tabs @update:activeTab="activeTab = $event" :activeTabData="activeTab" />

    <div class="vehicle flex w-full col-span-6" v-if="activeTab === EquipmentTypesEnum.EQUIPMENT">
      <div class="flex gap-2 w-full col-span-6">
        <Car />
        <div class="input-wrapper check-box">
          <label for="vehicle">
            <p>Mark if this equipment is a <b>vehicle</b></p>
          </label>
          <input v-model="isVehicle" @change="updateData" type="checkbox" id="vehicle" />
        </div>
      </div>
      <div class="input-wrapper w-1/2" v-if="isVehicle">
        <input class="input" placeholder="Enter Vehicle Km" type="text" id="inspection_duration" v-model="VehicleKm"
          @input="setVehicleKm" />
      </div>
    </div>

    <div class="grid lg:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">
      <div class="">
        <LangTitleInput :label="`${EquipmentTypesEnum[activeTab]} Name`" :langs="langDefault" :modelValue="langs"
          @update:modelValue="setLangs" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper" v-if="!data?.id">
        <SwitchInput :fields="fields" :switch_title="$t('auto')" :isAuto="false" :switch_reverse="false"
          @update:value="UpdateSerial" />
      </div>

      <div>
        <UpdatedCustomInputSelect @update:reload="GetEquipmentType" :modelValue="equipmentType"
          :controller="indexEquipmentTypeController" :params="indexEquipmentTypeParams"
          :label="`${EquipmentTypesEnum[activeTab]} Type`" id="Equipment Type"
          :placeholder="`Select ${EquipmentTypesEnum[activeTab]} Type`" @update:modelValue="setEquipmentType"
          :isDialog="true" :dialogVisible="EquipmentTypeDialog">
          <template #LabelHeader>
            <span class="add-dialog" @click="EquipmentTypeDialog = true">New</span>
          </template>
          <template #Dialog>
            <AddEquipmentType @close:data="EquipmentTypeDialog = false" />
          </template>
        </UpdatedCustomInputSelect>
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label>{{ $t('upload image') }}</label>
        <SingleFileUpload v-model="image" @update:modelValue="setImage" label="Image" id="image" index="1"
          placeholder="upload image" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label class="flex justify-between flex-wrap">
          <p>{{ $t('Certification / Inspection Image upload') }}</p>
        </label>
        <SingleFileUpload v-model="certificateImage" @update:modelValue="setCertificateImage"
          label="Certification upload" id="Certification upload" index="2" placeholder="Certification upload" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label>{{ $t('certification / Inspection expiry date') }}</label>
        <DatePicker v-model="decommissioningDate" id="Date of Decommissioning" placeholder="certification expiry date"
          @update:modelValue="setDecoDate" />
      </div>

      <div class="flex item-center justify-start gap-4" v-if="user?.type === OrganizationTypeEnum.ORGANIZATION">
        <div class="radio-wrapper gap-2" :class="deviceStatus == option?.id ? 'active' : ''"
          v-for="(option, index) in deviceStatusOptions" :key="index">
          <label :for="`${option?.id}-${option?.title}`">{{ option?.title }}</label>
          <input :id="`${option?.id}-${option?.title}`" type="radio" v-model="deviceStatus" :value="option?.id"
            name="radio" @change="UpdateDeviceStatus" />
        </div>
      </div>

      <div v-if="
        deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
      ">
        <!-- <CustomSelectInput :modelValue="SelectedContractor" :controller="indexContractorController"
          :params="indexContractorTypeParams" label="Contructor" id="contructor" placeholder="Selected Contructor.."
          @update:modelValue="setContructor" /> -->
        <UpdatedCustomInputSelect :modelValue="SelectedContractor" :controller="indexContractorController"
          :params="indexContractorTypeParams" :label="`Contructor`" id="Contructor" :placeholder="`Select Contructor`"
          @update:modelValue="setContructor" :isDialog="true" :dialogVisible="ContractorDialog">
          <template #LabelHeader>
            <span class="add-dialog" @click="ContractorDialog = true">New</span>
          </template>
          <template #Dialog>
            <AddContractor @update:data="ContractorDialog = false" />
          </template>
        </UpdatedCustomInputSelect>
      </div>

      <div v-if="
        deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
      ">
        <CustomSelectInput :staticOptions="RentTypes" :modelValue="SelectedRentType" label="Rent Type" id="Rent Type"
          placeholder="Selected Rent Type.." @update:modelValue="setRentType" />
      </div>

      <div class="input-wrapper" v-if="
        deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
      ">
        <label for="rent-time">Rent {{RentTypes.find((el) => el.id == SelectedRentType?.id)?.title}}</label>
        <input class="input" placeholder="Enter Rent Time" type="text" id="rent-time" v-model="Rent"
          @input="setRentTime" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper" v-if="
        deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
      ">
        <label>{{ $t('start_date') }}</label>
        <DatePicker v-model="StartDate" id="start_date" placeholder="Enter Start Date" :showTime="true"
          @update:modelValue="setStartDate" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper" v-if="
        deviceStatus == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION
      ">
        <label>{{ $t('end_date') }}</label>
        <DatePicker :showTime="true" v-model="EndDate" id="end_date" placeholder="Auto-calculated end date" disabled />
      </div>

      <div class="input-wrapper">
        <label for="License Plate Number">
          {{ $t('License Plate No.') }}
        </label>
        <input type="text" id="License Plate Number" v-model="licensePlateNumber" @input="updateData"
          :placeholder="$t('License Plate Number')" />
      </div>

      <div class="input-wrapper" v-if="user?.type == OrganizationTypeEnum?.ADMIN">
        <CustomCheckbox :title="'all_industries'" :checked="allIndustries" @update:checked="allIndustries = $event" />
      </div>

      <div v-if="!allIndustries && user?.type == OrganizationTypeEnum?.ADMIN">
        <CustomSelectInput :modelValue="industry" :controller="industryController" :params="industryParams"
          label="Industry" id="EquipmentType" placeholder="Select industry" :type="2"
          @update:modelValue="setIndustry" />
      </div>

      <DemoCard v-if="user?.type === OrganizationTypeEnum.ORGANIZATION" :equipmentName="equipmentName"
        :inspectionDuration="inspectionDuration || $t('Determined')" :image="image || ''" :selctedequipment="langs"
        :selectedequipmentType="equipmentType" :decommissioningDate="decommissioningDate || ''" :isBreadCramp="true"
        :certificateImage="certificateImage || ''" :BreadCramps="breadcrumbs || []"
        :cardType="EquipmentTypesEnum[activeTab]" />

      <QrCard v-if="user?.type === OrganizationTypeEnum.ORGANIZATION" />
    </div>
  </div>
</template>

<style scoped>
.add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;
  color: #1d4ed8;
  text-decoration: underline;
  font-family: 'Regular';
}

.add-dialog svg {
  width: 18px;
  height: 18px;
}
</style>
