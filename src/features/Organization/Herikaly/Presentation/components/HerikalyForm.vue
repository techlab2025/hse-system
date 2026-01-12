<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import type HerikalyDetailsModel from '../../Data/models/HerikalyDetailsModel'
import EditHerikalyParams from '../../Core/params/editHerikalyParams'
import AddHerikalyParams from '../../Core/params/addHerikalyParams'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import IndexCertificateController from '@/features/setting/Certificate/Presentation/controllers/indexCertificateController'
import IndexCertificateParams from '@/features/setting/Certificate/Core/params/indexCertificateParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: HerikalyDetailsModel
}>()

const indexCertificateController = IndexCertificateController.getInstance()
const indexCertificateParams = new IndexCertificateParams('', 1, 10, 1)

const route = useRoute()
const ParentId = route.params.parent_id
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])
const user = useUserStore()

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  console.log(user.user, 'user')
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
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditHerikalyParams(props?.data?.id, translationsParams, ParentId)
    : new AddHerikalyParams(translationsParams, ParentId)

  emit('update:data', params)
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }
    }
  },
  { immediate: true },
)
// const Certificate = ref<TitleInterface[]>([]);
// const setCertificate = (data: TitleInterface[]) => {
//   Certificate.value = data;
//   updateData()
// }
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langs"
      :label="$t('title')"
      @update:modelValue="setLangs"
    />
  </div>
  <!-- <div class="input-wrapper col-span-4 md:col-span-2">
    <CustomSelectInput :modelValue="Certificate" :controller="indexCertificateController"
      :params="indexCertificateParams" label="Certificate" id="Certificate" placeholder="Select certificate" :type="2"
      @update:modelValue="setCertificate" />
  </div> -->
</template>
