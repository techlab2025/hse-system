<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
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
import editSubscriptionTypeParams from '../../Core/params/editSubscriptionTypeParams'
import AddSubscriptionTypeParams from '../../Core/params/addSubscriptionTypeParams'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import type SubscriptionTypeDetailsModel from '../../Data/models/SubscriptionTypeDetailsModel'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { SubscriptionTypeEnum } from '../../Core/Enum/SubscriptionTypeEnum'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SubscriptionTypeDetailsModel
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
  const indexSubscriptionTypesController = await IndexLangController.getInstance().getData(params)

  const response = indexSubscriptionTypesController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use SubscriptionTypessMap
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



  const params = props.data?.id
    ? new editSubscriptionTypeParams(
      {
        id: props.data?.id! ?? 0,
        translation: translationsParams,
        days: days.value,
        price: price.value,
        isSupportExists: isSupportExists.value,
        support_days: support_days.value,
        support_price: support_price.value,
        is_active: isActive.value,
        is_default: isDefault.value,
        is_free: isFree.value,
        type: SubscriptionType.value?.id ?? 0,
      }
    )
    : new AddSubscriptionTypeParams(
      {
        translation: translationsParams,
        days: Number(days.value),
        price: Number(price.value),
        isSupportExists: isSupportExists.value,
        support_days: Number(support_days.value),
        support_price: Number(support_price.value),
        is_active: isActive.value,
        is_default: isDefault.value,
        is_free: isFree.value,
        type: SubscriptionType.value?.id ?? 0,
      }

    )

  emit('update:data', params)
}



const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  updateData()
}

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
      price.value = newData?.price;
      days.value = newData?.days;
      isSupportExists.value = newData?.isSupportExists;
      support_days.value = newData?.supportDays;
      support_price.value = newData?.supportPrice;
      isActive.value = newData?.isActive;
      isDefault.value = newData?.isDefault;
      isFree.value = newData?.isFree;
      SubscriptionType.value = SubscriptionTypes.value.find((item) => item.id === newData?.type);

    }
  },
  { immediate: true },
)



const price = ref<number>(0)
const days = ref<number>(0)
const isSupportExists = ref<boolean>(false)
const setIsSupportExists = (value: boolean) => {
  isSupportExists.value = value
  updateData()
}
const support_days = ref<number>(0)
const support_price = ref<number>(0)
const isActive = ref<boolean>(false)
const setIsActive = (value: boolean) => {
  isActive.value = value
  updateData()
}
const isDefault = ref<boolean>(false)
const setIsDefault = (value: boolean) => {
  isDefault.value = value
  updateData()
}
const isFree = ref<boolean>(false)
const setIsFree = (value: boolean) => {
  isFree.value = value
  updateData()
}

const SubscriptionType = ref<TitleInterface>()
const SubscriptionTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: SubscriptionTypeEnum.TRIAL, title: 'Trial' }),
  new TitleInterface({ id: SubscriptionTypeEnum.LIFETIME, title: 'Lifetime' }),
  new TitleInterface({ id: SubscriptionTypeEnum.MONTHLY, title: 'Monthly' }),
  new TitleInterface({ id: SubscriptionTypeEnum.YEARLY, title: 'Yearly' }),
])

const setSubscriptionType = (value: TitleInterface) => {
  SubscriptionType.value = value
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper ">
    <label for="price">{{ $t('price') }}</label>
    <input id="price" type="text" v-model="price" placeholder="Enter Price" class="input" @input="updateData" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper ">
    <label for="days">{{ $t('days') }}</label>
    <input id="days" type="text" v-model="days" placeholder="Enter Days" class="input" @input="updateData" />
  </div>
  <div class="input-wrapper col-span-2">
    <CustomCheckbox :title="`is_support_exists`" :checked="isSupportExists" @update:checked="setIsSupportExists" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper " v-if="isSupportExists">
    <label for="support_days">{{ $t('support_days') }}</label>
    <input id="support_days" type="text" v-model="support_days" placeholder="Enter Support Days" class="input"
      @input="updateData" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper " v-if="isSupportExists">
    <label for="support_price">{{ $t('support_price') }}</label>
    <input id="support_price" type="text" v-model="support_price" placeholder="Enter Support Price" class="input"
      @input="updateData" />
  </div>
  <div class="input-wrapper col-span-2 ">
    <CustomCheckbox :title="`is_active`" :checked="isActive" @update:checked="setIsActive" />
  </div>
  <div class="input-wrapper col-span-2">
    <CustomCheckbox :title="`is_default`" :checked="isDefault" @update:checked="setIsDefault" />
  </div>
  <div class="input-wrapper col-span-2">
    <CustomCheckbox :title="`is_free`" :checked="isFree" @update:checked="setIsFree" />
  </div>
  <div class="input-wrapper col-span-2">
    <UpdatedCustomInputSelect :modelValue="SubscriptionType" :staticOptions="SubscriptionTypes" label="Type" id="Type"
      placeholder="Select Type" @update:modelValue="setSubscriptionType" />
  </div>
</template>

<style scoped>
/* .p-2 {
  padding: 0.5rem;
} */
</style>
