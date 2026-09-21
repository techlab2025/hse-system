<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import IndexTemplateController from '@/features/setting/Template/Presentation/controllers/indexTemplateController'
import IndexTemplateParams from '@/features/setting/Template/Core/params/indexTemplateParams'
import SelectTemplatesOfPermits from './SelectTemplatesOfPermits.vue'
import { useRoute } from 'vue-router'

// const isConfirmed = ref(false)

// const sendTemplatesId = () => {
//   isConfirmed.value = true
//   emit('update:data', selectedTemplates.value)
//   emit('update:isInLibrary', isInLibrary.value)
//   visible.value = false
// }

// const clearSelectedTemplate = () => {
//   selectedTemplates.value = undefined
//   TemplateId.value = undefined
//   emit('update:data', selectedTemplates.value || TemplateId.value)
//   emit('update:isInLibrary', isInLibrary.value)
//   // ShowTemplate.value = false
//   visible.value = false
//   TemplateTitle.value = ''
// }

// const GetTemplateInfo = (data: {
//   templateId: number
//   isInLibrary: number
//   teamplateTitle: string
// }) => {
//   TemplateId.value = data.templateId
//   isInLibrary.value = data.isInLibrary
//   TemplateTitle.value = data.teamplateTitle
//   emit('update:data', data.templateId)
//   emit('update:isInLibrary', data.isInLibrary)
//   isConfirmed.value = true
//   visible.value = false
//   // ShowTemplate.value = true
//   fetchTemplateItem()
// }

// const ShowTemplate = ref(true)

// const handleDialogHide = () => {
//   if (!isConfirmed.value) {
//     removeItem()
//   }
//   isConfirmed.value = false
// }
// remove item if colse dialog
// const removeItem = () => {
//   selectedTemplates.value = undefined
//   TemplateId.value = undefined
//   emit('update:data', selectedTemplates.value || TemplateId.value)
//   emit('update:isInLibrary', isInLibrary.value)
//   visible.value = false
//   TemplateTitle.value = ''
// }

// const visible = ref(false)
// const TemplateTitle = ref()
//
const indexTemplateController = IndexTemplateController.getInstance()
const state = ref(indexTemplateController.state.value)

const SelctedType = ref<number>(0)
const selectedTemplates = ref<number>()

const fetchTemplateItem = async (type?: number) => {
  const deleteTemplateItemTypeParams = new IndexTemplateParams('', 1, 30, 1, null, true, type!, '4')
  await indexTemplateController.getData(deleteTemplateItemTypeParams)
}

onMounted(() => {
  fetchTemplateItem(0)
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

const selectedTemplateHeader = ref()
const GetTemplateId = (data: number) => {
  selectedTemplates.value = data
  selectedTemplateHeader.value = state.value.data?.find((item) => item.id === data)
  emit('update:data', selectedTemplates.value || TemplateId.value)
  emit('update:isInLibrary', isInLibrary.value)
  // visible.value = false
  // ShowTemplate.value = true
}

const isInLibrary = ref()

const TemplateId = ref()

// 1 my template
// 2 system template
const SelectedTemplateType = ref(1)
watch(
  () => SelectedTemplateType.value,
  () => {
    fetchTemplateItem()
  },
)
const SelectTemplatesType = (type: number) => {
  SelctedType.value = type
  if (type == 1) {
    fetchTemplateItem(1)
  } else {
    fetchTemplateItem(0)
  }
}
const route = useRoute()
</script>

<template>
  <!-- <div class="buttons">
    <button
      class="temp-btn"
      :class="SelctedType == 1 ? `active` : ``"
      @click.prevent="SelectTemplatesType(1)"
    >
      System Templates
    </button>
    <button
      class="temp-btn"
      :class="SelctedType == 0 ? `active` : ``"
      @click.prevent="SelectTemplatesType(0)"
    >
      Organization Templates
    </button>
  </div> -->

  <div class="template-switcher">
    <button
      class="template-btn"
      :class="{ active: SelctedType === 1 }"
      @click.prevent="SelectTemplatesType(1)"
    >
      <!-- <span class="icon">
        <i class="pi pi-th-large"></i>
      </span> -->

      <span class="content">
        <span class="title">System Templates</span>
        <span class="description">Default templates provided by the system</span>
      </span>
    </button>

    <button
      class="template-btn"
      :class="{ active: SelctedType === 0 }"
      @click.prevent="SelectTemplatesType(0)"
    >
      <!-- <span class="icon">
        <i class="pi pi-building"></i>
      </span> -->

      <span class="content">
        <span class="title">Organization Templates</span>
        <span class="description">Templates created by your organization</span>
      </span>
    </button>
  </div>

  <SelectTemplatesOfPermits
    :data="state.data!"
    @update:data="GetTemplateId"
    :selectedTemplates="selectedTemplates"
  />
  <div class="btn-container" v-if="selectedTemplates != null">
    <router-link
      class="btn btn-primary"
      :to="{
        path: `/organization/project-permit/project/templates/answer`,
        query: {
          template_id: selectedTemplates,
          permit_id: route.query.permit_id,
          project_id: route.query.project_id,
        },
      }"
      >Submit</router-link
    >
  </div>
</template>

<style scoped>
.btn-container {
  width: 100%;
  padding-top: 20px;
  .btn-primary {
    margin: 10px;
    width: 50%;
    margin-top: auto;
  }
}
.buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;
  .temp-btn {
    border: 1px solid rgb(238, 238, 238);
    padding: 10px;
    border-radius: 8px;
    transition: 0.3s all linear;
    &.active {
      background-color: rgb(234, 245, 248);
    }
  }
  button {
    width: 50%;
  }
}
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
  width: 100%;
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

/*new btn styles */
.template-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  padding: 6px;
}

.template-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;

  width: 100%;
  min-height: 110px;
  padding: 18px;

  border: 1px solid #e8ebf0;
  border-radius: 18px;

  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%);

  cursor: pointer;
  overflow: hidden;

  text-align: start;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;

    width: 4px;
    height: 100%;

    background: #6366f1;

    opacity: 0;
    transform: scaleY(0.4);

    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;

    width: 130px;
    height: 130px;

    border-radius: 50%;
    background: rgba(99, 102, 241, 0.08);

    transform: scale(0);
    transition: transform 0.35s ease;

    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);

    border-color: rgba(99, 102, 241, 0.3);

    box-shadow:
      0 12px 30px rgba(15, 23, 42, 0.08),
      0 4px 12px rgba(15, 23, 42, 0.04);

    &::after {
      transform: scale(1);
    }

    .icon {
      transform: scale(1.07);
      background: rgba(99, 102, 241, 0.12);
    }
  }

  &.active {
    border-color: rgba(99, 102, 241, 0.45);

    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 1) 65%);

    box-shadow:
      0 12px 30px rgba(99, 102, 241, 0.1),
      inset 0 0 0 1px rgba(99, 102, 241, 0.04);

    &::before {
      opacity: 1;
      transform: scaleY(1);
    }

    .icon {
      color: #ffffff;

      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);

      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.28);
    }

    .title {
      color: #4338ca;
    }
  }

  .icon {
    position: relative;
    z-index: 1;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 54px;
    height: 54px;

    border-radius: 15px;

    color: #6366f1;
    background: #f1f3ff;

    transition:
      transform 0.25s ease,
      background 0.25s ease,
      color 0.25s ease,
      box-shadow 0.25s ease;

    i {
      font-size: 22px;
    }
  }

  .content {
    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    gap: 6px;

    min-width: 0;
  }

  .title {
    font-size: 15px;
    font-weight: 700;
    line-height: 1.4;

    color: #111827;

    transition: color 0.25s ease;
  }

  .description {
    max-width: 320px;

    font-size: 13px;
    font-weight: 400;
    line-height: 1.6;

    color: #6b7280;
  }
}

@media (max-width: 768px) {
  .template-switcher {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .template-btn {
    min-height: 96px;
    padding: 15px;
  }
}
</style>
