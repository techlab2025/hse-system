<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import ImportantIcon from '@/shared/icons/ImportantIcon.vue'
import Dialog from 'primevue/dialog'
import InspectionTemplateImage from '@/assets/images/check-list.png'

import { markRaw, nextTick, onMounted, ref, watch } from 'vue'

import AddNewTemplateIcon from '@/shared/icons/AddNewTemplateIcon.vue'
import NewTemplateArrowIcon from '@/shared/icons/NewTemplateArrowIcon.vue'
import { TemplateType } from '@/features/setting/Template/Core/Enum/TemplateTypeEnum'
import TitleInterface from '@/base/Data/Models/title_interface'
import AddTemplateParams from '@/features/setting/Template/Core/params/addTemplateParams'
import EditTemplateParams from '@/features/setting/Template/Core/params/editTemplateParams'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import { ActionsEnum } from '@/features/setting/Template/Core/Enum/ActionType'
import { ActionsEnum as TemplateItemActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import TemplateTimeLine from '../InspectionUtils/TemplateTimeLine.vue'
import AddTemplateItemParams from '@/features/setting/TemplateItem/Core/params/addTemplateItemParams'
import AddTemplateController from '@/features/setting/Template/Presentation/controllers/addTemplateController'
import { useRouter } from 'vue-router'
import TemplateImage from '@/features/setting/TemplateItem/Presentation/components/TemplateTypes/TemplateImage.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { useI18n } from 'vue-i18n'
// import TemplateTimeLine from '../../InspectionUtils/TemplateTimeLine.vue

const visible = ref(false)
const { t } = useI18n()
const emit = defineEmits(['update:data', 'update:templateId'])
const validationErrors = ref<Record<string, string>>({})

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

onMounted(() => {
  fetchLang()
})
interface items {
  title: string
  is_upload: boolean
  isTextAreaRequired: boolean
  textarea_type: number
  has_auto_observation: boolean
}

const buildOptions = (templateItems: any[]): items[] => {
  return templateItems.map((item) => ({
    title: item.text,
    is_upload: item.isUplaod,
    isTextAreaRequired: item.isTextarea,
    textarea_type: item.textareaType ?? 0,
    has_auto_observation: item.isObservation,
    normal_textarea: true,
  }))
}
const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  console.log(TemplateData.value, 'TemplateData.value')
  const items = (TemplateData.value || []).map((item) => {
    return new AddTemplateItemParams(
      null,
      item.itemTitle,
      item.SelectedActionType?.id,
      buildOptions(item.TemplateItems),
      item.isUpdloadImage || 0,
      item.ImageStatus || 0,
      item.itemTag,
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
  )

  console.log(params, 'params')
  emit('update:data', params)
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
  if (Object.keys(validationErrors.value).length) validateTemplate()
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
  updateData()
  if (Object.keys(validationErrors.value).length) validateTemplate()
}

const TemplateData = ref<any[]>([])
const GetTemplateData = (data) => {
  TemplateData.value = data
  console.log(TemplateData.value, 'TemplateData.value')
  if (Object.keys(validationErrors.value).length) validateTemplate()
}

const addTemplateController = AddTemplateController.getInstance()

const router = useRouter()

const validateTemplate = () => {
  const errors: Record<string, string> = {}

  if (!langs.value.some((lang) => lang.title?.trim())) {
    errors.templateTitle = t('template_title_required')
  }
  if (!SelectedTemplateType.value?.id) {
    errors.templateType = t('template_type_required')
  }
  if (!TemplateData.value.length) {
    errors.items = t('template_item_required')
  }

  TemplateData.value.forEach((item, itemIndex) => {
    const itemNumber = itemIndex + 1
    if (!item.itemTitle?.trim()) {
      errors[`items.${itemIndex}.title`] = t('inspection_item_title_required', { item: itemNumber })
    }
    if (!item.itemTag?.trim()) {
      errors[`items.${itemIndex}.tag`] = t('inspection_item_tag_required', { item: itemNumber })
    }
    if (!item.SelectedActionType?.id) {
      errors[`items.${itemIndex}.type`] = t('result_type_required', { item: itemNumber })
    }

    if (item.SelectedActionType?.id !== TemplateItemActionsEnum.TEXTAREA) {
      const answers = Array.isArray(item.TemplateItems) ? item.TemplateItems : []
      if (!answers.length || !answers.some((answer: any) => answer.text?.trim())) {
        errors[`items.${itemIndex}.answers`] = t('result_answer_required', { item: itemNumber })
      }
      answers.forEach((answer: any, answerIndex: number) => {
        if (!answer.text?.trim()) {
          errors[`items.${itemIndex}.answers.${answerIndex}`] = t('result_answer_text_required', {
            answer: answerIndex + 1,
            item: itemNumber,
          })
        }
      })
    }
  })

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const showFirstValidationError = async () => {
  const firstMessage = Object.values(validationErrors.value)[0]
  if (!firstMessage) return
  new OpenWarningDilaog(firstMessage).openDialog()
  await nextTick()
  document.querySelector<HTMLElement>('[data-template-validation-error="true"]')?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const addTemplate = async (isInLibrary: number) => {
  if (!validateTemplate()) {
    await showFirstValidationError()
    return
  }
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const items = (TemplateData.value || []).map((item) => {
    return new AddTemplateItemParams(
      null,
      item.itemTitle,
      item.SelectedActionType?.id,
      buildOptions(item.TemplateItems),
      item.isUpdloadImage || 0,
      item.ImageStatus || 0,
      item.itemTag,
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
    isInLibrary,
  )
  const state = await addTemplateController.addTemplate(params as AddTemplateParams, router)
  if (state?.value.data) {
    emit('update:templateId', {
      templateId: state?.value.data.id,
      teamplateTitle: state?.value.data.title,
      isInLibrary: isInLibrary,
    })
  }
  visible.value = false
}

watch(
  () => visible.value,
  (newVal) => {
    console.log(newVal, 'Newval')
    if (!newVal) {
      TemplateData.value = []
      langs.value = []
      SelectedTemplateType.value = null
      image.value = null
      validationErrors.value = {}
    }
  },
)
</script>

<template>
  <div class="add-new-template-btn flex gap-2" @click="visible = true">
    <div class="add-template-icon-shell">
      <AddNewTemplateIcon />
    </div>
    <div class="add-new-template-header">
      <div class="flex items-center">
        <span class="title">{{ $t('new_template') }}</span>
        <NewTemplateArrowIcon />
      </div>
      <p class="descripetion">
        {{
          $t(
            'you can customize a new templet from here and you can use it once or save it to your collection',
          )
        }}
      </p>
    </div>
  </div>

  <Dialog
    v-model:visible="visible"
    modal
    :dissmissible-mask="true"
    :style="{ width: 'min(1120px, 92vw)', height: '84vh' }"
    :breakpoints="{ '1199px': '88vw', '575px': '96vw' }"
    class="add-new-template-dialog-container"
  >
    <template #header>
      <div class="add-new-template-dialog-header">
        <p class="title">{{ $t('create new template') }}</p>
        <p>{{ $t('follow the steps to add your templet now') }}</p>
      </div>
    </template>

    <!-- BODY -->
    <div class="dialog-body">
      <div class="inspection-template-dialog-data grid grid-cols-4 gap-4">
        <hr class="inspection-template-dialog-divider col-span-4" />

        <div
          class="template-field-panel col-span-4 md:col-span-2"
          :data-template-validation-error="Boolean(validationErrors.templateTitle)"
        >
          <LangTitleInput
            :langs="langDefault"
            :modelValue="langs"
            @update:modelValue="setLangs"
            :label="`Template title`"
          />
          <p v-if="validationErrors.templateTitle" class="required-field-message">
            {{ validationErrors.templateTitle }}
          </p>
        </div>

        <!-- :data-template-validation-error="Boolean(validationErrors.templateType)" -->
        <div class="template-field-panel col-span-4 md:col-span-2">
          <CustomSelectInput
            :modelValue="SelectedTemplateType"
            :staticOptions="TemplateTypes"
            :required="true"
            :label="$t('Template Type')"
            id="TemplateType"
            :placeholder="$t('Select Template Type')"
            @update:modelValue="setTemplateType"
          />
          <!-- <p v-if="validationErrors.templateType" class="required-field-message">{{ validationErrors.templateType }}</p> -->
        </div>

        <TemplateTimeLine
          :visable="visible"
          :validation-errors="validationErrors"
          @update:data="GetTemplateData"
        />
      </div>
    </div>

    <!-- FOOTER FIXED -->
    <div class="dialog-footer">
      <button class="btn btn-primary" @click="addTemplate(1)">
        {{ $t('use & save to library') }}
      </button>
      <button class="btn btn-secondary" @click="addTemplate(0)">
        {{ $t('use only this time') }}
      </button>
    </div>
  </Dialog>
</template>

<style scoped>
.add-new-template-btn {
  position: relative;
  isolation: isolate;
  align-items: center;
  width: 100%;
  padding: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 16%, transparent);
  border-radius: 18px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface-1) 96%, transparent),
      color-mix(in srgb, var(--brand-primary-50) 90%, transparent)
    ),
    radial-gradient(
      circle at 12% 18%,
      color-mix(in srgb, var(--status-success) 16%, transparent),
      transparent 32%
    ),
    radial-gradient(
      circle at 94% 12%,
      color-mix(in srgb, var(--brand-primary-500) 16%, transparent),
      transparent 28%
    );
  box-shadow: 0 16px 38px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.add-new-template-btn::before {
  position: absolute;
  inset-inline-start: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  content: '';
  border-radius: 999px;
  background: linear-gradient(180deg, var(--brand-primary-500), var(--status-success));
}

.add-new-template-btn:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 34%, transparent);
  box-shadow: 0 20px 48px color-mix(in srgb, var(--brand-primary-500) 14%, transparent);
}

.add-template-icon-shell {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--brand-primary-800));
  box-shadow: 0 12px 24px color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
}

.add-template-icon-shell :deep(svg) {
  width: 26px;
  height: 26px;
}

.add-new-template-header {
  min-width: 0;
}

.add-new-template-header .title {
  color: var(--brand-primary-800);
  font-size: var(--md-size-2);
  font-weight: 800;
}

.add-new-template-header .descripetion {
  max-width: 720px;
  margin-top: 4px;
  color: var(--text-soft);
  font-size: var(--sm-size);
  line-height: 1.55;
}

:global(.add-new-template-dialog-container) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 92%, transparent);
  border-radius: 24px !important;
  background: var(--brand-primary-50);
  box-shadow: 0 28px 90px color-mix(in srgb, var(--brand-primary-900) 18%, transparent);
}

:global(.add-new-template-dialog-container .p-dialog-header) {
  padding: 20px 24px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary-100) 72%, transparent);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface-1) 98%, transparent),
      color-mix(in srgb, var(--brand-primary-50) 94%, transparent)
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--brand-primary-500) 8%, transparent),
      color-mix(in srgb, var(--status-success) 8%, transparent)
    );
}

:global(.add-new-template-dialog-container .add-new-template-dialog-header) {
  align-items: flex-start !important;
  text-align: start;
}

:global(.add-new-template-dialog-container .add-new-template-dialog-header .title) {
  color: var(--brand-primary-800);
  font-size: var(--xl-size-1);
  font-weight: 800;
}

:global(.add-new-template-dialog-container .add-new-template-dialog-header p:not(.title)) {
  margin-top: 4px;
  color: var(--text-soft);
  font-size: var(--sm-size);
}

:global(.add-new-template-dialog-container .p-dialog-content) {
  background: var(--brand-primary-50);
}

:global(.add-new-template-dialog-container .dialog-body) {
  padding: 18px 22px 22px;
}

:global(.add-new-template-dialog-container .inspection-template-dialog-data) {
  align-items: start;
}

.template-field-panel {
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 78%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-1) 86%, transparent);
  box-shadow: 0 10px 26px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
}

.inspection-template-dialog-divider {
  margin: 0;
  border-color: color-mix(in srgb, var(--brand-primary-100) 86%, transparent);
}

.required-field-message {
  margin-top: 7px;
  color: var(--status-danger);
  font-size: 12px;
  font-weight: 700;
}

[data-template-validation-error='true'] {
  border-color: color-mix(in srgb, var(--status-danger) 55%, transparent) !important;
}

:global(.add-new-template-dialog-container .dialog-footer) {
  gap: 12px;
  padding: 14px 22px 18px;
  border-top: 1px solid color-mix(in srgb, var(--brand-primary-100) 88%, transparent);
  background: color-mix(in srgb, var(--surface-1) 94%, transparent);
  box-shadow: 0 -12px 30px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
}

:global(.add-new-template-dialog-container .dialog-footer .btn) {
  min-height: 46px;
  border-radius: 14px;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

:global(.add-new-template-dialog-container .dialog-footer .btn:hover) {
  transform: translateY(-1px);
}

:global(.add-new-template-dialog-container .dialog-footer .btn-primary) {
  box-shadow: 0 14px 24px color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
}

@media (max-width: 768px) {
  .add-new-template-btn {
    align-items: flex-start;
    padding: 14px;
  }

  .add-template-icon-shell {
    flex-basis: 42px;
    width: 42px;
    height: 42px;
    border-radius: 14px;
  }

  :global(.add-new-template-dialog-container .dialog-body) {
    padding: 14px;
  }

  :global(.add-new-template-dialog-container .dialog-footer) {
    flex-direction: column;
  }

  :global(.add-new-template-dialog-container .dialog-footer button) {
    width: 100%;
  }
}
</style>
