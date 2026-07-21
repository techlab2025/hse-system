<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import Dialog from 'primevue/dialog'
import InspectionTemplateImage from '@/assets/images/check-list.png'
import { onMounted, ref, watch } from 'vue'
import IndexTemplateController from '@/features/setting/Template/Presentation/controllers/indexTemplateController'
import IndexTemplateParams from '@/features/setting/Template/Core/params/indexTemplateParams'
import TemplateSelector from '../InspectionUtils/TemplateSelector.vue'
import DeleteTemplateIcon from '@/shared/icons/DeleteTemplateIcon.vue'
import AddNewTemplateDialog from './AddNewTemplateDialog.vue'
import { TemplateTypeEnum } from '../../../Core/Enum/TemplateTypeEnum'

const visible = ref(false)
const isConfirmed = ref(false)

const indexTemplateController = IndexTemplateController.getInstance()
const state = ref(indexTemplateController.state.value)

const selectedTemplates = ref<number>()

const fetchTemplateItem = async () => {
  const deleteTemplateItemTypeParams = new IndexTemplateParams(
    '',
    1,
    30,
    1,
    null,
    true,
    SelectedTemplateType.value,
  )
  await indexTemplateController.getData(deleteTemplateItemTypeParams)
}

onMounted(() => {
  if (visible) fetchTemplateItem()
})

watch(
  () => indexTemplateController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  { deep: true },
)

const emit = defineEmits(['update:data', 'update:isInLibrary'])
const sendTemplatesId = () => {
  isConfirmed.value = true
  emit('update:data', selectedTemplates.value)
  emit('update:isInLibrary', isInLibrary.value)
  visible.value = false
}

const selectedTemplateHeader = ref()
const GetTemplateId = (data: number) => {
  selectedTemplates.value = data
  selectedTemplateHeader.value = state.value.data?.find((item) => item.id === data)
  emit('update:data', selectedTemplates.value || TemplateId.value)
  emit('update:isInLibrary', isInLibrary.value)
  // visible.value = false
  // ShowTemplate.value = true
}

const TemplateTitle = ref()
const isInLibrary = ref()

const clearSelectedTemplate = () => {
  selectedTemplates.value = undefined
  TemplateId.value = undefined
  emit('update:data', selectedTemplates.value || TemplateId.value)
  emit('update:isInLibrary', isInLibrary.value)
  // ShowTemplate.value = false
  visible.value = false
  TemplateTitle.value = ''
}

const TemplateId = ref()

const GetTemplateInfo = (data: {
  templateId: number
  isInLibrary: number
  teamplateTitle: string
}) => {
  TemplateId.value = data.templateId
  isInLibrary.value = data.isInLibrary
  TemplateTitle.value = data.teamplateTitle
  emit('update:data', data.templateId)
  emit('update:isInLibrary', data.isInLibrary)
  isConfirmed.value = true
  visible.value = false
  // ShowTemplate.value = true
  fetchTemplateItem()
}

const ShowTemplate = ref(true)
// remove item if colse dialog
const removeItem = () => {
  selectedTemplates.value = undefined
  TemplateId.value = undefined
  emit('update:data', selectedTemplates.value || TemplateId.value)
  emit('update:isInLibrary', isInLibrary.value)
  visible.value = false
  TemplateTitle.value = ''
}

const handleDialogHide = () => {
  if (!isConfirmed.value) {
    removeItem()
  }
  isConfirmed.value = false
}

// 1 my template
// 2 system template
const SelectedTemplateType = ref(1)
watch(
  () => SelectedTemplateType.value,
  () => {
    fetchTemplateItem()
  },
)
</script>

<template>
  <div class="inspection-template-dialog-container">
    <div class="input-wrapper template-picker-field field-required">
      <div class="title">
        <span>{{ $t('inspection template') }}</span>
        <span class="required">*</span>
      </div>

      <button type="button" @click="visible = true" class="inspection-template-button">
        <span class="picker-button-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 6h8M8 10h8M8 14h5" />
            <rect x="4" y="3" width="16" height="18" rx="4" />
          </svg>
        </span>
        <span class="picker-button-copy">
          <strong>{{ $t('select inspection template') }}</strong>
          <small>{{ $t('Choose a checklist from your library or the system collection') }}</small>
        </span>
        <span class="picker-button-arrow" aria-hidden="true">→</span>
      </button>

      <div class="template-header" v-if="selectedTemplates || TemplateTitle">
        <span class="selected-template-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="m7 12 3 3 7-7" /></svg>
        </span>
        <div class="selected-template-copy">
          <span>{{ $t('Selected template') }}</span>
          <p class="header-title">
            {{ TemplateTitle || selectedTemplateHeader?.title }}
          </p>
        </div>
        <button
          type="button"
          class="delete"
          :aria-label="$t('remove selected template')"
          @click.prevent="clearSelectedTemplate"
        >
          <DeleteTemplateIcon class="delete-icon" />
        </button>
      </div>
    </div>

    <Dialog
      v-model:visible="visible"
      @hide="handleDialogHide"
      modal
      :dissmissible-mask="true"
      :style="{ width: 'min(1120px, 86vw)', height: '84vh' }"
      :breakpoints="{ '1199px': '90vw', '575px': '96vw' }"
      class="inspection-template-dialog"
    >
      <template #header>
        <div class="add-equipment-header">
          <HeaderSection
            :img="InspectionTemplateImage"
            :title="$t('inspection template')"
            :subtitle="$t('Select from the available templates.')"
          />
        </div>
      </template>

      <div class="inspection-template-dialog-data">
        <div class="template-dialog-toolbar">
          <!-- <div class="toolbar-copy"> -->
            <!-- <span>{{ $t('Template library') }}</span>
            <p>{{ $t('Select the checklist that best matches this inspection') }}</p> -->
          <!-- </div> -->
          <div class="add-new-template">
            <AddNewTemplateDialog :visible="visible" @update:templateId="GetTemplateInfo" />
          </div>
        </div>

        <div class="fillter-system-templets" role="radiogroup" :aria-label="$t('template source')">
          <div
            @click="SelectedTemplateType = TemplateTypeEnum.SystemTemplate"
            class="system-templets"
            :class="SelectedTemplateType == TemplateTypeEnum.SystemTemplate ? 'active' : ''"
          >
            <input
              id="system-templates"
              type="radio"
              name="template-source"
              v-model="SelectedTemplateType"
              :value="TemplateTypeEnum.SystemTemplate"
            />
            <label for="system-templates">{{ $t('system templets') }}</label>
          </div>
          <div
            @click="SelectedTemplateType = TemplateTypeEnum.MyTemplate"
            class="system-templets"
            :class="SelectedTemplateType == TemplateTypeEnum.MyTemplate ? 'active' : ''"
          >
            <input
              id="my-templates"
              type="radio"
              name="template-source"
              v-model="SelectedTemplateType"
              :value="TemplateTypeEnum.MyTemplate"
            />
            <label for="my-templates">{{ $t('my templets') }}</label>
          </div>
        </div>

        <div class="inspection-templates-items">
          <TemplateSelector
            :data="state.data"
            @update:data="GetTemplateId"
            :selectedTemplates="selectedTemplates"
          />
        </div>
      </div>
      <button type="button" class="confirm-btn btn btn-primary" @click="sendTemplatesId">
        {{ $t('confirm') }}
      </button>
    </Dialog>
  </div>
</template>

<style scoped>
.inspection-template-dialog-container {
  width: 100%;
  min-width: 0;
}

.template-picker-field {
  min-width: 0;
  gap: 0.65rem;
  padding-top: 0 !important;
}

.template-picker-field .title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.inspection-template-button {
  display: grid;
  width: 100%;
  min-height: 5rem;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8rem;
  border: 1px dashed color-mix(in srgb, var(--brand-primary-500) 38%, var(--main-border)) !important;
  border-radius: 1rem !important;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--brand-primary-500) 9%, transparent),
      transparent 40%
    ),
    var(--surface-1);
  padding: 0.85rem !important;
  color: var(--text-strong) !important;
  text-align: start !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.inspection-template-button:hover {
  transform: translateY(-1px);
  border-color: var(--brand-primary-500) !important;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.picker-button-icon,
.selected-template-check {
  display: inline-flex;
  width: 2.6rem;
  height: 2.6rem;
  flex: 0 0 2.6rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
}

.picker-button-icon {
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.picker-button-icon svg,
.selected-template-check svg {
  width: 1.3rem;
  height: 1.3rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.picker-button-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.2rem;
}

.picker-button-copy strong {
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 0.88rem;
}

.picker-button-copy small {
  color: var(--text-muted);
  font-size: 0.73rem;
  line-height: 1.35;
  white-space: normal;
}

.picker-button-arrow {
  color: var(--brand-primary-500);
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

:global([dir='rtl']) .picker-button-arrow {
  transform: rotate(180deg);
}

.inspection-template-button:hover .picker-button-arrow {
  transform: translateX(3px);
}

:global([dir='rtl']) .inspection-template-button:hover .picker-button-arrow {
  transform: rotate(180deg) translateX(3px);
}

.template-header {
  display: flex !important;
  min-height: 4rem;
  align-items: center !important;
  gap: 0.7rem !important;
  border: 1px solid color-mix(in srgb, var(--status-success) 24%, transparent);
  border-radius: 1rem !important;
  background: linear-gradient(135deg, var(--status-success-soft), var(--surface-1)) !important;
  padding: 0.75rem !important;
}

.selected-template-check {
  background: var(--status-success);
  color: var(--text-on-brand);
}

.selected-template-copy {
  min-width: 0;
  flex: 1;
}

.selected-template-copy > span {
  color: var(--status-success);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.template-header .header-title {
  overflow: hidden;
  margin: 0.15rem 0 0 !important;
  color: var(--text-strong) !important;
  padding: 0 !important;
  font-size: 0.9rem !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.template-header .delete {
  position: static !important;
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--status-danger-soft);
  transition: 0.2s ease;
}

.template-header .delete:hover {
  transform: scale(1.06);
  background: color-mix(in srgb, var(--status-danger) 18%, var(--surface-1));
}

.template-header .delete-icon {
  width: 1.15rem !important;
  height: 1.15rem !important;
  padding: 0 !important;
  background: transparent !important;
}

.inspection-template-dialog :deep(.p-dialog-header) {
  border-bottom: 1px solid var(--main-border);
  background: linear-gradient(135deg, var(--surface-1), var(--brand-primary-50));
  padding: 1rem 1.2rem;
}

.inspection-template-dialog :deep(.p-dialog-content) {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface-2);
  padding: 0 !important;
}

.inspection-template-dialog-data {
  flex: 1;
  min-height: 0;
  overflow-y: auto !important;
  padding: 1rem 1.1rem 0;
  scrollbar-color: var(--brand-primary-200) transparent;
  scrollbar-width: thin;
}

.template-dialog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  /* border: 1px solid var(--main-border); */
  border-radius: 1rem;
  background: var(--surface-1);
  /* padding: 0.85rem; */
  width:100%;
}

.toolbar-copy span {
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 0.95rem;
}

.toolbar-copy p {
  margin: 0.2rem 0 0;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.add-new-template {
  flex: 0 0 auto;
  margin: 0 !important;
  border: 0 !important;
  background: transparent !important;
  padding: 0 !important;
  width: 100%;
}

.fillter-system-templets {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem !important;
  margin: 0.8rem 0 !important;
  border: 1px solid var(--main-border);
  border-radius: 1rem;
  background: var(--surface-1);
  padding: 0.35rem;
}

.fillter-system-templets .system-templets {
  width: 100% !important;
  border: 1px solid transparent;
  border-radius: 0.75rem !important;
  background: transparent !important;
  padding: 0.65rem !important;
  transition: 0.2s ease;
}

.fillter-system-templets .system-templets:hover {
  background: var(--surface-2) !important;
}

.fillter-system-templets .system-templets.active {
  border-color: color-mix(in srgb, var(--brand-primary-500) 28%, transparent) !important;
  background: var(--brand-primary-50) !important;
  box-shadow: 0 6px 15px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
}

.fillter-system-templets .system-templets label {
  color: var(--text-soft) !important;
  font-size: 0.82rem !important;
  cursor: pointer;
}

.fillter-system-templets .system-templets.active label {
  color: var(--brand-primary-600) !important;
}

.inspection-templates-items {
  height: auto !important;
  min-height: 0;
  margin-top: 0 !important;
  padding: 0 0 1rem !important;
}

.inspection-templates-items :deep(.template-selector-container-AccordionPanel) {
  gap: 0.8rem !important;
}

.inspection-templates-items :deep(.panel-acc) {
  overflow: hidden;
  border: 1px solid var(--main-border) !important;
  border-radius: 1rem !important;
  background: var(--surface-1) !important;
  padding: 0.75rem !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.inspection-templates-items :deep(.panel-acc:hover) {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 32%, var(--main-border)) !important;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.inspection-templates-items :deep(.panel-acc.active) {
  border: 1px solid var(--brand-primary-500) !important;
  background: linear-gradient(145deg, var(--brand-primary-50), var(--surface-1)) !important;
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.confirm-btn {
  width: calc(100% - 2.2rem);
  min-height: 2.8rem;
  flex: 0 0 auto;
  margin: 0.75rem 1.1rem 1rem;
  border-radius: 0.9rem;
  box-shadow: 0 9px 20px color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
}

.required {
  color: var(--status-danger) !important;
}

@media (max-width: 700px) {
  .template-dialog-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .fillter-system-templets,
  .inspection-templates-items :deep(.template-selector-container-AccordionPanel) {
    grid-template-columns: 1fr !important;
  }

  .picker-button-copy small {
    display: none;
  }

  .inspection-template-dialog-data {
    padding-inline: 0.75rem;
  }

  .confirm-btn {
    width: calc(100% - 1.5rem);
    margin-inline: 0.75rem;
  }
}
</style>
