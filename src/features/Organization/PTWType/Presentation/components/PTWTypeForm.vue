<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch, type Component } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import AddPTWTypeParams from '../../Core/params/addPTWTypeParams'
import EditPTWTypeParams from '../../Core/params/editPTWTypeParams'
import type PTWTypeDetailsModel from '../../Data/models/PTWTypeDetailsModel'

type LanguageOption = { locale: string; title: string; icon?: Component | string }
type LocalizedTitle = { locale: string; title: string }

const emit = defineEmits<{
  (event: 'update:data', value: AddPTWTypeParams | EditPTWTypeParams): void
}>()
const props = defineProps<{ data?: PTWTypeDetailsModel }>()

const user = useUserStore()
const languages = ref<LanguageOption[]>([])
const titles = ref<LocalizedTitle[]>([])
const ptwColor = ref('#ff0000')
const allIndustries = ref(false)
const industry = ref<TitleInterface[]>([])
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const fetchLanguages = async () => {
  if (user.user?.languages?.length) {
    languages.value = user.user.languages.map((item: { code: string }) => ({
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
    ? response.value.data.map((item: { code: string }) => ({
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
  const adminScope = user.user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null
  const industryIds = industry.value.map((item) => item.id)

  emit(
    'update:data',
    props.data?.id
      ? new EditPTWTypeParams(props.data.id, translations, ptwColor.value, adminScope, industryIds)
      : new AddPTWTypeParams(translations, ptwColor.value, adminScope, industryIds),
  )
}

const setTitles = (value: { locale: string; title?: string }[]) => {
  titles.value = value.map((item) => ({ locale: item.locale, title: item.title ?? '' }))
  updateData()
}

const setPtwColor = (event: Event) => {
  ptwColor.value = (event.target as HTMLInputElement).value
  updateData()
}

const updateAllIndustries = (value: boolean) => {
  allIndustries.value = value
  updateData()
}

const setIndustry = (value: TitleInterface[]) => {
  industry.value = value
  updateData()
}

watch(
  [() => props.data, languages],
  ([data, availableLanguages]) => {
    allIndustries.value = data?.allIndustries ?? false
    industry.value = data?.industries ?? []
    if (!availableLanguages.length) return

    ptwColor.value = data?.ptw_color ?? data?.color ?? '#ff0000'

    titles.value = availableLanguages.map(
      (language) =>
        data?.titles?.find((item) => item.locale === language.locale) ?? {
          locale: language.locale,
          title: '',
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
    message: 'Permit To Work Type Title Is Required',
    isMissing: () => !titles.value.some((item) => hasText(item.title)),
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
      :label="$t('ptw_type_title')"
      :placeholder="$t('enter_ptw_type_title')"
      @update:model-value="setTitles"
    />
    <p v-if="requiredFieldErrors.title" class="required-field-message">
      {{ requiredFieldErrors.title }}
    </p>
  </div>
  <div class="col-span-4 md:col-span-2 ptw-color-field">
    <label class="ptw-color-field__label" for="ptw_color">
      {{ $t('main_color') }}
    </label>

    <div class="ptw-color-field__control">
      <input
        id="ptw_color"
        class="ptw-color-field__picker"
        name="ptw_color"
        type="color"
        :value="ptwColor"
        :aria-label="$t('main_color')"
        @input="setPtwColor"
      />
      <output class="ptw-color-field__value" for="ptw_color">
        {{ ptwColor.toUpperCase() }}
      </output>
    </div>
  </div>
  <div
    v-if="user.user?.type === OrganizationTypeEnum.ADMIN"
    class="input-wrapper col-span-4 md:col-span-2"
  >
    <CustomCheckbox
      :index="3"
      title="all_industries"
      :checked="allIndustries"
      @update:checked="updateAllIndustries"
    />
  </div>
  <div
    v-if="!allIndustries && user.user?.type === OrganizationTypeEnum.ADMIN"
    class="col-span-4 md:col-span-2"
  >
    <CustomSelectInput
      :model-value="industry"
      :controller="industryController"
      :params="industryParams"
      label="industry"
      id="ptwtype-industry"
      placeholder="Select industry"
      :type="2"
      @update:model-value="setIndustry"
    />
  </div>
</template>

<style scoped>
.ptw-color-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ptw-color-field__label {
  color: var(--GrayText-1);
  font-size: 0.875rem;
  font-weight: 600;
}

.ptw-color-field__control {
  display: flex;
  min-height: 48px;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--main-border);
  border-radius: 0.5rem;
  background: var(--BgWhite);
}

.ptw-color-field__picker {
  width: 42px;
  height: 34px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  cursor: pointer;
}

.ptw-color-field__picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.ptw-color-field__picker::-webkit-color-swatch,
.ptw-color-field__picker::-moz-color-swatch {
  border: 0;
  border-radius: 0.375rem;
}

.ptw-color-field__picker:focus-visible {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 2px;
}

.ptw-color-field__value {
  color: var(--GrayText-1);
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
