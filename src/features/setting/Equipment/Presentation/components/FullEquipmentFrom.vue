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

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: EquipmentDetailsModel
}>()
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

const equipmentStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Own') }),
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
const indexEquipmentTypeParams = new IndexEquipmentTypeParams(
  '',
  1,
  10,
  1,
  0,
  Number(activeTab.value) || EquipmentTypesEnum.EQUIPMENT
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
    1,
    10,
    1,
    0,
    Number(activeTab.value) || EquipmentTypesEnum.EQUIPMENT
  )
  const response = await indexEquipmentTypeController.getData(
    indexEquipmentTypeParams,
  )
  if (response.value.data?.length > 0) {
    AllEquipmentTypes.value = response.value.data
    // console.log(AllEquipmentTypes.value, " AllEquipmentTypes.value");
  }
  else {
    AllEquipmentTypes.value = []

  }
}
onMounted(() => {
  fetchLang()
  GetEquipmentType()
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

const setImage = (value: string) => {
  image.value = value
  updateData()
}

const setCertificateImage = (value: string) => {
  certificateImage.value = value
  updateData()
}

const equipmentName = computed(() => {
  const defaultLang = langDefault.value[0]?.locale
  const lang = langs.value.find((l) => l.locale === defaultLang)
  return lang?.title || ''
})


const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => translationsParams.setTranslation('title', lang.locale, lang.title))
  const AllIndustry = user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null

  const params = props.data?.id ? new EditEquipmentParams(
    +route.params.id,
    translationsParams,
    equipmentType.value?.id,
    decommissioningDate.value,
    equipmentStatus.value?.id,
    inspectionDuration.value,
    licenseNumber.value,
    licensePlateNumber.value,
    image.value,
    certificateImage.value,
    AllIndustry,
    industry.value?.map((item) => item.id),
    null,
    null
  )
    : new AddEquipmentParams(
      translationsParams,
      equipmentType.value?.id,
      decommissioningDate.value,
      equipmentStatus.value?.id,
      inspectionDuration.value,
      licenseNumber.value,
      licensePlateNumber.value,
      image.value,
      certificateImage.value,
      AllIndustry,
      industry.value?.map((item) => item.id),
      +route.params.parent_id,
    )

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
const indexContractorTypeParams = new IndexContractorParams("", 1, 10, 1
)
const SelectedContractor = ref<TitleInterface>()
const setContructor = (data: TitleInterface) => {
  SelectedContractor.value = data
  updateData()
}


const deviceStatus = ref<TitleInterface | null>(null)


const deviceStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Own') }),
])

const setDeviceStatus = (data: TitleInterface) => {
  deviceStatus.value = data
  updateData();
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
      console.log(newData, " newData ");

      industry.value = newData?.industries ?? []
      equipmentType.value = newData?.equipmentTypeId as TitleInterface ?? null
      allIndustries.value = newData?.allIndustries == 1 ? true : false
      inspectionDuration.value = newData?.inspectionDuration || null
      licenseNumber.value = newData?.licenseNumber || null
      licensePlateNumber.value = newData?.licensePlateNumber || null
      equipmentStatus.value = newData?.status || null
      image.value = newData?.image || null
      decommissioningDate.value = newData?.date || null
      certificateImage.value = newData?.certificateImage || null

      langTitleValid.value = langs.value.some((l) => l.title?.trim()?.length > 0)
      console.log(equipmentType.value, "  equipmentType.value ");

    }
  },
  { immediate: true },
)

watch(() => activeTab.value, () => {
  // indexEquipmentTypeParams = new IndexEquipmentTypeParams(
  //   '',
  //   1,
  //   10,
  //   1,
  //   0,
  //   Number(activeTab.value),
  // )
  GetEquipmentType()
})

// watch(() => indexEquipmentTypeController.state.value, (newVal) => {
//   if (newVal) {
//     // AllEquipmentTypes.value = newVal
//   }
// })
</script>

<template>
  <div class="w-full col-span-6 equipment-form">

    <Tabs @update:activeTab="activeTab = $event" :activeTabData="activeTab" />

    <div class="vehicle w-full col-span-6" v-if="activeTab === EquipmentTypesEnum.EQUIPMENT">
      <Car />

      <div class="input-wrapper check-box">
        <label for="vehicle">
          <p>Mark if this equipment is a <b>vehicle</b></p>
        </label>
        <input type="checkbox" id="vehicle" />
      </div>
    </div>

    <div class="grid lg:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">
      <div class="">
        <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
      </div>

      <!-- v-if="" -->
      <!-- {{ AllEquipmentTypes }} -->
      <!-- v-if="EquipmentTypeState?.data?.length > 0" -->
      <!-- :staticOptions="AllEquipmentTypes" -->
      <div>
        <CustomSelectInput :modelValue="equipmentType" :staticOptions="AllEquipmentTypes"
          :label="`${EquipmentTypesEnum[activeTab]} Type`" id="Equipment Type"
          :placeholder="`Select ${EquipmentTypesEnum[activeTab]} Type`" @update:modelValue="setEquipmentType" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label>{{ $t('upload image') }}</label>
        <SingleFileUpload v-model="image" @update:modelValue="setImage" label="Image" id="image" index="0"
          placeholder="upload image" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label class="flex justify-between flex-wrap">
          <p>{{ $t('Certification upload') }}</p>
          <span class="text-slate-300">{{ $t('Expiry date detected automatically') }}</span>
        </label>
        <SingleFileUpload v-model="certificateImage" @update:modelValue="setCertificateImage"
          label="Certification upload" id="Certification upload" index="1" placeholder="Certification upload" />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label>{{ $t('Date of Decommissioning') }}</label>
        <DatePicker v-model="decommissioningDate" id="Date of Decommissioning"
          :placeholder="`Date of Decommissioning`" />
      </div>

      <div v-if="user?.type === OrganizationTypeEnum.ORGANIZATION">
        <CustomSelectInput :modelValue="deviceStatus" :staticOptions="deviceStatusOptions" label="Device status"
          id="Device status" placeholder="Device status" @update:modelValue="setDeviceStatus" />
      </div>
      <div v-if="deviceStatus?.id == EquipmentStatus.RENT && user?.type === OrganizationTypeEnum.ORGANIZATION">
        <CustomSelectInput :modelValue="SelectedContractor" :controller="indexContractorController"
          :params="indexContractorTypeParams" label="Contructor" id="contructor" placeholder="Selected Contructor.."
          @update:modelValue="setContructor" />
      </div>

      <!-- <div class="input-wrapper">
        <label for="License number">
          {{ $t('License number') }}
        </label>
        <input type="text" id="License number" v-model="licenseNumber" @input="updateData"
          :placeholder="$t('License number')" />
      </div> -->
      <div class="input-wrapper">
        <label for="License Plate Number">
          {{ $t('License Plate No.') }}
        </label>
        <input type="text" id="License Plate Number" v-model="licensePlateNumber" @input="updateData"
          :placeholder="$t('License Plate Number')" />
      </div>

      <div class="input-wrapper " v-if="user?.type == OrganizationTypeEnum?.ADMIN">
        <CustomCheckbox :title="`all_industries`" :checked="allIndustries" @update:checked="allIndustries = $event" />
      </div>

      <div v-if="!allIndustries && user?.type == OrganizationTypeEnum?.ADMIN">
        <CustomSelectInput :modelValue="industry" :controller="industryController" :params="industryParams"
          label="Industry" id="EquipmentType" placeholder="Select industry" :type="2"
          @update:modelValue="setIndustry" />
      </div>

      <DemoCard v-if="user?.type === OrganizationTypeEnum.ORGANIZATION" :equipmentName="equipmentName"
        :inspectionDuration="inspectionDuration || $t('Determined')" :image="image || ''"
        :decommissioningDate="decommissioningDate || ''" :isBreadCramp="true" :certificateImage="certificateImage || ''"
        :BreadCramps="breadcrumbs || []" />

      <QrCard v-if="user?.type === OrganizationTypeEnum.ORGANIZATION" />

    </div>


  </div>

</template>
