<script setup lang="ts">
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import ReadOnlyTemplateDocument from '@/features/setting/TemplateItem/Presentation/components/TemplateDocument.vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import { computed, ref } from 'vue'

const props = defineProps<{
  questionsOnly?: boolean
  buttonLabel?: string
  dialogTitle?: string
  templateId?: number
  template?: TemplateDetailsModel
}>()

const { t, locale } = useI18n()
const visible = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const document = ref<TemplateDetailsModel | undefined>(props.template)

const questionGroups = computed(() => {
  const groups = (document.value?.templateItemTags ?? []).map((tag) => ({
    title: tag.titles?.find((title) => title.locale === locale.value)?.title || tag.title,
    items: tag.templateItems ?? [],
  }))
  const groupedIds = new Set(groups.flatMap((group) => group.items.map((item) => item.id)))
  const remaining = (document.value?.templateItems ?? []).filter((item) => !groupedIds.has(item.id))
  if (remaining.length) groups.push({ title: t('Questions'), items: remaining })
  return groups.filter((group) => group.items.length)
})

// Use the audit document layout while retaining every inspection question,
// including questions returned outside a tag group.
const previewDocument = computed(() => {
  if (!document.value || !props.questionsOnly) return document.value
  return {
    ...document.value,
    templateItemTags: questionGroups.value.map((group, index) => ({
      id: index,
      templateItemTagId: index,
      title: group.title,
      titles: [],
      templateItems: group.items,
    })),
  }
})

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
    <span>{{ buttonLabel || $t('View audit template') }}</span>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :draggable="false"
    :header="dialogTitle || $t('Audit template')"
    class="audit-template-preview-dialog"
    :style="{ width: 'min(68rem, calc(100vw - 24px))' }"
  >
    <div v-if="loading && (questionsOnly || !document)" class="template-preview-state">
      {{ $t('Loading template...') }}
    </div>

    <div v-else-if="errorMessage" class="template-preview-state template-preview-state--error">
      {{ errorMessage }}
    </div>

    <div v-else-if="previewDocument" class="read-only-template" :inert="questionsOnly">
      <ReadOnlyTemplateDocument
        :all-data="previewDocument"
        :header-display="true"
        :is-actions="false"
      />
    </div>

    <div v-else class="template-preview-state">
      {{ $t('No template found') }}
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.read-only-template {
  pointer-events: none;
}
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
</style>
