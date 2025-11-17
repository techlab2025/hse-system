<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import { useRoute } from 'vue-router'
import AddTemplateItemParams from '../../Core/params/addTemplateItemParams'
import EditTemplateItemParams from '../../Core/params/editTemplateItemParams'
import { useUserStore } from '@/stores/user'
import TemplateItemDetailsModel from '../../Data/models/TemplateItemDetailsModel'
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import SmartContract from '@/assets/images/SmartContract.png'
import TemplateTypesSection from './TemplateTypes/TemplateTypesSection.vue'
import { ActionsEnum } from '../../Core/Enum/ActionsEnum'
import DropDownType from './TemplateTypes/DropDownType.vue'
import TemplateImage from './TemplateTypes/TemplateImage.vue'
import RadioButtonType from './TemplateTypes/RadioButtonType.vue'
import CheckboxType from './TemplateTypes/CheckboxType.vue'
import ShowTemplate from './ShowTemplate.vue'


const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: TemplateItemDetailsModel }>()
const ImageChecked = ref()
const ActionChecked = ref()
const route = useRoute()
const id = Number(route.params.parent_id)
const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const SelectedComponent = ref<ActionsEnum>(3)
const TemplateData = ref()

const user = useUserStore()
const fetchLang = async (query = '', pageNumber = 1, perPage = 10, withPage = 0) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const controller = await IndexLangController.getInstance().getData(params)
  const response = controller.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}
onMounted(fetchLang)

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })
  const params = !props.data?.id
    ? new AddTemplateItemParams(
      id,
      translationsParams,
      SelectedComponent.value,
      TemplateData.value,
      isUpdloadImage.value,
      ImageStatus.value,

    )
    : new EditTemplateItemParams(
      props.data.id ?? 0,
      translationsParams,
      ImageChecked.value ? 1 : 0,
      ActionChecked.value ? 1 : 0,
      props.data.id ?? 0,
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
      langs.value = newDefault.map((l) => {
        const existing = newData?.titles?.find((t) => t.locale === l.locale)
        return existing ? { ...l, title: existing.title } : { ...l }
      })
    }
    if (newData) {
      ImageChecked.value = newData.requiredImage ? true : false
      ActionChecked.value = newData.action == 1 ? true : false
    }
  },
  { immediate: true },
)

const GetTemplateType = (data: ActionsEnum) => {
  SelectedComponent.value = data
}

const ComponentsOptions = [
  { id: ActionsEnum.DROPDOWN, name: 'DropDown', component: DropDownType },
  { id: ActionsEnum.RADIOBUTTON, name: 'Radio Button', component: RadioButtonType },
  { id: ActionsEnum.CHECKBOX, name: 'Check Box', component: CheckboxType },
]

const selectedComponent = computed(() => {
  return ComponentsOptions.find(Component => Component.id === SelectedComponent.value)
})

const GetData = (data: any) => {
  TemplateData.value = data
}

const AddToTemplate = () => {
  console.log(TemplateData.value, "add to template clicked");
}

watch(() => TemplateData.value, () => {
  updateData()
})
watch(() => SelectedComponent.value, () => {
  updateData()
})

const isUpdloadImage = ref()
const ImageStatus = ref();
const UpdateImageInfo = (data: any) => {
  isUpdloadImage.value = data.isUpdloadImage
  ImageStatus.value = data.ImageType
  updateData()
}
</script>

<template>
  <div class="w-full col-span-4">
    <PagesHeader :img="SmartContract" title="smart create for your inspection templet"
      subtitle="add your items one by one to the templet and you can see them" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <div class="col-span-4 md:col-span-2">
      <LangTitleInput :label="$t('item_title')" :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs"
        :placeholder="`add your title here..`" />
    </div>
    <div class="col-span-4 md:col-span-2 form-container">
      <TemplateTypesSection @update:data="GetTemplateType" />
      <component @update:data="GetData" :is="selectedComponent?.component" :id="selectedComponent.id"
        v-if="selectedComponent?.component" />
      <TemplateImage v-if="SelectedComponent != ActionsEnum.TEXTAREA" @update:data="UpdateImageInfo" />
      <button class="btn add-btn w-full " @click="AddToTemplate">{{ $t('add_to_template') }}</button>
    </div>
  </div>
  <div class="col-span-4 md:col-span-2">
    <ShowTemplate />
  </div>
</template>

<style scoped>
.form-container {
  .add-btn {
    margin-top: 15px;

  }
}
</style>
