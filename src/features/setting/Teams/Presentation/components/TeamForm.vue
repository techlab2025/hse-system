<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type TeamDetailsModel from '../../Data/models/TeamDetailsModel'
import editTeamParams from '../../Core/params/editTeamParams'
import AddTeamParams from '../../Core/params/addTeamParams'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: TeamDetailsModel
}>()

// const route = useRoute()

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

const allIndustries = ref<boolean>(false)
// const hasCertificate = ref<number>(0)
// const image = ref<string>('')

// industry
const industry = ref<TitleInterface[]>([])
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available Teamss
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])
const user = useUserStore()
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexTeamsController = await IndexLangController.getInstance().getData(params)

  const response = indexTeamsController.value

  if (response?.data?.length) {
    // map backend Teamss into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use TeamssMap
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
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

  console.log(allIndustries.value, 'industry')
  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new editTeamParams(
        props.data?.id! ?? 0,
        translationsParams,
        AllIndustry,
        industry.value?.map((item) => item.id) ?? [],
      )
    : new AddTeamParams(
        translationsParams,
        AllIndustry,
        industry.value?.map((item) => item.id),
        // SerialNumber.value?.SerialNumber,
        // id,
      )

  // console.log(params, 'params')
  emit('update:data', params)
}

const setIndustry = (data: TitleInterface[]) => {
  // console.log(data, 'data')
  industry.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}

// init Teamss either from backend (edit mode) or from defaults (create mode)
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

      // langs.value = newData?.code
      // hasCertificate.value = newData?.hasCertificate
      allIndustries.value = newData?.allIndustries! ?? false
      industry.value = newData?.industries!
    }
  },
  { immediate: true },
)

// const setImage = async (data: File) => {
//   image.value = await filesToBase64(data)
//   updateData()
// }

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
  {
    key: 'industry',
    message: 'Industry Is Required',
    isMissing: () =>
      user.user?.type === OrganizationTypeEnum.ADMIN &&
      !allIndustries.value &&
      !industry.value?.length,
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
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
    <p v-if="getFieldError('langs')" class="required-field-message">
      {{ getFieldError('langs') }}
    </p>
  </div>

  <!--  <div class="col-span-4 md:col-span-2 input-wrapper check-box">-->
  <!--    <label>{{ $t('has_certificate') }}</label>-->
  <!--    <input-->
  <!--      type="checkbox"-->
  <!--      :value="1"-->
  <!--      v-model="hasCertificate"-->
  <!--      :checked="hasCertificate == 1"-->
  <!--      @change="updateData"-->
  <!--    />-->
  <!--  </div>-->
  <div
    class="col-span-4 md:col-span-2 input-wrapper check-box"
    v-if="user.user?.type == OrganizationTypeEnum.ADMIN"
  >
    <label>{{ $t('all_industries') }}</label>
    <input type="checkbox" :value="true" v-model="allIndustries" @change="updateData" />
  </div>
  <div
    class="col-span-4 md:col-span-2"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum.ADMIN"
    data-required-field="industry"
  >
    <UpdatedCustomInputSelect
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="industry"
      id="Teams"
      placeholder="Select industry"
      :type="2"
      @update:modelValue="setIndustry"
    />
    <p v-if="getFieldError('industry')" class="required-field-message">
      {{ getFieldError('industry') }}
    </p>
  </div>
  <!-- <div class="input-wrapper col-span-4 md:col-span-2" v-if="!data?.id">
      <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :switch_reverse="true"
      :is-auto="true"
      @update:value="UpdateSerial"
    />
  </div> -->
  <!--  <div class="col-span-4 md:col-span-4">-->
  <!--    <FileUpload-->
  <!--      :initialFileData="image"-->
  <!--      @update:fileData="setImage"-->
  <!--      label="Image"-->
  <!--      id="image"-->
  <!--      placeholder="Select image"-->
  <!--      :multiple="false"-->
  <!--    />-->
  <!--  </div>-->
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
