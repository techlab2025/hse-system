<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'
import type Params from '@/base/core/params/params'
import type { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { useRoute } from 'vue-router'

interface IndexFilterField {
  key: string
  label: string
  placeholder?: string
  options?: TitleInterface[]
  controller?: SelectControllerInterface<any>
  params?: Params
}

const props = withDefaults(
  defineProps<{
    fields?: IndexFilterField[]
    showDate?: boolean
    initialDate?: string
    initialValues?: Record<string, number | null>
  }>(),
  {
    fields: () => [],
    showDate: false,
    initialDate: '',
    initialValues: () => ({}),
  },
)

const emit = defineEmits<{
  (event: 'apply', value: { date: string; values: Record<string, number | null> }): void
  (event: 'reset'): void
}>()

const visible = ref(false)
const draftDate = ref<Date | null>(null)
const draftValues = ref<Record<string, TitleInterface | null>>({})
const activeFilterCount = computed(
  () =>
    (props.initialDate ? 1 : 0) +
    Object.values(props.initialValues).filter((value) => value !== null && value !== undefined)
      .length,
)

const parseDate = (value?: string) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

const formatDate = (value: Date | null) => {
  if (!value) return ''
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const syncDraft = () => {
  draftDate.value = parseDate(props.initialDate)
  draftValues.value = Object.fromEntries(
    props.fields.map((field) => {
      const id = props.initialValues[field.key]
      const selected = field.options?.find((option) => Number(option.id) === Number(id)) ?? null
      return [field.key, selected]
    }),
  )
}

watch(visible, (isVisible) => {
  if (isVisible) syncDraft()
})

const applyFilters = () => {
  emit('apply', {
    date: formatDate(draftDate.value),
    values: Object.fromEntries(
      props.fields.map((field) => [field.key, draftValues.value[field.key]?.id ?? null]),
    ),
  })
  visible.value = false
}

const resetFilters = () => {
  draftDate.value = null
  draftValues.value = {}
  emit('reset')
  visible.value = false
}
const route = useRoute()
</script>

<template>
  <button
    type="button"
    class="index-filter-trigger"
    :class="{ 'is-active': activeFilterCount > 0 }"
    :aria-pressed="activeFilterCount > 0"
    @click="visible = true"
  >
    <span class="index-filter-trigger__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6h16M7 12h10M10 18h4"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </span>
    <span>{{ $t('Filter') }}</span>
    <span v-if="activeFilterCount" class="index-filter-trigger__count">
      {{ activeFilterCount }}
    </span>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    append-to="body"
    :header="$t('Filter')"
    :style="{ width: 'min(520px, 92vw)' }"
  >
    <div class="index-filter-dialog">
      <!-- @todo: implement date filter -->
      <!-- <label v-if="showDate" class="index-filter-date">
        <span>{{ $t('date') }}</span>
        <DatePicker
          v-model="draftDate"
          show-icon
          date-format="yy-mm-dd"
          :placeholder="$t('date')"
        /> -->
      <!-- </label> -->

      <UpdatedCustomInputSelect
        v-for="field in fields"
        :key="field.key"
        v-model="draftValues[field.key]"
        :static-options="field.options ?? null"
        :controller="field.controller"
        :params="field.params"
        :label="field.label"
        :placeholder="field.placeholder || field.label"
        :reload="false"
      />

      <div class="index-filter-actions">
        <button type="button" class="btn btn-secondary" @click="resetFilters">
          {{ $t('reset') }}
        </button>
        <button type="button" class="btn btn-primary" @click="applyFilters">
          {{ $t('apply') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.index-filter-dialog,
.index-filter-date {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.index-filter-date > span {
  font-weight: 600;
}

.index-filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.index-filter-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 9px 16px;
  gap: 9px;
  margin-inline: 8px;
  color: var(--brand-primary-700);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  background: var(--brand-primary-50);
  border: 1px solid var(--brand-primary-200);
  border-radius: 12px;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.index-filter-trigger:hover {
  color: white;
  background: var(--brand-primary-600);
  border-color: var(--brand-primary-600);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-primary-600) 24%, transparent);
  transform: translateY(-1px);
}

.index-filter-trigger:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--brand-primary-400) 30%, transparent);
  outline-offset: 2px;
}

.index-filter-trigger.is-active {
  color: white;
  background: var(--brand-primary-600);
  border-color: var(--brand-primary-600);
}

.index-filter-trigger__icon {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
}

.index-filter-trigger__icon svg {
  width: 100%;
  height: 100%;
}

.index-filter-trigger__count {
  display: grid;
  min-width: 21px;
  height: 21px;
  padding-inline: 5px;
  color: var(--brand-primary-700);
  font-size: 0.75rem;
  line-height: 1;
  background: white;
  border-radius: 999px;
  place-items: center;
}

.index-filter-trigger:active {
  transform: translateY(0);
}
</style>
