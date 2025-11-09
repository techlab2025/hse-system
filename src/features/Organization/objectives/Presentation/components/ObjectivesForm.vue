<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { useRoute } from 'vue-router'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { useUserStore } from '@/stores/user'
import type ObjectivesModel from '../../Data/models/objectivesModel'
import IndexObjectivesController from '../controllers/indexObjectivesController'
import IndexObjectivesParams from '../../Core/params/indexObjectivesParams'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import AddObjectivesParams from '../../Core/params/addObjectivesParams'
import editObjectivesParams from '../../Core/params/editObjectivesParams'
import type ObjectivesDetailsModel from '../../Data/models/objectivesDetailsModel'

const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: ObjectivesDetailsModel }>()

const route = useRoute()
const id = Number(route.params.id)

const indexObjectivesTypeController = IndexObjectivesController.getInstance()
const indexObjectivesTypeParams = new IndexObjectivesParams('', 1, 10, 1)
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const industry = ref<TitleInterface[]>([])
const Objectives = ref<TitleInterface | null>(null)
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
    ? new AddObjectivesParams(translationsParams)
    : new editObjectivesParams(props.data.id ?? 0, translationsParams)

  emit('update:data', params)
}

const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  updateData()
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

const setObjectivesType = (data: TitleInterface) => {
  Objectives.value = data
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
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>
</template>
