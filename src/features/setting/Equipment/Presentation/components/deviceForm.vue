<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import DatePicker from 'primevue/datepicker'
import DemoCard from './DemoCard.vue'
import QrCard from './QrCard.vue'

import TitleInterface from '@/base/Data/Models/title_interface'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import AddEquipmentParams from '../../Core/params/addEquipmentParams'
import EditEquipmentParams from '../../Core/params/editEquipmentParams'
import type EquipmentModel from '../../Data/models/equipmentModel'

import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import AddEquipmentController from '../controllers/addEquipmentController'
import EditEquipmentController from '../controllers/editEquipmentController'

import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useI18n } from 'vue-i18n'
import { EquipmentStatus } from '../../Core/enum/EquipmentStatus'
import type EquipmentDetailsModel from '../../Data/models/equipmentDetailsModel'

const { deviceData } = defineProps<{ deviceData?: EquipmentDetailsModel }>()
const emit = defineEmits(['update:data'])
const route = useRoute()
const router = useRouter()
// const id = Number(route.params.id)

const user = useUserStore()
// const isAdmin = computed(() => user.user?.type === OrganizationTypeEnum.ADMIN)

const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

const industry = ref<TitleInterface[]>([])
const Equipment = ref<TitleInterface | null>(null)

const allIndustries = ref(0)
// const hasCertificate = ref(0)

const image = ref<string | null>(null)
const decommissioningDate = ref<string | null>(null)

const langTitleValid = ref(false)

const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const inspectionDuration = ref<string | null>(null)
const certificateImage = ref<string | null>(null)

const setCertificateImage = (val: string | null) => {
  certificateImage.value = val
}

const deviceStatus = ref<TitleInterface | null>(null)

const { t } = useI18n()

const deviceStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Own') }),
])

const setDeviceStatus = (data: TitleInterface) => {
  deviceStatus.value = data
}

const fetchLang = async () => {
  if (user.user?.languages?.length) {
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
        { locale: 'en', icon: markRaw(LangsMap.en.icon), title: '' },
        { locale: 'ar', icon: markRaw(LangsMap.ar.icon), title: '' },
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

const setImage = (val: string | null) => {
  image.value = val
}

watch(
  [() => deviceData, () => langDefault.value],
  ([newData, defaults]) => {
    if (!defaults.length) return

    langs.value = defaults.map((l) => {
      const existing = newData?.titles?.find((t) => t.locale === l.locale)
      return existing ? { ...l, title: existing.title } : l
    })

    industry.value = newData?.industries ?? []
    // equipmentType.value = newData?.equipmentTypeId ?? null
    allIndustries.value = newData?.allIndustries == 1 ? 1 : 0
    inspectionDuration.value = newData?.inspectionDuration || null
    // licenseNumber.value = newData?.licenseNumber || null
    // licensePlateNumber.value = newData?.licensePlateNumber || null
    deviceStatus.value = newData?.status || null
    image.value = newData?.image || null
    decommissioningDate.value = newData?.date || null
    certificateImage.value = newData?.certificateImage || null

    langTitleValid.value = langs.value.some((l) => l.title?.trim()?.length > 0)
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
  const translations = new TranslationsParams()
  langs.value.forEach((lang) => translations.setTranslation('title', lang.locale, lang.title))

  const AllIndustry = user.user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null

  const params = route.params.id
    ? new EditEquipmentParams(
        +route.params.id,
        translations,
        null,
        decommissioningDate.value,
        deviceStatus.value?.id,
        inspectionDuration.value,
        '',
        '',
        image.value,
        certificateImage.value,
        AllIndustry,
        industry.value?.map((item) => item.id),
        +route.params.parent_id,
      )
    : new AddEquipmentParams(
        translations,
        null,
        decommissioningDate.value,
        deviceStatus.value?.id,
        inspectionDuration.value,
        '',
        '',
        image.value,
        certificateImage.value,
        AllIndustry,
        industry.value?.map((item) => item.id),
        +route.params.parent_id,
      )

  try {
    if (route.params.id) {
      await EditEquipmentController.getInstance().editEquipment(params, router)
    } else {
      await addEquipmentController.addEquipment(params, router)
    }
  } catch (error) {
    console.error('Error adding equipment:', error)
  }
}
</script>

<template>
  <form class="w-full" @submit.prevent="addEquipment">
    <div class="grid lg:grid-cols-2 sm:grid-cols-2 gap-6 mt-8">
      <div class="">
        <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
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
        <label class="flex justify-between">
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

      <div>
        <CustomSelectInput
          :modelValue="deviceStatus"
          :staticOptions="deviceStatusOptions"
          label="Device status"
          id="Device status"
          placeholder="Device status"
          @update:modelValue="setDeviceStatus"
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

      <div class="input-wrapper">
        <label for="inspection duration">
          {{ $t('inspection duration') }}
        </label>
        <input
          type="text"
          v-model="inspectionDuration"
          id="inspection duration"
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

      <div class=""></div>

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
        :isBreadCramp="false"
        :equipmentName="equipmentName"
        :inspectionDuration="inspectionDuration || $t('Determined')"
        :image="image || ''"
        :decommissioningDate="decommissioningDate || ''"
        :certificateImage="certificateImage || ''"
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
