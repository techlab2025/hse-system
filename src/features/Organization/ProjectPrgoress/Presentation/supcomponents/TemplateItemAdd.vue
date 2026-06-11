<script setup lang="ts">

import { markRaw, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TemplateType } from '@/features/setting/Template/Core/Enum/TemplateTypeEnum'
import TitleInterface from '@/base/Data/Models/title_interface'
import AddTemplateParams from '@/features/setting/Template/Core/params/addTemplateParams'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import { ActionsEnum } from '@/features/setting/Template/Core/Enum/ActionType'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import AddTemplateItemParams from '@/features/setting/TemplateItem/Core/params/addTemplateItemParams'
import AddTemplateController from '@/features/setting/Template/Presentation/controllers/addTemplateController'
import TemplateTimeLine from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/TemplateTimeLine.vue'



const visible = ref(false)
const formKey = ref(0)
const emit = defineEmits(['update:data', 'update:templateId'])

// Translations
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])


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

  if (!items.value.length) {
    items.value.push(createNewItem())
  }
}

onMounted(
  () => {
    fetchLang();
  }
)
interface items {
  title: string
  isDanger: boolean
  isTextAreaRequired: boolean
  textarea_type: number
  has_auto_observation: boolean
}

const buildOptions = (templateItems: any[]): items[] => {
  return templateItems.map((item) => ({
    title: item.text,
    isDanger: item.isUplaod,
    isTextAreaRequired: item.isTextarea,
    textarea_type: item.textareaType ?? 0,
    has_auto_observation: item.isObservation,
    normal_textarea: true
  }))
}
const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const items = TemplateData.value.map((item) => {
    return new AddTemplateItemParams(
      null,
      item.itemTitle,
      item.SelectedActionType?.id,
      buildOptions(item.TemplateItems),
      item.isUpdloadImage || 0,
      item.ImageStatus || 0,
      item.itemTag
    )
  })

  const params = new AddTemplateParams(
    translationsParams,
    null,
    null ?? [],
    image.value || null,
    null,
    items,
    SelectedTemplateType?.value?.id,
    null
  )
  emit('update:data', params)
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  // updateData()
}


const SelectedTemplateType = ref<TitleInterface | null>(null)
const TemplateTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: TemplateType.Equipment, title: 'Equipment', subtitle: '' }),
  new TitleInterface({ id: TemplateType.Tool, title: 'Tool', subtitle: '' }),
  new TitleInterface({ id: TemplateType.Location, title: 'Location', subtitle: '' }),
  new TitleInterface({ id: TemplateType.PermitToWork, title: 'Permit To Work', subtitle: '' }),
])

const setTemplateType = (data: TitleInterface) => {
  SelectedTemplateType.value = data
  // updateData()
}

const TemplateData = ref()
const GetTemplateData = (data) => {
  TemplateData.value = data
  console.log(TemplateData.value, "TemplateData.value")
}


const addTemplateController = AddTemplateController.getInstance()

const router = useRouter()
const route = useRoute()

const buildParams = (isInLibrary: number): AddTemplateParams => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const templateItems = TemplateData.value.map((item) => {
    return new AddTemplateItemParams(
      null,
      item.itemTitle,
      item.SelectedActionType?.id,
      buildOptions(item.TemplateItems),
      item.isUpdloadImage || 0,
      item.ImageStatus || 0,
      item.itemTag
    )
  })

  return new AddTemplateParams(
    translationsParams,
    null,
    null ?? [],
    image.value || null,
    null,
    templateItems,
    SelectedTemplateType?.value?.id,
    isInLibrary
  )
}

const resetForm = () => {
  langs.value = []
  SelectedTemplateType.value = null
  TemplateData.value = undefined
  formKey.value++
}

const addTemplate = async (isInLibrary: number) => {
  const params = buildParams(isInLibrary)
  const state = await addTemplateController.addTemplate(params as AddTemplateParams, router)
  if (state?.value.data) {
    emit('update:templateId', {
      templateId: state?.value.data.id,
      teamplateTitle: state?.value.data.title,
      isInLibrary: isInLibrary
    })
    emit('update:data')
  }
  visible.value = false
}

const saveAndAdd = async () => {
  const params = buildParams(1)
  const state = await addTemplateController.addTemplate(params as AddTemplateParams, router, true)
  if (!state?.value.error) {
    resetForm()
  }
  visible.value = false
}

watch(
  () => user?.user?.languages,
  (langs) => {
    if (langs?.length) {
      langDefault.value = langs.map((item: any) => ({
        locale: item.code,
        title: '',
        icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
      }))
    } else {
      fetchLang()
    }
  },
  { immediate: true }
)

</script>

<template>
  <div class="add-new-template-dialog-container">
    <!-- BODY -->
    <div class="dialog-body">
      <div class="inspection-template-dialog-data grid grid-cols-4 gap-4">
        <hr class="inspection-template-dialog-divider col-span-4" />

        <div class="col-span-4 md:col-span-2">
          <LangTitleInput :key="formKey" :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
        </div>

        <div class="col-span-4 md:col-span-2">
          <CustomSelectInput :key="formKey" :modelValue="SelectedTemplateType" :staticOptions="TemplateTypes" :required="true"
            :label="$t('Template Type')" id="TemplateType" :placeholder="$t('Select Template Type')"
            @update:modelValue="setTemplateType" />
        </div>

        <TemplateTimeLine :key="formKey" :visable="visible" @update:data="GetTemplateData" />
      </div>
    </div>

    <!-- FOOTER FIXED -->
    <div class="dialog-footer button-wrapper">
      <button
        class="btn btn-primary"
        :class="route.path.includes('project-progress') ? 'w-1/2' : 'w-full'"
        @click="addTemplate(1)"
      >
        {{ $t('confirm') }}
      </button>
      <button
        v-if="route.path.includes('project-progress')"
        class="btn btn-primary w-1/2"
        @click="saveAndAdd"
      >
        {{ $t('save and add') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  width: 100% !important;
  button {
    &.w-full { width: 100%; }
    &.w-1\/2 { width: 50%; }
  }
}
</style>
