<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import { useRoute, useRouter } from 'vue-router'
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
//id =  template_id / parent_id =tempalte_item_id

const id = Number(route.params.parent_id)
const templateid = Number(route.params?.id)
const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const SelectedComponent = ref<ActionsEnum>(3)
const TemplateData = ref()
const title = ref('')
const category = ref('')

const updateData = () => {
  // title.value = " "
  const params = !props.data?.id
    ? new AddTemplateItemParams(
        id,
        title.value,
        SelectedComponent.value,
        TemplateData.value,
        isUpdloadImage.value,
        ImageStatus.value,
        category.value,
      )
    : new EditTemplateItemParams(
        props.data.id ?? 0,
        id,
        title.value,
        SelectedComponent.value,
        TemplateData.value,
        isUpdloadImage.value,
        ImageStatus.value,
        category.value,
      )

  emit('update:data', params)
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
      SelectedComponent.value = newData.action
      title.value = newData.name
    }
  },
  { immediate: true },
)

const GetTemplateType = (data: ActionsEnum) => {
  SelectedComponent.value = data
  isUpdloadImage.value = false
  ImageStatus.value = 0
}

const ComponentsOptions = [
  { id: ActionsEnum.DROPDOWN, name: 'DropDown', component: DropDownType },
  { id: ActionsEnum.RADIOBUTTON, name: 'Radio Button', component: RadioButtonType },
  { id: ActionsEnum.CHECKBOX, name: 'Check Box', component: CheckboxType },
]

const selectedComponent = computed(() => {
  return ComponentsOptions.find((Component) => Component.id === SelectedComponent.value)
})

const GetData = (data: any) => {
  TemplateData.value = data
  // isUpdloadImage.value = false
  // ImageStatus.value = 0
}

watch(
  () => TemplateData.value,
  () => {
    updateData()
  },
)
watch(
  () => SelectedComponent.value,
  () => {
    updateData()
  },
)

const isUpdloadImage = ref()
const ImageStatus = ref()

const UpdateImageInfo = (data: any) => {
  isUpdloadImage.value = data.isUpdloadImage
  ImageStatus.value = data.ImageType
  updateData()
}

const ClearTitle = () => {
  updateData()
  title.value = ''
  // category.value = ''
}
</script>

<template>
  <div class="template-item-form-page w-full col-span-4">
    <PagesHeader
      :img="SmartContract"
      title="smart create for your inspection templet"
      subtitle="add your items one by one to the templet and you can see them"
    />
  </div>

  <div class="template-item-form-shell col-span-4 md:col-span-2">
    <div class="template-form-card">
      <div class="template-form-heading">
        <!-- <span class="template-form-step">01</span> -->
        <div>
          <p class="template-form-title">{{ $t('inspection_exemined_title') }}</p>
          <p class="template-form-subtitle">Build the item, options, and required evidence.</p>
        </div>
      </div>

      <div class="template-fields-grid">
        <div class="input-wrapper field-required">
          <label for="item-title">{{ $t('inspection_exemined_title') }}</label>
          <input
            type="text"
            id="item-title"
            v-model="title"
            class="input"
            placeholder="add your title here.."
            @input="updateData"
          />
        </div>
        <div class="input-wrapper field-required">
          <label for="item-category">{{ $t('inspection_exemined_tag') }}</label>
          <input
            type="text"
            id="item-category"
            v-model="category"
            class="input"
            placeholder="add your tepmlate item category.."
            @input="updateData"
          />
        </div>
      </div>
    </div>

    <div class="form-container template-builder-card">
      <TemplateTypesSection @update:data="GetTemplateType" />

      <component
        @update:data="GetData"
        :is="selectedComponent?.component"
        :id="selectedComponent.id"
        v-if="selectedComponent?.component"
      />

      <TemplateImage
        v-if="SelectedComponent != ActionsEnum.TEXTAREA"
        @update:data="UpdateImageInfo"
        :isUpdloadImage="isUpdloadImage"
      />

      <button class="btn add-btn w-full" type="submit" @click="ClearTitle">
        {{ $t('add_to_template') }}
      </button>
    </div>
  </div>
  <div class="template-preview-shell col-span-4 md:col-span-2">
    <ShowTemplate />
  </div>
</template>

<style scoped>
.template-item-form-page {
  margin-bottom: 8px;
}

.template-item-form-shell,
.template-preview-shell {
  min-width: 0;
}

.template-form-card,
.template-builder-card {
  width: 100%;
  border: 1px solid rgba(221, 226, 237, 0.8);
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 251, 255, 0.94)),
    linear-gradient(90deg, rgba(29, 78, 216, 0.04), rgba(74, 174, 58, 0.04));
  box-shadow: 0 18px 42px rgba(15, 25, 39, 0.06);
}

.template-form-card {
  padding: 16px;
  margin-bottom: 14px;
}

.template-form-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.template-form-step {
  display: inline-grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 14px;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  background: linear-gradient(135deg, #1d4ed8, #041953);
  box-shadow: 0 10px 18px rgba(29, 78, 216, 0.18);
}

.template-form-title {
  margin: 0;
  color: #041953;
  font-size: var(--md-size);
  font-weight: 900;
}

.template-form-subtitle {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.template-fields-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.template-fields-grid .input-wrapper {
  padding: 2px;
}

.template-fields-grid input {
  border: 1px solid rgba(221, 226, 237, 0.92) !important;
  background: #fff !important;
  box-shadow: 0 8px 18px rgba(15, 25, 39, 0.04);
}

.template-fields-grid input:focus {
  border-color: rgba(29, 78, 216, 0.52) !important;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1) !important;
}

.form-container {
  padding: 16px;
}

.form-container .add-btn {
  min-height: 46px;
  margin-top: 15px;
  border-radius: 15px;
  font-weight: 900;
  box-shadow: 0 14px 24px rgba(29, 78, 216, 0.16);
}

@media (max-width: 900px) {
  .template-fields-grid {
    grid-template-columns: 1fr;
  }
}
</style>
