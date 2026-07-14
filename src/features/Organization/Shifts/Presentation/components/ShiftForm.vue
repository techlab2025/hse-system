<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import DatePicker from 'primevue/datepicker'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useUserStore } from '@/stores/user'
import type ShiftDetailsModel from '../../Data/models/ShiftDetailsModel'
import EditShiftParams from '../../Core/params/EditShiftParams'
import AddShiftParams from '../../Core/params/AddShiftParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShiftDetailsModel
}>()
type InpuLangModel = {
  locale: string
  title?: string
}

const langs = ref<InpuLangModel[]>([])
const startTime = ref('')
const endTime = ref('')

const toTimeDate = (value: string) => {
  if (!value) return null

  const [hours, minutes] = value.split(':').map(Number)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

const toTimeString = (value: Date | null) => {
  if (!value) return ''

  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
}

const startTimeValue = computed<Date | null>({
  get: () => toTimeDate(startTime.value),
  set: (value) => {
    startTime.value = toTimeString(value)
    updateData()
  },
})

const endTimeValue = computed<Date | null>({
  get: () => toTimeDate(endTime.value),
  set: (value) => {
    endTime.value = toTimeString(value)
    updateData()
  },
})

const SystemLanguages = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages.length) {
    SystemLanguages.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLanguageController = await IndexLangController.getInstance().getData(params)
  const response = indexLanguageController.value

  if (response?.data?.length) {
    SystemLanguages.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    SystemLanguages.value = [
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
    translationsParams.setTranslation('title', lang.locale, lang.title ?? '')
  })

  const params = props.data?.id
    ? new EditShiftParams(props.data.id, translationsParams, startTime.value, endTime.value)
    : new AddShiftParams(translationsParams, startTime.value, endTime.value)

  emit('update:data', params)
}
watch(
  [() => props.data, () => SystemLanguages.value],
  ([newData, newSystemLangauges]) => {
    if (newSystemLangauges.length) {
      startTime.value = newData?.startTime || ''
      endTime.value = newData?.endTime || ''

      if (newData?.titles?.length) {
        langs.value = newSystemLangauges.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newSystemLangauges.map((l) => ({ locale: l.locale, title: '' }))
      }
      updateData()
    }
  },
  { immediate: true },
)

watch(
  langs,
  () => {
    updateData()
  },
  { deep: true },
)

const GetTitle = (title: InpuLangModel[]) => {
  langs.value = title
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :langs="SystemLanguages"
      :modelValue="langs"
      @update:modelValue="GetTitle"
      :required="true"
    />
  </div>
  <div class="col-span-4 md:col-span-1 input-wrapper">
    <label for="start_time">{{ $t('start_time') }}</label>
    <DatePicker
      v-model="startTimeValue"
      input-id="start_time"
      time-only
      hour-format="24"
      :placeholder="$t('Select time')"
      class="input"
      required
    />
  </div>
  <div class="col-span-4 md:col-span-1 input-wrapper">
    <label for="end_time">{{ $t('end_time') }}</label>
    <DatePicker
      v-model="endTimeValue"
      input-id="end_time"
      time-only
      hour-format="24"
      :placeholder="$t('Select time')"
      class="input"
      required
    />
  </div>
</template>
