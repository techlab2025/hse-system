MangementChangeTopicType<script lang="ts" setup>
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
import type PpeItemDetailsModel from '../../Data/models/MangementChangeTopicTypeDetailsModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import { MangementChangeTopicTypeEnum } from '../../Core/Core/MangementChangeTopicTypeEnum'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddMangementChangeTopicTypeClonesParams from '../../Core/params/AddMangementChangeTopicTypeParams'
import EditMangementChangeTopicTypeParams from '../../Core/params/editMangementChangeTopicTypeParams'
import AddMangementChangeTopicTypeParams from '../../Core/params/addMangementChangeTopicTypeParams'

type LanguageOption = { locale: string; title: string; icon?: any }
type LocalizedTitle = { locale: string; title: string }

const emit = defineEmits<{
  (event: 'update:data', value: AddMangementChangeTopicTypeClonesParams | EditMangementChangeTopicTypeParams): void
}>()
const props = defineProps<{ data?: PpeItemDetailsModel }>()

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

const updateData = () => {
  const translations = new TranslationsParams(
    languages.value.map((item) => item.locale),
  )

  titles.value.forEach((item) => {
    translations.setTranslation('title', item.locale, item.title)
  })

  const status = mangementChangeTopicType.value.id as MangementChangeTopicTypeEnum

  emit(
    'update:data',
    props.data?.id
      ? new EditMangementChangeTopicTypeParams(
          props.data.id,
          translations,
          status,
        )
      : new AddMangementChangeTopicTypeParams(
          translations,
          status,
        ),
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

    mangementChangeTopicType.value =
      mangementChangeTopicTypes.value.find(
        (type) => type.id === data?.status,
      ) ?? mangementChangeTopicTypes.value[0]

    updateData()
  },
  { immediate: true },
)

const hasText = (value: unknown) => String(value ?? '').trim().length > 0
const requiredFields = computed(() => [
  {
    key: 'title',
    message: 'PPE Item Title Is Required',
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
const updateMangementChangeTopicType = (data: TitleInterface) => {
  mangementChangeTopicType.value = data
  console.log(mangementChangeTopicType.value, 'mangementChangeTopicType')
  updateData()
}
const mangementChangeTopicTypes = ref<TitleInterface[]>([
  new TitleInterface({
    id: MangementChangeTopicTypeEnum.employee,
    title: 'employee',
  }),
  new TitleInterface({
    id: MangementChangeTopicTypeEnum.equipment,
    title: 'equipment',
  }),
  new TitleInterface({
    id: MangementChangeTopicTypeEnum.other,
    title: 'other',
  }),
])
const mangementChangeTopicType = ref<TitleInterface>(
  mangementChangeTopicTypes.value[0],
)
</script>

<template>
  <div class="col-span-4 md:col-span-2" data-required-field="title">
    <LangTitleInput
      :langs="languages"
      :model-value="titles"
      :label="$t('Management Change Topic Type Title')"
      :placeholder="$t('enter management change topic type title')"
      @update:model-value="setTitles"
    />
    <p v-if="requiredFieldErrors.title" class="required-field-message">
      {{ requiredFieldErrors.title }}
    </p>
  </div>
    <div class="col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="mangementChangeTopicType"
      :static-options="mangementChangeTopicTypes"
      :label="$t('management_change_topic_type')"
      id="management_change_topic_type"
      :placeholder="$t('select_management_change_topic_type')"
      @update:modelValue="updateMangementChangeTopicType"
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
