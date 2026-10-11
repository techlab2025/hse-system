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
import AddMeetingTypeParams from '../../Core/params/addMeetingTypeParams'
import EditMeetingTypeParams from '../../Core/params/editMeetingTypeParams'
import type MeetingTypeDetailsModel from '../../Data/models/MeetingTypeDetailsModel'
import {
  PeriodicTypeEnum,
  PeriodicTypeOptions,
  getPeriodicTypeMaxDays,
} from '../../Core/Enum/periodic_type_enum'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

type LanguageOption = { locale: string; title: string; icon?: Component | string }
type LocalizedTitle = { locale: string; title: string }
type LocalizedDescription = { locale: string; description: string }

const emit = defineEmits<{
  (event: 'update:data', value: AddMeetingTypeParams | EditMeetingTypeParams): void
}>()
const props = defineProps<{ data?: MeetingTypeDetailsModel }>()

const user = useUserStore()
const languages = ref<LanguageOption[]>([])
const titles = ref<LocalizedTitle[]>([])
const descriptions = ref<LocalizedDescription[]>([])
const periodicType = ref<TitleInterface>(
  new TitleInterface({ id: PeriodicTypeEnum.DAILY, title: 'daily' }),
)
const numberOfDays = ref<number | null>(null)
const allIndustries = ref(false)
const industry = ref<TitleInterface[]>([])
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const showNumberOfDays = computed(() => periodicType.value.id !== PeriodicTypeEnum.DAILY)
const maxNumberOfDays = computed(() => getPeriodicTypeMaxDays(periodicType.value.id))

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
  descriptions.value.forEach((item) =>
    translations.setTranslation('description', item.locale, item.description),
  )

  const normalizedNumberOfDays =
    periodicType.value.id === PeriodicTypeEnum.DAILY ? null : numberOfDays.value
  const adminScope = user.user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null
  const industryIds = industry.value.map((item) => item.id)

  emit(
    'update:data',
    props.data?.id
      ? new EditMeetingTypeParams(
          props.data.id,
          translations,
          periodicType.value.id,
          normalizedNumberOfDays,
          adminScope,
          industryIds,
        )
      : new AddMeetingTypeParams(
          translations,
          periodicType.value.id,
          normalizedNumberOfDays,
          adminScope,
          industryIds,
        ),
  )
}

const setTitles = (value: { locale: string; title?: string }[]) => {
  titles.value = value.map((item) => ({ locale: item.locale, title: item.title ?? '' }))
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

const onPeriodicTypeChange = (data: TitleInterface) => {
  if (periodicType.value.id === PeriodicTypeEnum.DAILY) {
    numberOfDays.value = null
  }
  periodicType.value = data
  updateData()
}

watch(
  [() => props.data, languages],
  ([data, availableLanguages]) => {
    allIndustries.value = data?.allIndustries ?? false
    industry.value = data?.industries ?? []
    if (!availableLanguages.length) return

    titles.value = availableLanguages.map(
      (language) =>
        data?.titles?.find((item) => item.locale === language.locale) ?? {
          locale: language.locale,
          title: '',
        },
    )

    periodicType.value.id = data?.periodicType ?? PeriodicTypeEnum.DAILY
    numberOfDays.value = data?.numberOfDays ?? null
    updateData()
  },
  { immediate: true },
)

const hasText = (value: unknown) => String(value ?? '').trim().length > 0
const getNumberOfDaysError = () => {
  if (!showNumberOfDays.value) return ''

  const value = Number(numberOfDays.value)
  if (!Number.isInteger(value) || value <= 0) {
    return 'Number Of Days Must Be A Positive Integer'
  }

  const max = maxNumberOfDays.value
  if (max !== null && value > max) {
    if (periodicType.value.id === PeriodicTypeEnum.WEEKLY) {
      return 'Weekly Number Of Days Must Be Less Than 7'
    }
    if (periodicType.value.id === PeriodicTypeEnum.MONTHLY) {
      return 'Monthly Number Of Days Must Be Less Than 30'
    }
    if (periodicType.value.id === PeriodicTypeEnum.YEARLY) {
      return 'Yearly Number Of Days Must Be Less Than 365'
    }
  }

  return ''
}

const requiredFields = computed(() => [
  {
    key: 'title',
    message: 'Meeting Type Title Is Required',
    isMissing: () => !titles.value.some((item) => hasText(item.title)),
  },

  {
    key: 'periodic_type',
    message: 'Periodic Type Is Required',
    isMissing: () => !Object.values(PeriodicTypeEnum).includes(periodicType.value.id),
  },
  {
    key: 'number_of_days',
    message: getNumberOfDaysError(),
    isMissing: () => Boolean(getNumberOfDaysError()),
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
      :label="$t('meeting_type_title')"
      :placeholder="$t('enter_meeting_type_title')"
      @update:model-value="setTitles"
    />
    <p v-if="requiredFieldErrors.title" class="required-field-message">
      {{ requiredFieldErrors.title }}
    </p>
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper" data-required-field="periodic_type">
    <UpdatedCustomInputSelect
      :required="true"
      :modelValue="periodicType"
      class="input"
      :static-options="PeriodicTypeOptions"
      :label="$t('periodic_type')"
      id="project-meetign type"
      :placeholder="$t('select type')"
      @update:modelValue="onPeriodicTypeChange"
    />

    <p v-if="requiredFieldErrors.periodic_type" class="required-field-message">
      {{ requiredFieldErrors.periodic_type }}
    </p>
  </div>

  <div
    v-if="showNumberOfDays"
    class="col-span-4 md:col-span-2 input-wrapper"
    data-required-field="number_of_days"
  >
    <label class="input-label">{{ $t('number_of_days') }}</label>
    <input
      v-model.number="numberOfDays"
      class="input w-full"
      type="number"
      min="1"
      :max="maxNumberOfDays ?? undefined"
      :placeholder="$t('enter_number_of_days')"
      @input="updateData"
    />
    <p v-if="requiredFieldErrors.number_of_days" class="required-field-message">
      {{ requiredFieldErrors.number_of_days }}
    </p>
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
      id="meetingtype-industry"
      placeholder="Select industry"
      :type="2"
      @update:model-value="setIndustry"
    />
  </div>
</template>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-strong);
  font-size: 0.9rem;
  font-weight: 600;
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
