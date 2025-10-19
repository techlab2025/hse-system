<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
// import TitleInterface from '@/base/Data/Models/title_interface'

// import { ClientOpinionsMap } from '@/constant/ClientOpinions'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import DatePicker from 'primevue/datepicker'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
// import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
// import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
// import { useRoute } from 'vue-router'
import type ClientOpinionDetailsModel from '../../Data/models/ClientOpinionDetailsModel'
import EditClientOpinionParams from '../../Core/params/editClientOpinionParams'
import AddClientOpinionParams from '../../Core/params/addClientOpinionParams'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ClientOpinionDetailsModel
}>()

// const route = useRoute()

const name = ref<string>('')
const rate = ref<number>(0)
const date = ref<string>('')
const alt = ref<string>('')

// actual translations (values)
const langs = ref<{ locale: string; title: string }[]>([
  {
    locale: 'en',
    icon: USA,
    title: '',
  },
  {
    locale: 'ar',
    icon: SA,
    title: '',
  },
])

// const allIndustries = ref<boolean>(false)
// const hasCertificate = ref<number>(0)
const image = ref<string>('')

// default available ClientOpinions
const langDefault = ref<{ locale: string; icon?: string; description: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexClientOpinionController = await IndexLangController.getInstance().getData(params)

  const response = indexClientOpinionController.value

  if (response?.data?.length) {
    // map backend ClientOpinions into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      description: '', // empty initially
      // if you already have icons mapped, use ClientOpinionsMap
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      {
        locale: 'en',
        icon: USA,
        description: '',
      },
      {
        locale: 'ar',
        icon: SA,
        description: '',
      },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.description)
  })

  const params = props.data?.id
    ? new EditClientOpinionParams(
        props.data?.id! ?? 0,
        translationsParams,
        name.value,
        rate.value,
        formatJoinDate(date.value),
        alt.value,
        image.value,
      )
    : new AddClientOpinionParams(
        translationsParams,
        name.value,
        rate.value,
        formatJoinDate(date.value),
        alt.value,
        image.value,
      )

  // console.log(params, 'params')
  emit('update:data', params)
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}

// init ClientOpinions either from backend (edit mode) or from defaults (create mode)
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      if (newData?.descriptions?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      // langs.value = newData?.titles
      name.value = newData?.name ?? ''
      rate.value = newData?.rate ?? 0
      date.value = newData?.date ?? ''
      alt.value = newData?.alt ?? ''
      image.value = newData?.image ?? ''
      // hasCertificate.value = newData?.hasCertificate ?? 0
    }
  },
  { immediate: true },
)

const setImage = async (data: File | string) => {
  // image.value = await filesToBase64(data)
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="name">
      {{ $t('name') }}
    </label>
    <input
      id="name"
      v-model="name"
      type="text"
      class="input"
      placeholder="name"
      required
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="date">
      {{ $t('date') }}
    </label>
    <DatePicker v-model="date" id="date" />
  </div>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput
      type="textarea"
      :langs="langDefault"
      :modelValue="langs"
      :label="$t('description')"
      @update:modelValue="setLangs"
      field-type="description"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="rate">
      {{ $t('rate') }}
    </label>
    <input
      id="rate"
      v-model="rate"
      type="number"
      required
      min="0"
      max="5"
      class="input"
      placeholder="rate"
      @input="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="alt">
      {{ $t('alt_image') }}
    </label>
    <input
      id="rate"
      v-model="alt"
      type="text"
      class="input"
      placeholder="alt"
      @input="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-4">
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
      :isCrop="true"
      :aspectRatio="1 / 1"
    />
  </div>
</template>
