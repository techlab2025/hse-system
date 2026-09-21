<script setup lang="ts">
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import ReadOnlyTemplateDocument from '@/features/setting/TemplateItem/Presentation/components/TemplateDocument.vue'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const props = defineProps<{
  templateId?: number
  template?: TemplateDetailsModel
}>()

const visible = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const document = ref<TemplateDetailsModel | undefined>(props.template)

const openTemplate = async () => {
  visible.value = true
  errorMessage.value = ''
  document.value = props.template

  if (!props.templateId) return

  loading.value = true

  try {
    const controller = ShowTemplateController.getInstance()
    const response = await controller.showTemplate(new ShowTemplateParams(props.templateId))

    if (response.value.data) {
      document.value = response.value.data
    }
  } catch (error) {
    if (!document.value) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to load template.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button class="template-preview-trigger" type="button" @click="openTemplate">
    <span class="template-preview-trigger__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" stroke-width="1.8" />
        <path
          d="M6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75Z"
          stroke="currentColor"
          stroke-width="1.8"
        />
      </svg>
    </span>
    <span>{{ $t('View audit template') }}</span>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :draggable="false"
    :header="$t('Audit template')"
    class="audit-template-preview-dialog"
    :style="{ width: 'min(68rem, calc(100vw - 24px))' }"
  >
    <div v-if="loading && !document" class="template-preview-state">
      {{ $t('Loading template...') }}
    </div>

    <div v-else-if="errorMessage" class="template-preview-state template-preview-state--error">
      {{ errorMessage }}
    </div>

    <div v-else-if="document" class="read-only-template">
      <ReadOnlyTemplateDocument :all-data="document" :header-display="true" :is-actions="false" />
    </div>

    <div v-else class="template-preview-state">
      {{ $t('No template found') }}
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.template-preview-trigger {
  display: inline-flex;
  width: 100%;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  font-size: 0.74rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--PrimaryColor);
    background: color-mix(in srgb, var(--PrimaryColor) 11%, var(--surface-1));
  }
}

.template-preview-trigger__icon {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
}

.template-preview-state {
  padding: 40px 20px;
  color: var(--text-soft);
  text-align: center;
}

.template-preview-state--error {
  color: var(--status-danger);
}

.read-only-template {
  pointer-events: none;
}
</style>
