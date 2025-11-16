<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import DatePicker from 'primevue/datepicker'
import TranslationsParams from '@/base/core/params/translations_params'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { useRoute } from 'vue-router'
import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
import AddEquipmentParams from '../../Core/params/addEquipmentParams'
import EditEquipmentParams from '../../Core/params/editEquipmentParams'
import type EquipmentModel from '../../Data/models/equipmentModel'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import Car from '@/shared/icons/car.vue'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import QrCard from './QrCard.vue'
import DemoCard from './DemoCard.vue'

const emit = defineEmits(['update:data', 'validate'])
const props = defineProps<{ data?: EquipmentModel }>()

const route = useRoute()
const id = Number(route.params.id)

// Validation states
const langTitleValid = ref(false)
const equipmentTypeValid = ref(false)
const industryValid = ref(false)

// Ref to LangTitleInput component
const langTitleInputRef = ref<InstanceType<typeof LangTitleInput> | null>(null)

// Validation computed
const isFormValid = computed(() => {
  const hasValidLangTitle = langTitleValid.value
  const hasEquipmentType = Equipment.value !== null
  const hasValidIndustry = allIndustries.value === 1 || industry.value.length > 0

  return (
    hasValidLangTitle &&
    hasEquipmentType &&
    (user.user?.type !== OrganizationTypeEnum?.ADMIN || hasValidIndustry)
  )
})

defineExpose({
  validate: () => {
    // Manually trigger validation on LangTitleInput
    if (langTitleInputRef.value) {
      langTitleInputRef.value.validate()
    }

    // Validate equipment type
    if (!Equipment.value) {
      equipmentTypeValid.value = false
    }

    // Validate industry (if admin)
    if (user.user?.type === OrganizationTypeEnum?.ADMIN) {
      if (!allIndustries.value && industry.value.length === 0) {
        industryValid.value = false
      }
    }

    return isFormValid.value
  },
  isValid: isFormValid,
})

const indexEquipmentTypeController = IndexEquipmentTypeController.getInstance()
const indexEquipmentTypeParams = new IndexEquipmentTypeParams('', 1, 10, 1)
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const industry = ref<TitleInterface[]>([])
const Equipment = ref<TitleInterface | null>(null)
const allIndustries = ref(0)
const hasCertificate = ref(0)

const user = useUserStore()
// Fetch available languages and set defaults
const fetchLang = async (query = '', pageNumber = 1, perPage = 10, withPage = 0) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const controller = await IndexLangController.getInstance().getData(params)
  const response = controller.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

onMounted(fetchLang)

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = !props.data?.id
    ? new AddEquipmentParams(
        translationsParams,
        hasCertificate.value,
        AllIndustry,
        industry.value.map((i) => i.id),
        id,
        Equipment.value?.id!,
        // Certificates.value.map((item) => item.id)
      )
    : new EditEquipmentParams(
        props.data.id ?? 0,
        translationsParams,
        hasCertificate.value,
        AllIndustry,
        industry.value.map((i) => i.id),
        props.data.id ?? 0,
        Equipment.value?.id!,
        // Certificates.value.map((item) => item.id)
      )

  emit('update:data', params)
  emit('validate', isFormValid.value)
}

const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  industryValid.value = data.length > 0
  updateData()
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

const setEquipmentType = (data: TitleInterface) => {
  Equipment.value = data
  updateData()
}

// Watch for changes in props.data or langDefault to initialize form values
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      langs.value = newDefault.map((l) => {
        const existing = newData?.titles?.find((t) => t.locale === l.locale)
        return existing ? { ...l, title: existing.title } : { ...l }
      })
      industry.value = newData?.industries ?? []
      Equipment.value = newData?.equipmentTypeId
      allIndustries.value = newData?.allIndustries == 1

      // Set initial validation states
      langTitleValid.value = langs.value.some((l) => l.title && l.title.trim().length > 0)
      equipmentTypeValid.value = Equipment.value !== null
      industryValid.value = allIndustries.value === 1 || industry.value.length > 0
    }
  },
  { immediate: true },
)

const handleLangValidation = (isValid: boolean) => {
  langTitleValid.value = isValid
  emit('validate', isFormValid.value)
}

const image = ref<string | null>(null)
const decommissioningDate = ref<string | null>(null)
</script>

<template>
  <form class="w-full">
    <div class="vehicle">
      <Car />

      <div class="input-wrapper check-box">
        <label for="vehicle">
          <p>Mark if this equipment is a <b>vehicle</b></p>
        </label>
        <input type="checkbox" id="vehicle" />
      </div>
    </div>

    <div class="grid lg:grid-cols-2 sm:grid-cols-2 gap-6 mt-8">
      <div class="">
        <LangTitleInput
          :langs="langDefault"
          :modelValue="langs"
          @update:modelValue="setLangs"
          @validate="handleLangValidation"
        />
      </div>

      <div>
        <CustomSelectInput
          :modelValue="Equipment"
          :controller="indexEquipmentTypeController"
          :params="indexEquipmentTypeParams"
          label="EquipmentType"
          id="EquipmentType"
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
          placeholder="upload image"
        />
      </div>

      <div class="flex flex-col gap-2 input-wrapper">
        <label class="flex justify-between">
          <p>{{ $t('Certification upload') }}</p>
          <span class="text-slate-300">{{ $t('Expiry date detected automatically') }}</span>
        </label>
        <SingleFileUpload
          v-model="image"
          @update:modelValue="setImage"
          label="Image"
          id="image"
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
          :modelValue="industry"
          :controller="industryController"
          :params="industryParams"
          label="Equipment status"
          id="Equipment status"
          placeholder="Equipment status"
          :type="2"
          @update:modelValue="setIndustry"
        />
      </div>

      <div class="input-wrapper">
        <label for="inspection duration">
          {{ $t('inspection duration') }}
        </label>
        <input type="number" id="inspection duration" :placeholder="$t('inspection duration')" />
      </div>

      <div>
        <CustomSelectInput
          :modelValue="industry"
          :controller="industryController"
          :params="industryParams"
          label="inspection template"
          id="inspection template"
          placeholder="inspection template"
          :type="2"
          @update:modelValue="setIndustry"
        />
      </div>

      <div class="input-wrapper">
        <label for="License number">
          {{ $t('License number') }}
        </label>
        <input type="number" id="License number" :placeholder="$t('License number')" />
      </div>

      <div class="input-wrapper">
        <label for="License Plate Number">
          {{ $t('License Plate Number') }}
        </label>
        <input type="number" id="License Plate Number" :placeholder="$t('License Plate Number')" />
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

      <DemoCard />

      <QrCard />
    </div>
  </form>
</template>
