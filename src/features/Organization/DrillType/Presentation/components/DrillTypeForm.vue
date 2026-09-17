<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddDrillTypeParams from '../../Core/params/addDrillTypeParams'
import EditDrillTypeParams from '../../Core/params/editDrillTypeParams'
import type DrillTypeDetailsModel from '../../Data/models/DrillTypeDetailsModel'

type LanguageOption = { locale: string; title: string; icon?: any }
type LocalizedTitle = { locale: string; title: string }
type LocalizedDescription = { locale: string; description: string }

const emit = defineEmits<{
  (event: 'update:data', value: AddDrillTypeParams | EditDrillTypeParams): void
}>()
const props = defineProps<{ data?: DrillTypeDetailsModel }>()

const user = useUserStore()
const languages = ref<LanguageOption[]>([])
const titles = ref<LocalizedTitle[]>([])
const descriptions = ref<LocalizedDescription[]>([])

const fetchLanguages = async () => {
  if (user.user?.languages?.length) {
    languages.value = user.user.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }

  const response = await IndexLangController.getInstance().getData(
    new IndexLangParams('', 1, 10, 0),
  )
  languages.value = response.value?.data?.length
    ? response.value.data.map((item: any) => ({
        locale: item.code,
        title: '',
        icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
      }))
    : [
        { locale: 'en', title: '', icon: USA },
        { locale: 'ar', title: '', icon: SA },
      ]
}

const updateData = () => {
  const translations = new TranslationsParams(languages.value.map((item) => item.locale))
  titles.value.forEach((item) => translations.setTranslation('title', item.locale, item.title))
  descriptions.value.forEach((item) =>
    translations.setTranslation('description', item.locale, item.description),
  )

  emit(
    'update:data',
    props.data?.id
      ? new EditDrillTypeParams(props.data.id, translations)
      : new AddDrillTypeParams(translations),
  )
}

const setTitles = (value: any[]) => {
  titles.value = value.map((item) => ({ locale: item.locale, title: item.title ?? '' }))
  updateData()
}

const setDescriptions = (value: any[]) => {
  descriptions.value = value.map((item) => ({
    locale: item.locale,
    description: item.description ?? '',
  }))
  updateData()
}

watch(
  [() => props.data, languages],
  ([data, availableLanguages]) => {
    if (!availableLanguages.length) return

    titles.value = availableLanguages.map((language) =>
      data?.titles?.find((item) => item.locale === language.locale) ?? {
        locale: language.locale,
        title: '',
      },
    )
    descriptions.value = availableLanguages.map((language) =>
      data?.descriptions?.find((item) => item.locale === language.locale) ?? {
        locale: language.locale,
        description: '',
      },
    )
    updateData()
  },
  { immediate: true },
)

const hasText = (value: unknown) => String(value ?? '').trim().length > 0
const requiredFields = computed(() => [
  {
    key: 'title',
    message: 'Drill Type Title Is Required',
    isMissing: () => !titles.value.some((item) => hasText(item.title)),
  },
  {
    key: 'description',
    message: 'Drill Type Description Is Required',
    isMissing: () => !descriptions.value.some((item) => hasText(item.description)),
  },
])
const requiredFieldErrors = ref<Record<string, string>>({})

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = Object.fromEntries(
    missedFields.map((field) => [field.key, field.message]),
  )
  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await nextTick()
  document
    .querySelector<HTMLElement>(`[data-required-field="${missedFields[0].key}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return false
}

defineExpose({ validateRequiredFields })
onMounted(fetchLanguages)
</script>

<template>
  <div class="col-span-4 md:col-span-2" data-required-field="title">
    <LangTitleInput
      :langs="languages"
      :model-value="titles"
      :label="$t('drill_type_title')"
      :placeholder="$t('enter_drill_type_title')"
      @update:model-value="setTitles"
    />
    <p v-if="requiredFieldErrors.title" class="required-field-message">
      {{ requiredFieldErrors.title }}
    </p>
  </div>

  <div class="col-span-4 md:col-span-2" data-required-field="description">
    <LangTitleInput
      :langs="languages"
      :model-value="descriptions"
      field-type="description"
      type="textarea"
      :label="$t('drill_type_description')"
      :placeholder="$t('enter_drill_type_description')"
      @update:model-value="setDescriptions"
    />
    <p v-if="requiredFieldErrors.description" class="required-field-message">
      {{ requiredFieldErrors.description }}
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
