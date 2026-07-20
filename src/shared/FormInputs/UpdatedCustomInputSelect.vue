<script lang="ts" setup>
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import { computed, ref, watch, toRefs } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type Params from '@/base/core/params/params'
import ValidationService from '@/base/Presentation/utils/validationService'
import IconBackStage from '@/shared/icons/IconBackStage.vue'
import Dialog from 'primevue/dialog'
import FieldHelpIcon from './FieldHelpIcon.vue'

export type ComponentType = 'select' | 'multiselect'

interface Props {
  label?: string
  options?: TitleInterface[]
  staticOptions?: TitleInterface[] | null
  excludedOptionIds?: Array<number | string>
  modelValue: TitleInterface | TitleInterface[] | null
  placeholder: string
  controller?: SelectControllerInterface<any>
  params?: Params
  type?: ComponentType | number
  required?: boolean
  id?: string
  autoFill?: boolean
  reload?: boolean
  optional?: boolean
  hascontent?: boolean
  hasHeader?: boolean
  isDialog?: boolean
  dialogVisible?: boolean
  onclick?: () => void
  helpText?: string
}

// const emit = defineEmits(['update:modelValue', 'update:slot'])
const emit = defineEmits([
  'update:modelValue',
  'update:slot',
  'update:reload',
  'update:dialogVisible',
  'close',
])
const props = withDefaults(defineProps<Props>(), {
  type: 1,
  required: false,
  autoFill: false,
  id: 'custom-select-input',
  reload: true,
  staticOptions: null,
  optional: false,
})

const {
  modelValue,
  type,
  controller,
  params,
  staticOptions,
  autoFill,
  id,
  required,
  reload: enableReload,
} = toRefs(props)

// Reactive state
const loading = ref(false)
const message = ref('No Data Found')
const dynamicOptions = ref<TitleInterface[]>([])

// Computed properties
const isMultiselect = computed(() => Number(type.value) === 2)
const componentType = computed(() => (isMultiselect.value ? MultiSelect : Select))
const excludedOptionIdSet = computed(
  () => new Set((props.excludedOptionIds ?? []).map((id) => String(id))),
)
const mergedOptions = computed(() => {
  const options = staticOptions?.value ?? props.options ?? dynamicOptions.value

  if (!excludedOptionIdSet.value.size) return options

  return options.filter((option) => !excludedOptionIdSet.value.has(String(option.id)))
})
const multiselectProps = computed(() =>
  isMultiselect.value ? { display: 'chip', maxSelectedLabels: 6 } : {},
)

// Value handling
type OptionId = number | string

const getOptionId = (value: unknown): OptionId | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const optionId = (value as Partial<TitleInterface>).id
  return optionId === undefined || optionId === null ? null : optionId
}

const findOption = (value: unknown): TitleInterface | null => {
  const optionId = getOptionId(value)
  if (optionId === null) return null

  return mergedOptions.value.find((option) => String(option.id) === String(optionId)) ?? null
}

const normalizedValue = computed<OptionId | OptionId[] | null>({
  get: () => {
    if (isMultiselect.value) {
      return ensureArray(modelValue.value)
        .map((option) => findOption(option)?.id ?? getOptionId(option))
        .filter((optionId): optionId is OptionId => optionId !== null)
    }

    return findOption(modelValue.value)?.id ?? getOptionId(modelValue.value)
  },
  set: (newValue) => {
    if (isMultiselect.value) {
      const selectedOptions = (Array.isArray(newValue) ? newValue : [])
        .map(findOption)
        .filter((option): option is TitleInterface => option !== null)
      emitUpdate(selectedOptions)
      return
    }

    emitUpdate(findOption(newValue))
  },
})

// Watchers
watch([params, controller], handleOptionUpdates, { immediate: true })

// Methods
function ensureArray(value: unknown): TitleInterface[] {
  return Array.isArray(value) ? value : []
}

function emitUpdate(value: TitleInterface | TitleInterface[] | null): void {
  emit('update:modelValue', value)
  ValidationService.clearError(id.value)
}

async function handleOptionUpdates(): Promise<void> {
  if (params?.value && controller?.value) {
    await fetchOptions()
  } else {
    dynamicOptions.value = staticOptions?.value ?? []
  }
}

async function fetchOptions(): Promise<void> {
  if (!controller?.value || !params?.value) return
  try {
    loading.value = true
    message.value = 'Loading Data'
    const response = await controller.value.fetch(params.value)
    dynamicOptions.value = response
    updateControllerState()
    handleAutoFill(response)
  } catch (error) {
    handleFetchError(error)
  } finally {
    loading.value = false
  }
}

function updateControllerState(): void {
  if (!controller?.value) return
  if (controller.value.isDataFailed()) {
    message.value = 'An Error Occurred'
  } else if (controller.value.isDataSuccess()) {
    message.value = 'No Data Found'
  }
}

function handleAutoFill(options: TitleInterface[]): void {
  if (autoFill?.value && options.length === 1) {
    normalizedValue.value = isMultiselect.value ? [options[0].id] : options[0].id
  }
}

function handleFetchError(error: unknown): void {
  console.error('Fetch error:', error)
  message.value = 'Failed to load data'
  dynamicOptions.value = []
}

async function reloadData(): Promise<void> {
  emit('update:reload')
  if (loading.value) return
  await fetchOptions()
  normalizedValue.value = isMultiselect.value ? [] : null
}

const DialogVisable = computed({
  get() {
    return props.dialogVisible
  },
  set(val) {
    emit('update:dialogVisible', val)
  },
})

const closeDialog = async () => {
  emit('close', false)
  emit('update:reload')
  await fetchOptions()
}
</script>

<template>
  <div class="input-label updated-select-header flex justify-between w-full">
    <slot v-if="!hasHeader">
      <div class="updated-select-tools flex items-center">
        <slot name="reloadHeader"></slot>
        <span
          v-if="enableReload"
          class="reload-icon cursor-pointer flex items-center gap-sm me-2 w-full"
          @click="reloadData"
        >
          <span class="optional-text" v-if="optional">({{ $t('optional') }})</span>
          <IconBackStage />
        </span>
      </div>

      <div class="updated-select-label flex items-center gap-2">
        <label :class="{ required: required }" class="input-label">
          <span v-if="required" class="text-red-500">*</span>
          {{ $t(label ?? '') }}
        </label>

        <FieldHelpIcon v-if="helpText" :text="helpText" />

        <slot name="LabelHeader"></slot>
      </div>
    </slot>
    <slot v-else name="Header"></slot>
  </div>

  <slot v-if="!hascontent">
    <component
      :is="componentType"
      :model-value="normalizedValue"
      @update:model-value="normalizedValue = $event"
      :options="mergedOptions"
      data-key="id"
      option-value="id"
      :placeholder="placeholder"
      class="input-select w-full"
      option-label="title"
      v-bind="multiselectProps"
      filter
      :loading="loading"
      :empty-message="message"
    />
    <input type="text" class="hidden w-full" :value="normalizedValue" :id="id" />
  </slot>
  <slot v-else name="content"> </slot>
  <div v-if="isDialog">
    <Dialog
      @hide="closeDialog"
      v-model:visible="DialogVisable"
      modal
      :dismissable-mask="true"
      :style="{ width: 'min(50rem, calc(100vw - 24px))' }"
    >
      <slot name="Dialog"></slot>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.reload-icon {
  background-color: transparent !important;
  width: auto !important;
  flex: 0 0 auto;
}

.updated-select-header,
.updated-select-tools,
.updated-select-label {
  min-width: 0;
}

.updated-select-header,
.updated-select-tools {
  gap: 8px;
}
.add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }
}

.input-select {
  width: 100%;
  background-color: transparent;
  border-radius: 24px;

  &:focus {
    border: 1px solid var(--brand-primary-100) !important;
  }
}

@media (max-width: 640px) {
  .updated-select-header {
    align-items: stretch;
    flex-direction: column-reverse;
    gap: 8px;
  }

  .updated-select-tools {
    width: 100%;
    flex-wrap: wrap;
  }

  .updated-select-label {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
