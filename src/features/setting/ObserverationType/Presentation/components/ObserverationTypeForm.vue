<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

// import { ObserverationTypesMap } from '@/constant/ObserverationTypes'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import type ShowObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeDetailsModel'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import EditObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/editObserverationTypeParams.ts'
import AddObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/addObserverationTypeParams.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShowObserverationTypeModel
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

// default available ObserverationTypes
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
  const indexObserverationTypeController = await IndexLangController.getInstance().getData(params)

  const response = indexObserverationTypeController.value

  if (response?.data?.length) {
    // map backend ObserverationTypes into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use ObserverationTypesMap
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

  // console.log(allIndustries.value, 'industry')
  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new EditObserverationTypeParams(
        props.data?.id! ?? 0,
        translationsParams,
        AllIndustry,
        industry.value?.map((item) => item.id) ?? [],
      )
    : new AddObserverationTypeParams(
        translationsParams,
        AllIndustry,
        industry.value?.map((item) => item.id),
        SerialNumber.value?.SerialNumber,
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

// init ObserverationTypes either from backend (edit mode) or from defaults (create mode)
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
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>
  <div class="input-wrapper col-span-4 md:col-span-2" v-if="!data?.id">
    <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :switch_reverse="true"
      :is-auto="true"
      @update:value="UpdateSerial"
    />
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
  <!-- <div class="col-span-4 md:col-span-2 input-wrapper check-box" v-if="user.user?.type == OrganizationTypeEnum.ADMIN">
    <label>{{ $t('all_industries') }}</label>
    <input
      type="checkbox"
      :value="true"
      v-model="allIndustries"

      @change="updateData"
    />
  </div> -->
  <div
    class="input-wrapper col-span-4 md:col-span-2"
    v-if="user.user?.type == OrganizationTypeEnum?.ADMIN"
  >
    <CustomCheckbox :title="`all_industries`" @update:checked="allIndustries = $event" />
  </div>

  <div
    class="col-span-4 md:col-span-2"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum.ADMIN"
  >
    <CustomSelectInput
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="industry"
      id="ObserverationType"
      placeholder="Select industry"
      :type="2"
      @update:modelValue="setIndustry"
    />
  </div>
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
