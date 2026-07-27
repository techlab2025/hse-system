<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import Dialog from 'primevue/dialog'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface StatusOption {
  label: string
  value: string | number
}
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    showStatusFilter?: boolean
    statusOptions?: StatusOption[]
    title?: string
    subtitle?: string
    initialStatus?: TitleInterface
    initialFromDate?: string
    initialToDate?: string
  }>(),
  {
    showStatusFilter: true,
    statusOptions: () => [],
    title: '',
    subtitle: '',
    initialStatus: new TitleInterface({
      title: 'all',
      id: 1,
    }),
    initialFromDate: '',
    initialToDate: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'apply', payload: { status: TitleInterface; fromDate: string; toDate: string }): void
  (event: 'reset'): void
}>()

const { t } = useI18n({ useScope: 'global' })

const draftStatus = ref<TitleInterface >(props.initialStatus)
const draftFromDate = ref(props.initialFromDate)
const draftToDate = ref(props.initialToDate)

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) return

    draftStatus.value = props.initialStatus
    draftFromDate.value = props.initialFromDate
    draftToDate.value = props.initialToDate
  },
  { flush: 'post' },
)

watch(
  () => [props.initialStatus, props.initialFromDate, props.initialToDate],
  ([status, fromDate, toDate]) => {
    if (!props.modelValue) return

    draftStatus.value = status
    draftFromDate.value = fromDate
    draftToDate.value = toDate
  },
  { flush: 'post' },
)

const hasStatusOptions = computed(() => props.showStatusFilter && props.statusOptions.length > 0)

const closeDialog = () => {
  emit('update:modelValue', false)
}

const handleApply = () => {
  emit('apply', {
    status: draftStatus.value,
    fromDate: draftFromDate.value,
    toDate: draftToDate.value,
  })
  closeDialog()
}

const handleReset = () => {
  draftStatus.value = new TitleInterface({
    title: 'all',
    id: 1,
  })
  draftFromDate.value = ''
  draftToDate.value = ''
  emit('reset')
  closeDialog()
}
</script>

<template>
  <Dialog
  :visible="modelValue"
  :modal="true"
  :header="title || $t('Filter')"
  @update:visible="emit('update:modelValue', $event)"
    append-to="body"
  position="center"
  :dismissableMask="true"
>
    <div class="report-filter-dialog__content">
      <p v-if="subtitle" class="report-filter-dialog__subtitle">{{ subtitle }}</p>

      <UpdatedCustomInputSelect
        v-if="hasStatusOptions"
        class="input"
        :modelValue="draftStatus"
        :staticOptions="statusOptions"
        :label="$t('Status')"
        :placeholder="$t('select your Status')"
        @update:modelValue="draftStatus = $event as TitleInterface"
      />

      <label class="report-filter-dialog__field">
        <span>{{ $t('date_from') }}</span>
        <input v-model="draftFromDate" type="date" />
      </label>

      <label class="report-filter-dialog__field">
        <span>{{ $t('date_to') }}</span>
        <input v-model="draftToDate" type="date" />
      </label>

      <div class="report-filter-dialog__actions">
        <button type="button" class="report-filter-dialog__reset" @click="handleReset">
          {{ $t('reset') }}
        </button>
        <button type="button" class="report-filter-dialog__apply" @click="handleApply">
          {{ $t('apply') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
// .report-filter-dialog :deep(.p-dialog-content) {
//   padding-top: 0.2rem;
// }
// :global(.report-filter-dialog-mask) {
//   position: fixed !important;
//   inset: 0 !important;
//   display: flex !important;
//   align-items: center !important;
//   justify-content: center !important;
//   padding: 1rem;
//   overflow: auto;
// }

// :global(.report-filter-dialog) {
//   position: relative !important;
//   top: auto !important;
//   right: auto !important;
//   bottom: auto !important;
//   left: auto !important;
//   width: min(460px, calc(100vw - 2rem)) !important;
//   max-height: calc(100dvh - 2rem);
//   margin: auto !important;
//   transform: none !important;
// }

// :global(.report-filter-dialog .p-dialog-content) {
//   max-height: calc(100dvh - 9rem);
//   padding-top: 0.2rem;
//   overflow-y: auto;
//   overscroll-behavior: contain;
// }
.report-filter-dialog__content {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-width: min(100%, 390px);
}

.report-filter-dialog__subtitle {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.95rem;
  line-height: 1.6;
}

.report-filter-dialog__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: var(--text-strong);
  font-size: 0.95rem;
  font-weight: 700;
}

.report-filter-dialog__field input,
.report-filter-dialog__field select {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: 1px solid color-mix(in srgb, var(--main-border) 70%, transparent);
  border-radius: 12px;
  background: var(--surface-1);
  color: var(--text-strong);
}

.report-filter-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 0.2rem;
}

.report-filter-dialog__reset,
.report-filter-dialog__apply {
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  font-weight: 800;
}

.report-filter-dialog__reset {
  background: color-mix(in srgb, var(--main-border) 70%, transparent);
  color: var(--text-strong);
}

.report-filter-dialog__apply {
  background: var(--identity-primary);
  color: white;
}
</style>
