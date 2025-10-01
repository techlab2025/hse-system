<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
// import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import ItemParams from '../../Core/params/ItemParams'

import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type ServiceLogDetailsModel from '../../Data/models/ServiceDetailsLogModel'
import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import EditServiceLogParams from '../../Core/params/editServiceLogParams'
import AddServiceLogParams from '../../Core/params/addServiceLogParams'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ServiceLogDetailsModel
  serviceId: number
}>()

const indexServiceController = IndexServiceController.getInstance()
const indexServiceParams = new IndexServiceParams('', 1, 10, 1)

const langsTitle = ref<{ locale: string; title: string }[]>([])
const langsSubTitle = ref<{ locale: string; title: string }[]>([])
const langsDescription = ref<{ locale: string; title: string }[]>([])

const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// Items array
interface Item {
  translations: {
    title: Record<string, string>
    subtitle: Record<string, string>
  }
  alt: string
  image: string | File
}
const items = ref<Item[]>([])

const user = useUserStore()

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
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
  const indexPartnerController = await IndexLangController.getInstance().getData(params)

  const response = indexPartnerController.value

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

const updateData = () => {
  const mainTranslations = new TranslationsParams()

  langsTitle.value.forEach((lang) => {
    mainTranslations.setTranslation('title', lang.locale, lang.title)
  })

  const params = props?.data?.id
    ? new EditServiceLogParams(props?.data?.id, mainTranslations, SelectedService.value?.id)
    : new AddServiceLogParams(mainTranslations, SelectedService.value?.id)

  emit('update:data', params)
}

// Helper functions
const setLangsTitle = (data: { locale: string; title: string }[]) => {
  langsTitle.value = data
  updateData()
}

const SelectedService = ref<TitleInterface | null>(null)
const setServiceSelection = (data: TitleInterface) => {
  SelectedService.value = data
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newData || !newDefault.length) return

    // Map titles
    langsTitle.value = newDefault.map((lang) => {
      const translation = newData.title?.find((t: any) => t.locale === lang.locale)
      return {
        locale: lang.locale,
        title: translation?.title || '',
      }
    })

    SelectedService.value = newData?.service

    updateData()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsTitle"
      :label="$t('title')"
      @update:modelValue="setLangsTitle"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="SelectedService"
      :controller="indexServiceController"
      :params="indexServiceParams"
      label="Service"
      id="Service"
      placeholder="Select Service"
      @update:modelValue="setServiceSelection"
    />
  </div>
</template>
