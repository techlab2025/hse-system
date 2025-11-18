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
import ObservationContainer from './ObservationContainer.vue'
import ObservationLevel from './ObservationLevel.vue'
import HazerdType from './HazerdType.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'

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

const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// dynamic languages from backend
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

const user = useUserStore()

const fetchLang = async () => {
  if (user?.user?.languages?.length) {
    langDefault.value = user.user.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }

  const params = new IndexLangParams('', 1, 10, 0)
  const response = await IndexLangController.getInstance().getData(params)

  if (response.value?.data?.length) {
    langDefault.value = response.value.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', title: '', icon: USA },
      { locale: 'ar', title: '', icon: SA },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const AllIndustry = user.user?.type == OrganizationTypeEnum.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new EditObservationParams(
        props.data.id!,
        translationsParams,
        AllIndustry,
        industry.value.map((i) => i.id),
      )
    : new AddObservationParams(
        translationsParams,
        AllIndustry,
        industry.value.map((i) => i.id),
      )

  emit('update:data', params)
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  updateData()
}

// init values
watch(
  [() => props.data, () => langDefault.value],
  ([newData, defaults]) => {
    if (defaults.length) {
      if (newData?.titles?.length) {
        langs.value = defaults.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = defaults.map((l) => ({ locale: l.locale, title: '' }))
      }

      allIndustries.value = newData?.allIndustries ?? false
      industry.value = newData?.industries ?? []
    }
  },
  { immediate: true },
)

const activeTab = ref('Equipment')
const changeTab = (tab: string) => {
  activeTab.value = tab
  emit('update:activeTab', tab)
}
const machine = ref(null)

const setMachine = (value: any) => {
  machine.value = value
}

const machineTypes = [
  { id: 1, title: 'Forklift' },
  { id: 2, title: 'Safety Helmet' },
  { id: 3, title: 'Fire Extinguisher' },
]
</script>

<template>
  <div class="observation-form">
    <HeaderPage
      :title="$t('create Observations')"
      subtitle="Document what you observe to improve workplace safety"
      :img="ToDoList"
    />

    <TabsSelection :LocationIds="[137 ]" />

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
          :modelValue="machine"
          :staticOptions="machineTypes"
          label="Machine Type"
          placeholder="Select Machine"
          @update:modelValue="setMachine"
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

    <ObservationContainer />
    <ObservationLevel />
    <HazerdType />
  </div>
</template>
