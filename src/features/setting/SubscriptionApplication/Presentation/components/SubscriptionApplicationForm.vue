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
import editSubscriptionParams from '../../Core/params/editSubscriptionApplicationParams'
import AddSubscriptionParams from '../../Core/params/addSubscriptionApplicationParams'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import type SubscriptionDetailsModel from '../../Data/models/SubscriptionApplicationDetailsModel'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexSubscriptionController from '../controllers/indexSubscriptionController'
import IndexSubscriptionTypeController from '@/features/setting/SubscriptionType/Presentation/controllers/indexSubscriptionTypeController'
import IndexSubscriptionTypeParams from '@/features/setting/SubscriptionType/Core/params/indexSubscriptionTypeParams'
import IndexOrganizationController from '@/features/setting/Organization/Presentation/controllers/indexOrganizationController'
import IndexOrganizationParams from '@/features/setting/Organization/Core/params/indexOrganizationParams'
import DatePicker from 'primevue/datepicker';
import Editor from 'primevue/editor'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SubscriptionDetailsModel
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
  const indexSubscriptionsController = await IndexLangController.getInstance().getData(params)

  const response = indexSubscriptionsController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use SubscriptionssMap
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
    ? new editSubscriptionParams(
      {
        id: props.data?.id! ?? 0,
        organizationId: Organization.value?.id ?? 0,
        subscriptionTypeId: SubscriptionType.value?.id ?? 0,
        fromDate: FromDate.value,
        requestedPrice: requested_price.value,
        hasDiscount: has_discount.value,
        discountPrice: discount_price.value,
        notes: notes.value
      }
    )
    : new AddSubscriptionParams(
      {
        organizationId: Organization.value?.id ?? 0,
        subscriptionTypeId: SubscriptionType.value?.id ?? 0,
        fromDate: FromDate.value,
        requestedPrice: requested_price.value,
        hasDiscount: has_discount.value,
        discountPrice: discount_price.value,
        notes: notes.value
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

      Organization.value = newData?.organization
      SubscriptionType.value = newData?.subscription_type
      FromDate.value = newData?.from_date
      requested_price.value = newData?.requested_price
      has_discount.value = newData?.has_discount
      discount_price.value = newData?.discount_price
      notes.value = newData?.notes

    }
  },
  { immediate: true },
)

const indexSubscriptionController = IndexSubscriptionTypeController.getInstance()
const indexSubscriptionTypeParams = new IndexSubscriptionTypeParams("", 1, 10, 0)
const SubscriptionType = ref<TitleInterface>()
const setSubscriptionType = (data: TitleInterface) => {
  SubscriptionType.value = data
  updateData()
}

const indexOrganizationController = IndexOrganizationController.getInstance()
const indexOrganizationParams = new IndexOrganizationParams("", 1, 10, 0)
const Organization = ref<TitleInterface>()
const setOrganization = (data: TitleInterface) => {
  Organization.value = data
  updateData()
}

const FromDate = ref(new Date())
const requested_price = ref<number>()
const has_discount = ref<boolean>()
const setHasDiscount = (value: boolean) => {
  has_discount.value = value
  updateData()
}

const discount_price = ref<number>()
const notes = ref<string>()


</script>

<template>

  <div class="input-wrapper col-span-2">
    <UpdatedCustomInputSelect :modelValue="Organization" :controller="indexOrganizationController"
      :params="indexOrganizationParams" label="Organization" id="Organization" placeholder="Select Organization"
      @update:modelValue="setOrganization" />
  </div>
  <div class="input-wrapper col-span-2">
    <UpdatedCustomInputSelect :modelValue="SubscriptionType" :controller="indexSubscriptionController"
      :params="indexSubscriptionTypeParams" label="Subscription Type" id="SubscriptionType"
      placeholder="Select Subscription Type" @update:modelValue="setSubscriptionType" />
  </div>

  <div class="input-wrapper col-span-2 mt-10">
    <label for="">{{ $t('from_date') }}</label>
    <DatePicker v-model="FromDate" class="input" label="select Start Date" id="Date" placeholder="select Start Date"
      @update:modelValue="updateData" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper ">
    <label for="requested_price">{{ $t('requested_price') }}</label>
    <input id="requested_price" type="text" v-model="requested_price" placeholder="Enter Price" class="input"
      @input="updateData" />
  </div>
  <div class="input-wrapper col-span-2">
    <CustomCheckbox :title="`has_discount`" :checked="has_discount" @update:checked="setHasDiscount" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper " v-if="has_discount">
    <label for="discount_price">{{ $t('discount_price') }}</label>
    <input id="discount_price" type="text" v-model="discount_price" placeholder="Enter Discount Price" class="input"
      @input="updateData" />
  </div>

  <div class="col-span-4 md:col-span-4 input-wrapper ">
    <Editor v-model="notes" editorStyle="height: 320px" @update:modelValue="updateData" />
  </div>



</template>
