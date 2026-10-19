<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import type TaskFullResponseModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FullTaskResultModel'
import FetchTaskResultController from '@/features/Organization/Inspection/Presentation/controllers/FetchTaskResultController'
import FetchTaskResultParams from '@/features/Organization/Inspection/Core/params/FetchTaskResultParams'
import TemplateDocument from '@/features/setting/TemplateItem/Presentation/components/TemplateDocument.vue'
import ProjectIcon from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectIcon.vue'
const props = defineProps<{
  templateId: number
  taskId: number
  status: number
  all_document?: TaskFullResponseModel
  isEquipment?: boolean
}>()
const { t, locale } = useI18n()
const visible = ref(false)
const loading = ref(false)
const error = ref('')
const document = ref<TemplateDetailsModel>()
let request = 0
async function openInspection() {
  visible.value = true
  loading.value = true
  error.value = ''
  document.value = undefined
  const current = ++request
  try {
    const state = await FetchTaskResultController.getInstance().getData(
      new FetchTaskResultParams(props.taskId),
    )
    if (current !== request) return
    document.value = state.value.data?.template
    if (!document.value) error.value = t('eq_load_failed')
  } catch {
    if (current === request) error.value = t('eq_load_failed')
  } finally {
    if (current === request) loading.value = false
  }
}
</script>
<template>
  <div class="eq-inspection-trigger">
    <button type="button" class="eq-inspection-details-button" @click="openInspection">
      {{ $t('eq_view_inspection') }}<ProjectIcon name="arrow-right" />
    </button>
    <Dialog
      v-model:visible="visible"
      modal
      :dismissable-mask="true"
      :header="
        document?.titles?.find((item) => item.locale === locale)?.title ||
        document?.title ||
        $t('Inspection')
      "
      :style="{ width: 'min(960px, 94vw)' }"
    >
      <p v-if="loading" role="status">{{ $t('eq_loading') }}</p>
      <div v-else-if="error" role="alert">
        <p>{{ error }}</p>
        <button type="button" class="btn btn-secondary" @click="openInspection">
          {{ $t('op.retry') }}
        </button>
      </div>
      <TemplateDocument
        v-else-if="document"
        :all-data="document"
        :header-display="false"
        :is-actions="false"
      />
    </Dialog>
  </div>
</template>
<style scoped>
.eq-inspection-details-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  color: var(--PrimaryColor);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}
.eq-inspection-details-button svg {
  width: 16px;
  height: 16px;
}
.eq-inspection-details-button svg:dir(rtl) {
  transform: rotate(180deg);
}
.eq-inspection-details-button:focus-visible {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 3px;
}
</style>
