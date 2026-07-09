<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AddScopeParams from '../../Core/params/addScopeParams'
import EditScopeParams from '../../Core/params/editScopeParams'
import type ScopeDetailsModel from '../../Data/models/ScopeDetailsModel'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import { LangsMap } from '@/constant/langs.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import { useUserStore } from '@/stores/user'
import TranslationsParams from '@/base/core/params/translations_params'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const route = useRoute()
const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: ScopeDetailsModel
}>()

const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])
const id = route.params.parent_id

const langDefault = ref<
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

onMounted(() => {
  fetchLang()
})
const updateData = () => {
  const translationsParams = new TranslationsParams()

  // titles
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })
  const params = props.data?.id
    ? new EditScopeParams(props.data.id, translationsParams)
    : new AddScopeParams(translationsParams)

  console.log(params, 'params')
  emit('update:data', params)
}
const scope = ref<string>(props?.data?.title || '')

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      // titles
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
  { immediate: true },
)
onMounted(() => {
  scope.value = props?.data?.title || ''
})
watch(
  langs,
  () => {
    updateData()
  },
  { deep: true },
)

const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}

const SerialNumber = ref()

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0
const hasLangValue = () => langs.value.some((lang) => hasValue(lang.title))

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'langs',
    message: 'Name Is Required',
    isMissing: () => !hasLangValue(),
  },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((errors, field) => {
    errors[field.key] = field.message
    return errors
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})
</script>

<template>
  <div class="col-span-4 md:col-span-2" data-required-field="langs">
    <LangTitleInput
      :langs="langDefault"
      :modelValue="langs"
      @update:modelValue="(val) => (langs = val)"
    />
    <p v-if="getFieldError('langs')" class="required-field-message">
      {{ getFieldError('langs') }}
    </p>
  </div>
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
