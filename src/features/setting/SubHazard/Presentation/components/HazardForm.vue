<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'

import TitleInterface from '@/base/Data/Models/title_interface'
import type ShowHazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeDetailsModel'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'

import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'

import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

import TranslationsParams from '@/base/core/params/translations_params'
import AddHazardTypeParams from '@/features/setting/HazardType/Core/params/addHazardTypeParams'
import EditHazardTypeParams from '@/features/setting/HazardType/Core/params/editHazardTypeParams'
import HazardFactorParams from '../../Core/params/FactorParams'

import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'

import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'

import IndexFactoryController from '@/features/setting/Factory/Presentation/controllers/indexFactoryController'
import IndexFactoryParams from '@/features/setting/Factory/Core/params/indexFactoryParams'

import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController'
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import { HazardTypeParentEnum } from '../../Core/Enums/HazardTypeEnum'
import { routeLocationKey, useRoute } from 'vue-router'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'

/* ================= props & emits ================= */

const props = defineProps<{
  data?: ShowHazardTypeModel
}>()

const emit = defineEmits<{
  (e: 'update:data', value: any): void
}>()

/* ================= stores ================= */

const user = useUserStore()

/* ================= refs ================= */

// translations values
const langs = ref<{ locale: string; title: string; icon?: Component }[]>([
  { locale: 'en', title: '', icon: USA },
  { locale: 'ar', title: '', icon: SA },
])

// default langs (from backend or user)
const langDefault = ref<{ locale: string; title: string; icon?: Component }[]>([])

// industries
const industry = ref<TitleInterface[]>([])
const allIndustries = ref<boolean>(false)

// factors
const Factor = ref<TitleInterface[]>([])

// hazard type
const HazardType = ref<TitleInterface | null>(null)

/* ================= controllers & params ================= */

const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const indexFactoryController = IndexFactoryController.getInstance()
const indexFactoryParams = new IndexFactoryParams('', 1, 10, 0)

const indexHazardTypeController = IndexHazardTypeController.getInstance()
const indexHazardTypeParams = new IndexHazardTypeParams(
  '',
  1,
  10,
  0,
  null,
  HazardTypeParentEnum.Parent,
)

/* ================= methods ================= */

const fetchLang = async (query = '', pageNumber = 1, perPage = 10, withPage = 0) => {
  if (user?.user?.languages?.length) {
    langDefault.value = user.user.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }

  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const res = await IndexLangController.getInstance().getData(params)

  if (res.value?.data?.length) {
    langDefault.value = res.value.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', title: '', icon: USA },
      { locale: 'ar', title: '', icon: SA },
    ]
  }
}

onMounted(fetchLang)

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const allIndustryValue =
    user.user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null

  const hazardFactors = Factor.value.map((item) => new HazardFactorParams(item.id))

  const params = props.data?.id
    ? new EditHazardTypeParams(
        props.data.id,
        translationsParams,
        allIndustryValue,
        industry.value.map((i) => i.id),
        hazardFactors,
        HazardType.value?.id || route.params.parent_id,
      )
    : new AddHazardTypeParams(
        translationsParams,
        allIndustryValue,
        industry.value.map((i) => i.id),
        hazardFactors,
        HazardType.value?.id || route.params.parent_id,
        SerialNumber.value?.SerialNumber,
      )

  emit('update:data', params)
}

/* ================= setters ================= */

const setLangs = (data: { locale: string; title: string; icon?: Component }[]) => {
  langs.value = data
  updateData()
}

const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  updateData()
}

const setFactor = (data: TitleInterface[]) => {
  Factor.value = data
  updateData()
}

const setHazrdType = (data: TitleInterface) => {
  HazardType.value = data
  updateData()
}

/* ================= watchers ================= */

watch(
  [() => props.data, () => langDefault.value],
  ([newData, defaults]) => {
    if (!defaults.length) return

    if (newData?.titles?.length) {
      langs.value = defaults.map((l) => {
        const existing = newData.titles.find((t) => t.locale === l.locale)
        return existing ?? { locale: l.locale, title: '', icon: l.icon }
      })
    } else {
      langs.value = defaults.map((l) => ({
        locale: l.locale,
        title: '',
        icon: l.icon,
      }))
    }

    allIndustries.value = newData?.allIndustries === 1
    industry.value = newData?.industries ?? []
    Factor.value = newData?.factories ?? []
    HazardType.value = newData?.parent ?? null
  },
  { immediate: true },
)
const route = useRoute()


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
  <!-- <div class="col-span-4 md:col-span-2 input-wrapper check-box" v-if="user.user?.type == OrganizationTypeEnum.ADMIN">
    <label>{{ $t('all_industries') }}</label>
    <input type="checkbox" :value="true" v-model="allIndustries" @change="updateData" />
  </div> -->
  <div
    class="input-wrapper col-span-4 md:col-span-2"
    v-if="user.user?.type == OrganizationTypeEnum?.ADMIN"
  >
    <CustomCheckbox
      :title="`all_industries`"
      :checked="allIndustries"
      @update:checked="allIndustries = $event"
    />
  </div>
  <div
    class="input-wrapper col-span-4 md:col-span-2"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum.ADMIN"
  >
    <CustomSelectInput
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="industry"
      id="HazardType"
      placeholder="Select industry"
      :type="2"
      @update:modelValue="setIndustry"
    />
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="Factor"
      :controller="indexFactoryController"
      :params="indexFactoryParams"
      label="Factor"
      id="factor"
      placeholder="Select Factor"
      :type="2"
      @update:modelValue="setFactor"
    />
  </div>
  <div class="input-wrapper col-span-4 md:col-span-2" v-if="!route.params.parent_id">
    <CustomSelectInput
      :modelValue="HazardType"
      :controller="indexHazardTypeController"
      :params="indexHazardTypeParams"
      label="Hazard Type"
      id="hazard type"
      placeholder="Select Hazrd Type"
      @update:modelValue="setHazrdType"
    />
  </div>
</template>
