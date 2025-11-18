<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import DatePicker from 'primevue/datepicker'
import QrCard from './QrCard.vue'
import DemoCard from './DemoCard.vue'
import Car from '@/shared/icons/car.vue'

import TranslationsParams from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'

import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'

import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'

import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'

import AddEquipmentController from '../controllers/addEquipmentController'
import EditEquipmentController from '../controllers/editEquipmentController'

import AddEquipmentParams from '../../Core/params/addEquipmentParams'
import EditEquipmentParams from '../../Core/params/editEquipmentParams'
import EquipmentModel from '../../Data/models/equipmentModel'

import { LangsMap } from '@/constant/langs'
// import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { EquipmentStatus } from '../../Core/enum/EquipmentStatus'
import { useI18n } from 'vue-i18n'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type EquipmentDetailsModel from '../../Data/models/equipmentDetailsModel'

const emit = defineEmits(['update:data'])

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { equipmentData } = defineProps<{ equipmentData?: EquipmentDetailsModel }>()

const user = useUserStore()

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

const equipmentStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Own') }),
])

const setEquipmentStatus = (data: TitleInterface) => {
  equipmentStatus.value = data
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
  EquipmentTypesEnum.EQUIPMENT,
)

const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const fetchLang = async () => {
  if (user?.user?.languages?.length) {
    langDefault.value = user.user.languages.map((item: any) => ({
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

onMounted(fetchLang)

const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  langTitleValid.value = data.some((l) => l.title?.trim()?.length > 0)
}

const setEquipmentType = (data: TitleInterface) => {
  equipmentType.value = data
}

const setImage = (value: string) => {
  image.value = value
}

const setCertificateImage = (value: string) => {
  certificateImage.value = value
}

watch(
  [() => equipmentData, () => langDefault.value],
  ([newData, defaults]) => {
    if (!defaults.length) return

    langs.value = defaults.map((l) => {
      const existing = newData?.titles?.find((t) => t.locale === l.locale)
      return existing ? { ...l, title: existing.title } : { ...l }
    })

    if (route.params.id) {
      industry.value = newData?.industries ?? []
      equipmentType.value = newData?.equipmentTypeId ?? null
      allIndustries.value = newData?.allIndustries == 1 ? 1 : 0
      inspectionDuration.value = newData?.inspectionDuration || null
      licenseNumber.value = newData?.licenseNumber || null
      licensePlateNumber.value = newData?.licensePlateNumber || null
      equipmentStatus.value = newData?.status || null
      image.value = newData?.image || null
      decommissioningDate.value = newData?.date || null
      certificateImage.value = newData?.certificateImage || null

      langTitleValid.value = langs.value.some((l) => l.title?.trim()?.length > 0)
    }
  },
  { immediate: true },
)

const addEquipmentController = AddEquipmentController.getInstance()

const equipmentName = computed(() => {
  const defaultLang = langDefault.value[0]?.locale
  const lang = langs.value.find((l) => l.locale === defaultLang)
  return lang?.title || ''
})

const addEquipment = async () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => translationsParams.setTranslation('title', lang.locale, lang.title))

  const AllIndustry = user.user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null

  try {
    if (!route.params.id) {
      await addEquipmentController.addEquipment(
        new AddEquipmentParams(
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
        ),
        router,
      )
    } else {
      await EditEquipmentController.getInstance().editEquipment(
        new EditEquipmentParams(
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
          +route.params.parent_id,
        ),
        router,
      )
    }
  } catch (error) {
    console.error('Error adding equipment:', error)
  }
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
</script>

<template>
  <form class="w-full" @submit.prevent="addEquipment">
    <div class="vehicle">
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

      <div>
        <CustomSelectInput
          :modelValue="equipmentType"
          :controller="indexEquipmentTypeController"
          :params="indexEquipmentTypeParams"
          label="Equipment Type"
          id="Equipment Type"
          placeholder="Select EquipmentType"
          @update:modelValue="setEquipmentType"
        />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label>{{ $t('upload image') }}</label>
        <SingleFileUpload
          v-model="image"
          @update:modelValue="setImage"
          label="Image"
          id="image"
          index="0"
          placeholder="upload image"
        />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label class="flex justify-between flex-wrap">
          <p>{{ $t('Certification upload') }}</p>
          <span class="text-slate-300">{{ $t('Expiry date detected automatically') }}</span>
        </label>
        <SingleFileUpload
          v-model="certificateImage"
          @update:modelValue="setCertificateImage"
          label="Certification upload"
          id="Certification upload"
          index="1"
          placeholder="Certification upload"
        />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label>{{ $t('Date of Decommissioning') }}</label>
        <DatePicker
          v-model="decommissioningDate"
          id="Date of Decommissioning"
          :placeholder="`Date of Decommissioning`"
        />
      </div>

      <div>
        <CustomSelectInput
          :modelValue="equipmentStatus"
          :staticOptions="equipmentStatusOptions"
          label="Equipment status"
          id="Equipment status"
          placeholder="Equipment status"
          @update:modelValue="setEquipmentStatus"
        />
      </div>

      <div class="input-wrapper">
        <label for="inspection duration">
          {{ $t('inspection duration') }}
        </label>
        <input
          type="text"
          id="inspection duration"
          v-model="inspectionDuration"
          :placeholder="$t('inspection duration')"
        />
      </div>

      <div>
        <CustomSelectInput
          :staticOptions="[]"
          label="inspection template"
          id="inspection template"
          placeholder="inspection template"
        />
      </div>

      <div class="input-wrapper">
        <label for="License number">
          {{ $t('License number') }}
        </label>
        <input
          type="text"
          id="License number"
          v-model="licenseNumber"
          :placeholder="$t('License number')"
        />
      </div>

      <div class="input-wrapper">
        <label for="License Plate Number">
          {{ $t('License Plate Number') }}
        </label>
        <input
          type="text"
          id="License Plate Number"
          v-model="licensePlateNumber"
          :placeholder="$t('License Plate Number')"
        />
      </div>

      <div class="input-wrapper check-box" v-if="user.user?.type == OrganizationTypeEnum?.ADMIN">
        <label>{{ $t('all_industries') }}</label>
        <input type="checkbox" :value="1" v-model="allIndustries" />
      </div>

      <div v-if="!allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN">
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

      <div class="" v-else></div>

      <DemoCard
        :equipmentName="equipmentName"
        :inspectionDuration="inspectionDuration || $t('Determined')"
        :image="image || ''"
        :decommissioningDate="decommissioningDate || ''"
        :isBreadCramp="true"
        :certificateImage="certificateImage || ''"
        :BreadCramps="breadcrumbs || []"
      />

      <QrCard />
    </div>

    <div class="flex items-center gap-2 !mt-4">
      <button type="submit" class="btn btn-danger w-30">
        <span>Cancel</span>
      </button>

      <button type="submit" class="btn btn-primary w-full">
        <span>Add Equipment</span>
      </button>
    </div>
  </form>
</template>
