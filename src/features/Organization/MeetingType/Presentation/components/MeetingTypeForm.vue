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
import AddMeetingTypeParams from '../../Core/params/addMeetingTypeParams'
import EditMeetingTypeParams from '../../Core/params/editMeetingTypeParams'
import type MeetingTypeDetailsModel from '../../Data/models/MeetingTypeDetailsModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { MeetingTypePeriodicEnum } from '../../Core/constant/MeetingTypesEnum'
// import type PpeItemDetailsModel from '../../Data/models/PpeItemDetailsModel'

type LanguageOption = { locale: string; title: string; icon?: any }
type LocalizedTitle = { locale: string; title: string }

const emit = defineEmits<{
  (event: 'update:data', value: AddMeetingTypeParams | EditMeetingTypeParams): void
}>()
const props = defineProps<{ data?: MeetingTypeDetailsModel }>()

const user = useUserStore()
const languages = ref<LanguageOption[]>([])
const titles = ref<LocalizedTitle[]>([])

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

const NumberOfDays = ref<number>()
const SelectedType = ref<TitleInterface>(
  new TitleInterface({ id: MeetingTypePeriodicEnum.Daily, title: 'daily' }),
)

const updateData = () => {
  const translations = new TranslationsParams(languages.value.map((item) => item.locale))
  titles.value.forEach((item) => translations.setTranslation('title', item.locale, item.title))

  emit(
    'update:data',
    props.data?.id
      ? new EditMeetingTypeParams({
          id: props.data.id,
          translation: translations,
          type: SelectedType.value?.id!,
          number_of_days: NumberOfDays.value!,
        })
      : new AddMeetingTypeParams({
          translation: translations,
          type: SelectedType.value?.id!,
          number_of_days: NumberOfDays.value!,
        }),
  )
  console.log(
    'data=>',
    new AddMeetingTypeParams({
      translation: translations,
      type: SelectedType.value?.id!,
      number_of_days: NumberOfDays.value!,
    }),
  )
}

const setTitles = (value: any[]) => {
  titles.value = value.map((item) => ({ locale: item.locale, title: item.title ?? '' }))
  updateData()
}

watch(
  [() => props.data, languages],
  ([data, availableLanguages]) => {
    if (!availableLanguages.length) return

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
    message: 'Meeting Type Title Is Required',
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

const MeetingTYpesOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: MeetingTypePeriodicEnum.Daily, title: 'daily' }),
  new TitleInterface({ id: MeetingTypePeriodicEnum.Weekly, title: 'Weekly' }),
  new TitleInterface({ id: MeetingTypePeriodicEnum.Monthly, title: 'Monthly' }),
  new TitleInterface({ id: MeetingTypePeriodicEnum.yearly, title: 'yearly' }),
  new TitleInterface({ id: MeetingTypePeriodicEnum.dates, title: 'dates' }),
])
const updateDays = (data) => {
  // NumberOfDays.value = data
  console.log(NumberOfDays.value, 'NumberOfDays.value')
  updateData()
}
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
  <div class="col-span-4 md:col-span-2">
    <UpdatedCustomInputSelect
      id="meeting type"
      v-model="SelectedType"
      :label="$t('Periodic Type')"
      :placeholder="$t('Select Periodic Type')"
      :static-options="MeetingTYpesOptions"
      required
    />
  </div>
  <div
    class="col-span-4 md:col-span-2 input-wrapper"
    v-if="SelectedType?.id != MeetingTypePeriodicEnum.Daily"
  >
    <label for="number-of-days">number of days</label>
    <input
      id="number-of-days"
      class="input"
      type="number"
      v-model="NumberOfDays"
      @input="updateDays"
      placeholder="enter dayes number"
    />
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
