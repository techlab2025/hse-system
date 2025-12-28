<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import EditWhereHouseParams from '../../Core/params/editWhereHouseParams'
import AddWhereHouseParams from '../../Core/params/addWhereHouseParams'
import type WhereHouseDetailsModel from '../../Data/models/WhereHouseDetailsModel'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexWhereHouseController from '../controllers/indexWhereHouseController'
import IndexWhereHouseParams from '../../Core/params/indexWhereHouseParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: WhereHouseDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id

// ---------- State ----------
const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

// default available langs from backend
const langDefault = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()

// ---------- Fetch available languages ----------
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0
) => {
  // console.log(user.user, 'user')
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexWhereHouseController = await IndexLangController.getInstance().getData(params)

  const response = indexWhereHouseController.value

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


onMounted(async () => {
  await fetchLang()
})

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()

  // titles
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  console.log(translationsParams, "langs");
  const params = props.data?.id
    ? new EditWhereHouseParams(props.data.id, translationsParams, SelectedWhereHouseType.value?.id)
    : new AddWhereHouseParams(translationsParams, SelectedWhereHouseType?.value?.id)

  // console.log(params, 'params')

  emit('update:data', params)
}

// ---------- Watchers ----------
// Init from props (edit mode) or defaults (create mode)
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      // titles
      console.log(newData, "newData");
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      updateData()
    }
  },
  { immediate: true }
)
watch(
  langs,
  () => {
    updateData()
  },
  { deep: true }
)

const SelectedWhereHouseType = ref<TitleInterface>()

const indexWhereHouseTypeController = IndexWhereHouseController.getInstance()
const indexWhereHouseTypeParams = new IndexWhereHouseParams('', 1, 10, 1, false)
const setSelectedWhereHouseType = (data: TitleInterface) => {
  SelectedWhereHouseType.value = data
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :required="false" :modelValue="SelectedWhereHouseType"
      :controller="indexWhereHouseTypeController" :params="indexWhereHouseTypeParams" label="Observation Type "
      id="Equipment" placeholder="Select Observation Type" @update:modelValue="setSelectedWhereHouseType" />
  </div>
</template>
