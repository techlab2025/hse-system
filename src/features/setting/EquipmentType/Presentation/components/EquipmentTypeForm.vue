<script EquipmentType="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import { EquipmentTypesMap } from '@/constant/EquipmentTypes'
import type ShowEquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/EquipmentTypeDetailsModel.ts'
import EquipmentTypeTitleInput from '@/shared/HelpersComponents/EquipmentTypeTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import EditEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/editEquipmentTypeParams'
import AddEquipmentTypeParams from '@/features/setting/EquipmentTypeuages/Core/params/addEquipmentTypeParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams.ts'
import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShowEquipmentTypeModel
}>()

// actual translations (values)
const EquipmentTypes = ref<{ locale: string; title: string }[]>([
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

// selected base EquipmentTypeuage
const EquipmentType = ref<TitleInterface | null>(null)

// default available EquipmentTypes
const EquipmentTypesDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const fetchEquipmentType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexEquipmentTypeParams(query, pageNumber, perPage, withPage)
  const indexEquipmentTypeController = await IndexEquipmentTypeController.getInstance().getData(params)

  const response = indexEquipmentTypeController.value

  if (response?.data?.length) {
    // map backend EquipmentTypes into default structure
    EquipmentTypesDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use EquipmentTypesMap
      icon: markRaw(EquipmentTypesMap[item.code as keyof typeof EquipmentTypesMap]?.icon),
    }))
  } else {
    EquipmentTypesDefault.value = [
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
  await fetchEquipmentType()
})

const getEquipmentTypeTitleList = (): TitleInterface[] => {
  return Object.values(EquipmentTypesMap).map((EquipmentType, index) => {
    return new TitleInterface({
      id: index + 1,
      title: EquipmentType.name,
      subtitle: EquipmentType.code,
    })
  })
}
const EquipmentTypesList = getEquipmentTypeTitleList()

const updateData = () => {
  const translationsParams = new TranslationsParams()

  EquipmentTypes.value.forEach((EquipmentType) => {
    translationsParams.setTranslation('title', EquipmentType.locale, EquipmentType.title)
  })

  const params = props.data?.id
    ? new EditEquipmentTypeParams(props.data?.id! ?? 0, translationsParams, EquipmentType.value?.subtitle! ?? 'en')
    : new AddEquipmentTypeParams(translationsParams, EquipmentType.value?.subtitle! ?? 'en')

  // console.log(params, 'params')
  emit('update:data', params)
}

const setEquipmentType = (data: TitleInterface) => {
  // console.log(data, 'data')
  EquipmentType.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setEquipmentTypes = (data: { locale: string; title: string }[]) => {
  EquipmentTypes.value = data

  // console.log(EquipmentTypes.value, 'EquipmentTypes')
  updateData()
}

// init EquipmentTypes either from backend (edit mode) or from defaults (create mode)
watch(
  [() => props.data, () => EquipmentTypesDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      if (newData?.titles?.length) {
        EquipmentTypes.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        EquipmentTypes.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      EquipmentType.value = newData?.code
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <EquipmentTypeTitleInput :EquipmentTypes="EquipmentTypesDefault" :modelValue="EquipmentTypes" @update:modelValue="setEquipmentTypes" />
  </div>

  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="EquipmentType"
      :staticOptions="EquipmentTypesList"
      label="EquipmentTypeuage"
      id="EquipmentType"
      placeholder="Select EquipmentTypeuage"
      @update:modelValue="setEquipmentType"
      :required="true"
    />
  </div>
</template>
