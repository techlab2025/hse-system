<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import { LangsMap } from '@/constant/langs.ts'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import { useUserStore } from '@/stores/user'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexAccidentsTypeParams from '@/features/setting/AccidentsTypes/Core/params/indexAccidentsTypeParams'
import IndexAccidentsTypeController from '@/features/setting/AccidentsTypes/Presentation/controllers/indexAccidentsTypeController'
import AddIncidentCategoryParams from '../../Core/params/addIncidentCategoryParams'
import EditIncidentCategoryParams from '../../Core/params/editIncidentCategoryParams'
import type IncidentCategoryDetailsModel from '../../Data/models/IncidentCategoryDetailsModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: IncidentCategoryDetailsModel }>()

const user = useUserStore()
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const incidentType = ref<TitleInterface | null>(null)
const incidentTypeController = IndexAccidentsTypeController.getInstance()
const incidentTypeParams = new IndexAccidentsTypeParams('', 1, 10, 0)

const fetchLanguages = async () => {
  if (user.user?.languages?.length) {
    langDefault.value = user.user.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }

  const response = await IndexLangController.getInstance().getData(
    new IndexLangParams('', 1, 10, 0),
  )
  langDefault.value = response.value?.data?.length
    ? response.value.data.map((item: any) => ({
        locale: item.code,
        title: '',
        icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
      }))
    : [
        { locale: 'en', icon: USA, title: '' },
        { locale: 'ar', icon: SA, title: '' },
      ]
}

const updateData = () => {
  const translations = new TranslationsParams()
  langs.value.forEach((lang) => translations.setTranslation('title', lang.locale, lang.title))

  emit(
    'update:data',
    props.data?.id
      ? new EditIncidentCategoryParams(props.data.id, translations, incidentType.value?.id ?? 0)
      : new AddIncidentCategoryParams(translations, incidentType.value?.id ?? 0),
  )
}

const setLangs = (value: { locale: string; title: string }[]) => {
  langs.value = value
  updateData()
}

const setIncidentType = (value: TitleInterface | null) => {
  incidentType.value = value
  if (value?.id) {
    const { incidentTypeId: _removed, ...rest } = requiredFieldErrors.value
    requiredFieldErrors.value = rest
  }
  updateData()
}

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'incidentTypeId',
    message: 'Incident Type Is Required',
    isMissing: () => !Number(incidentType.value?.id),
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

watch(
  [() => props.data, langDefault],
  ([data, defaults]) => {
    if (!defaults.length) return
    langs.value = defaults.map((lang) => {
      const existing = data?.titles?.find((title) => title.locale === lang.locale)
      return existing ?? { locale: lang.locale, title: '' }
    })
    incidentType.value = data?.incidentType ?? null
    updateData()
  },
  { immediate: true },
)

onMounted(fetchLanguages)
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>

  <div
    class="col-span-4 md:col-span-2 input-wrapper field-required"
    data-required-field="incidentTypeId"
  >
    <UpdatedCustomInputSelect
      :modelValue="incidentType"
      :controller="incidentTypeController"
      :params="incidentTypeParams"
      :label="$t('incident Type')"
      :placeholder="$t('Select Incident Type')"
      id="incident_type_id"
      :required="true"
      @update:modelValue="setIncidentType"
    />
    <p v-if="getFieldError('incidentTypeId')" class="required-field-message">
      {{ getFieldError('incidentTypeId') }}
    </p>
  </div>
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
