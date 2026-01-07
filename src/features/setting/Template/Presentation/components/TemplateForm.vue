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
import type TemplateDetailsModel from '../../Data/models/TemplateDetailsModel'
import EditTemplateParams from '../../Core/params/editTemplateParams'
import AddTemplateParams from '../../Core/params/addTemplateParams'
import { ActionsEnum } from '../../Core/Enum/ActionType'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import Setting from '@/assets/images/Setting.png'
import Geer from '@/assets/images/Geer.png'
import hand from '@/assets/images/hand.png'
import MultiSelect from 'primevue/multiselect';
import { TemplateType } from '../../Core/Enum/TemplateTypeEnum'


const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: TemplateDetailsModel
}>()

// Translations
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// Industries
const allIndustries = ref<boolean>(false)
const industry = ref<TitleInterface[]>([])


const selectedIndustry = ref<TitleInterface[]>([]);
const Industries = ref<TitleInterface[]>([]);
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const FetchIndustries = async () => {
  const res = await industryController.getData(industryParams)
  if (res.value.data) {
    Industries.value = res.value.data;
  }
}

const ActionsSelection = ref<TitleInterface[]>([
  new TitleInterface({ id: ActionsEnum.CheckBox, title: 'Checkbox', subtitle: '' }),
])

// Image
const image = ref<string>('')

// Items (dynamic list)
interface Item {
  langs: { locale: string; title: string }[]
  allIndustries: boolean
  industry: TitleInterface[]
  requireImage: string
  action: TitleInterface | null
}
const items = ref<Item[]>([])

// helper to create new blank item
const createNewItem = (): Item => ({
  langs: langDefault.value.map((l) => ({ locale: l.locale, title: '' })),
  allIndustries: false,
  industry: [],
  requireImage: '',
  action: null,
})

const user = useUserStore()
// --- Fetch available languages
const fetchLang = async () => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams('', 1, 10, 0)
  const response = (await IndexLangController.getInstance().getData(params)).value

  langDefault.value = response?.data?.length
    ? response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    : [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]

  if (!items.value.length) {
    items.value.push(createNewItem())
  }
}

onMounted(
  () => {
    fetchLang();
    if (user.user?.type == OrganizationTypeEnum?.ADMIN) {
      FetchIndustries();
    }
  }
)

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })



  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? IndustrySelectOption.value == 1 ? true : false : null
  const industries = user.user?.type == OrganizationTypeEnum?.ADMIN ? IndustrySelectOption.value == 2 ? industry.value?.map((i) => i.id) : null : null

  const params = props.data?.id
    ? new EditTemplateParams(
      props.data?.id ?? 0,
      translationsParams,
      AllIndustry,
      industries ?? [],
      image.value || null,
      [],
      SelectedTemplateType?.value?.id

    )
    : new AddTemplateParams(
      translationsParams,
      AllIndustry,
      industries ?? [],
      image.value || null,
      null,
      [],
      SelectedTemplateType?.value?.id
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
    if (!newDefault.length) return

    langs.value = newData?.titles?.length
      ? newDefault.map((l) => {
        const existing = newData.titles.find((t) => t.locale === l.locale)
        return existing ?? { locale: l.locale, title: '' }
      })
      : newDefault.map((l) => ({ locale: l.locale, title: '' }))

    IndustrySelectOption.value = newData?.allIndustries == 1 ? true : false

    industry.value = newData?.industries ?? []
    console.log(industry.value, "industry.value");

  },
  { immediate: true },
)

const IndustrySelectOption = ref<number>()
const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  console.log(industry.value, "industry.value");
  updateData()
}



watch(() => IndustrySelectOption.value, (newValue) => {
  if (newValue == 1) {
    industry.value = []
    updateData()
  }
})

const SelectedTemplateType = ref<TitleInterface | null>(null)
const TemplateTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: TemplateType.Equipment, title: 'Equipment', subtitle: '' }),
  new TitleInterface({ id: TemplateType.Tool, title: 'Tool', subtitle: '' }),
  new TitleInterface({ id: TemplateType.Location, title: 'Location', subtitle: '' }),
])

const setTemplateType = (data: TitleInterface) => {
  SelectedTemplateType.value = data
  updateData()
}

</script>

<template>
  <div class="w-full col-span-4">
    <PagesHeader :img="Setting" title="Customize Inspection Template"
      subtitle="Choose a predefined inspection template, adjust its fields if needed, and decide whether to save your changes permanently or just for this session." />
  </div>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>
  <div class="col-span-4 md:col-span-4">
    <CustomSelectInput :modelValue="SelectedTemplateType" :staticOptions="TemplateTypes" :required="true"
      label="Template Type " id="TemplateType" placeholder="Select Template Type"
      @update:modelValue="setTemplateType" />
  </div>
  <div class="col-span-4 md:col-span-2 select-container" :class="IndustrySelectOption == 1 ? 'selected' : ''"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN">
    <label for="all-industry">
      <span>All industries</span>
      <img :src="Geer" alt="all industries" />
    </label>
    <input type="radio" id="all-industry" name="industry" value="1" v-model="IndustrySelectOption" @change="updateData">
  </div>
  <div class="col-span-4 md:col-span-2 select-container" :class="IndustrySelectOption == 2 ? 'selected' : ''"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN">
    <label for="select-industry" class="select-industry">
      <!-- <MultiSelect :modelValue="industry" :options="Industries" optionLabel="title" placeholder="select single industry"
        :multiple="true" class=" w-full md:w-56 select-container-multi" @update:modelValue="setIndustry" /> -->
      <CustomSelectInput :modelValue="industry" :controller="industryController" :params="industryParams"
        label="Industry" id="Industry" placeholder="Select industry" :type="2" @update:modelValue="setIndustry" />
      <img :src="hand" alt="single industry" />
    </label>


    <input type="radio" id="select-industry" value="2" name="industry" v-model="IndustrySelectOption">
  </div>
</template>