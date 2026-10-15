<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import { DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import {
  ObjectiveTargetTypeEnum as Type,
  ObjectiveDirectionEnum as Direction,
} from '../../../Core/enums/objectivesEnums'
import { useObjectiveProgress } from '../composables/useObjectiveProgress'
import {
  generatePeriods,
  actualUnit,
  validId,
  validateProgress,
  type ProgressDraft,
} from '../../Core/utils/objectiveProgress'
import {
  objectiveProgressContract as contract,
  supportsProgress,
} from '../../Data/apiServices/objectiveProgressContract'
import AddObjectiveProgressController from '../controllers/addObjectiveProgressController'
import EditObjectiveProgressController from '../controllers/editObjectiveProgressController'
import ObjectiveProgressDetailsController from '../controllers/objectiveProgressDetailsController'
import AddObjectiveProgressParams from '../../Core/params/addObjectiveProgressParams'
import EditObjectiveProgressParams from '../../Core/params/editObjectiveProgressParams'
import ObjectiveProgressDetailsParams from '../../Core/params/objectiveProgressDetailsParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import '../styles/objective-progress.css'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'

const { t, locale } = useI18n(),
  route = useRoute(),
  router = useRouter()
const { objective, objectiveId, loading, error, records, history, canUpdate, load, loadHistory } =
  useObjectiveProgress()
const editing = computed(() => route.name === 'organization-objectives-edit-progress')
const progressId = computed(() => validId(route.params.progressId))
const record = ref<ObjectiveProgressModel | null>(null)
const recordLoading = ref(false),
  recordError = ref(''),
  saving = ref(false),
  saveError = ref('')
const draft = reactive<ProgressDraft>({
  period: '',
  actualResult: null,
  notes: '',
  files: [],
  attachments: [],
  retainedAttachmentIds: [],
})
const errors = ref<Record<string, string>>({})
const periods = computed(() =>
  objective.value
    ? generatePeriods(objective.value, locale.value, new Date(), contract.reportingFrequency).map(
        (p) => ({
          ...p,
          disabled:
            !p.available ||
            (contract.duplicates === 'single' &&
              p.value !== record.value?.period &&
              records.value.some((r) => r.period === p.value)),
        }),
      )
    : [],
)
const supported = computed(
  () =>
    supportsProgress(editing.value ? 'edit' : 'add') &&
    (!editing.value || supportsProgress('details')),
)
const ready = computed(
  () =>
    canUpdate.value &&
    (!supported.value ||
      contract.duplicates !== 'single' ||
      history.value instanceof DataSuccess) &&
    !recordLoading.value &&
    (!editing.value || Boolean(record.value)) &&
    !saving.value,
)
const actualLabel = computed(() =>
  objective.value?.targetType === Type.PeriodicFrequency
    ? 'op.completed'
    : objective.value?.direction === Direction.Reduce
      ? 'op.currentActual'
      : 'op.cumulativeActual',
)
const existingFiles = computed(
  () =>
    record.value?.attachments.filter((file) => draft.retainedAttachmentIds.includes(file.id)) ?? [],
)
let generation = 0
onBeforeUnmount(() => {
  generation++
})
watch(objective, async (value) => {
  const request = ++generation
  record.value = null
  recordError.value = ''
  recordLoading.value = false
  saveError.value = ''
  errors.value = {}
  Object.assign(draft, {
    period: '',
    actualResult: null,
    notes: '',
    files: [],
    attachments: [],
    retainedAttachmentIds: [],
  })
  if (!value || !editing.value) return
  if (!progressId.value) {
    recordError.value = 'op.invalidRecord'
    return
  }
  if (!supportsProgress('details') || !supportsProgress('edit')) {
    recordError.value = 'op.correctionUnavailable'
    return
  }
  recordLoading.value = true
  const state = await ObjectiveProgressDetailsController.getInstance().getDetails(
    new ObjectiveProgressDetailsParams(value.id, progressId.value),
  )
  if (request !== generation) return
  recordLoading.value = false
  const data = state.value.data
  if (
    !(state.value instanceof DataSuccess) ||
    !data ||
    data.objectiveId !== value.id ||
    data.id !== progressId.value
  ) {
    recordError.value = 'op.loadFailed'
    return
  }
  record.value = data
  Object.assign(draft, {
    period: data.period,
    actualResult: data.actualResult,
    notes: data.notes ?? '',
    files: [],
    attachments: [],
    retainedAttachmentIds: data.attachments.map((f) => f.id),
  })
})
function selectedFiles(files: UploadedFile[]) {
  draft.files = files.flatMap((entry) => (entry.file ? [entry.file] : []))
  draft.attachments = files.map((entry) => entry.base64).filter(Boolean)
  if (objective.value && objectiveId.value) {
    const validation = validateProgress(objectiveId.value, objective.value, draft, {
      duplicates: contract.duplicates,
      existingPeriods: records.value.map((record) => record.period),
      ...contract.attachments,
    })
    if (validation.files) errors.value.files = validation.files
    else delete errors.value.files
  }
}
async function save() {
  if (saving.value || !objective.value || !objectiveId.value || !canUpdate.value) return
  errors.value = validateProgress(objectiveId.value, objective.value, draft, {
    duplicates: contract.duplicates,
    existingPeriods: records.value.map((r) => r.period),
    editingPeriod: record.value?.period,
    reportingFrequency: contract.reportingFrequency,
    ...contract.attachments,
  })
  if (Object.keys(errors.value).length) return

  const request = generation
  saving.value = true
  saveError.value = ''
  const id = objectiveId.value
  try {
    const state = editing.value
      ? await EditObjectiveProgressController.getInstance().editObjectiveProgress(
          new EditObjectiveProgressParams(id, progressId.value!, { ...draft }),
          router,
        )
      : await AddObjectiveProgressController.getInstance().addObjectiveProgress(
          new AddObjectiveProgressParams(id, { ...draft }),
          router,
        )
    if (request !== generation) return
    if (!(state.value instanceof DataSuccess)) {
      saveError.value = state.value.error?.title || t('op.saveFailed')
      return
    }
  } catch {
    saveError.value = t('op.saveFailed')
  } finally {
    saving.value = false
  }
}
</script>
<template>
  <main class="op-page">
    <header class="op-header">
      <div>
        <p class="op-eyebrow">{{ $t('Objectives') }}</p>
        <h1>{{ $t(editing ? 'op.correct' : 'op.update') }}</h1>
      </div>
      <RouterLink
        class="op-button"
        :to="
          objectiveId
            ? { name: 'organization-objectives-details', params: { objectiveId } }
            : { name: 'Objectives' }
        "
        >{{ $t('op.back') }}</RouterLink
      >
    </header>
    <TableLoader v-if="loading || recordLoading" :cols="2" :rows="4" />
    <div v-else-if="error || recordError || !canUpdate" class="op-card" role="alert">
      <p>{{ $t(error || recordError || 'op.forbidden') }}</p>
      <button
        v-if="error === 'op.loadFailed' || recordError === 'op.loadFailed'"
        type="button"
        class="op-button"
        @click="load"
      >
        {{ $t('op.retry') }}
      </button>
    </div>
    <template v-else-if="objective">
      <form class="op-card op-form" @submit.prevent="save" novalidate>
        <p class="op-muted">{{ $t('op.configurationReadOnly') }}</p>
        <div class="op-form-fields">
          <div class="op-field">
            <label for="objective-reporting-period">{{ $t('op.period') }} *</label
            ><Select
              input-id="objective-reporting-period"
              v-model="draft.period"
              :options="periods"
              option-label="label"
              option-value="value"
              option-disabled="disabled"
              :placeholder="$t('op.selectPeriod')"
              :disabled="saving"
              :invalid="!!errors.period"
              aria-describedby="period-help period-error"
            /><small id="period-help">{{ $t('op.periodHelp') }}</small
            ><small v-if="errors.period" id="period-error" class="op-error">{{
              $t(errors.period)
            }}</small>
          </div>
          <div class="op-field">
            <label for="objective-actual-result"
              >{{ $t(actualLabel) }} {{ actualUnit(objective) }} *</label
            ><InputNumber
              input-id="objective-actual-result"
              v-model="draft.actualResult"
              :min="0"
              :max-fraction-digits="objective.targetType === Type.PeriodicFrequency ? 0 : 8"
              :locale="locale"
              :use-grouping="false"
              :disabled="saving"
              :invalid="!!errors.actualResult"
              aria-describedby="actual-help actual-error"
            /><small id="actual-help">{{
              $t(
                contract.semantics === 'period-specific'
                  ? 'op.periodSpecificHelp'
                  : contract.semantics === 'cumulative'
                    ? 'op.cumulativeHelp'
                    : 'op.semanticsUnavailable',
              )
            }}</small
            ><small v-if="errors.actualResult" id="actual-error" class="op-error">{{
              $t(errors.actualResult)
            }}</small>
          </div>
        </div>
        <div class="op-field">
          <label for="objective-progress-notes">{{ $t('op.notes') }}</label
          ><Textarea
            id="objective-progress-notes"
            v-model="draft.notes"
            rows="4"
            :disabled="saving"
          />
        </div>
        <div class="op-field">
          <h2>{{ $t('op.attachments') }}</h2>

          <HandleFIlesUpload
            :multiple="!contract.attachments || contract.attachments.maxFiles > 1"
            :accept="contract.attachments?.acceptedTypes.join(',')"
            :max-files="
              contract.attachments
                ? Math.max(0, contract.attachments.maxFiles - existingFiles.length)
                : undefined
            "
            :readonly="saving"
            :have-content="true"
            @change="selectedFiles"
          >
            <template #content>
              <span>{{ $t('op.chooseFiles') }}</span>
            </template>
          </HandleFIlesUpload>
          <ul class="op-files">
            <li v-for="file in existingFiles" :key="file.id">
              {{ file.name }}
              <button
                class="op-button"
                type="button"
                :disabled="saving"
                :aria-label="`${$t('op.remove')} ${file.name}`"
                @click="
                  draft.retainedAttachmentIds = draft.retainedAttachmentIds.filter(
                    (id) => id !== file.id,
                  )
                "
              >
                {{ $t('op.remove') }}
              </button>
            </li>
          </ul>
          <small v-if="errors.files" class="op-error">{{ $t(errors.files) }}</small>
        </div>

        <p v-if="saveError" class="op-error" role="alert">{{ saveError }}</p>
        <div class="op-actions">
          <RouterLink
            class="op-button"
            :to="{ name: 'organization-objectives-details', params: { objectiveId } }"
            >{{ $t('op.cancel') }}</RouterLink
          ><button class="op-button op-primary" type="submit">
            {{ $t(saving ? 'op.saving' : 'op.save') }}
          </button>
        </div>
      </form>
    </template>
  </main>
</template>

<style scoped>
:deep(.upload-area) {
  border: 1px solid lightgray;
}
</style>
