<script lang="ts" setup>
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import { computed, ref, watch, toRefs, type Component, useSlots, onMounted } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type Params from '@/base/core/Params/params'
import ValidationService from '@/base/Presentation/utils/validationService'
import IconBackStage from '@/shared/icons/IconBackStage.vue'
import PlusIcon from '../icons/PlusIcon.vue'
import Dialog from 'primevue/dialog'
import FieldHelpIcon from './FieldHelpIcon.vue'

defineOptions({ inheritAttrs: false })

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
const localValue = ref(props.modelValue)
const dynamicOptions = ref<TitleInterface[]>([])

// Computed properties
const isMultiselect = computed(() => Number(type.value) === 2)
const componentType = computed(() => (isMultiselect.value ? MultiSelect : Select))
const excludedOptionIdSet = computed(
  () => new Set((props.excludedOptionIds ?? []).map((id) => String(id))),
)
const mergedOptions = computed(() => {
  const options = staticOptions?.value ?? dynamicOptions.value

  if (!excludedOptionIdSet.value.size) return options

  return options.filter((option) => !excludedOptionIdSet.value.has(String(option.id)))
})
const multiselectProps = computed(() =>
  isMultiselect.value ? { display: 'chip', maxSelectedLabels: 6 } : {},
)

// Value handling
const normalizedValue = computed({
  get: () => localValue.value,
  set: (newValue) => {
    localValue.value = isMultiselect.value ? ensureArray(newValue) : ensureSingle(newValue)
    // console.log(localValue.value, 'localValue.value');
    emitUpdate()
  },
})

// Watchers
watch(modelValue, syncLocalValue)
watch([params, controller], handleOptionUpdates, { immediate: true })

// Initialization
syncLocalValue(props.modelValue)

// Methods
function ensureArray(value: unknown): TitleInterface[] {
  return Array.isArray(value) ? value : []
}

function ensureSingle(value: unknown): TitleInterface | null {
  // console.log(value , "single");
  return value instanceof TitleInterface ? value : null
}

function syncLocalValue(newValue: typeof props.modelValue): void {
  if (newValue !== localValue.value) {
    // console.log(newValue);
    localValue.value = newValue
  }
}

function emitUpdate(): void {
  // console.log(localValue.value);
  emit('update:modelValue', localValue.value)
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
    normalizedValue.value = isMultiselect.value ? [options[0]] : options[0]
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
  <div class="updated-custom-select">
    <div class="input-label select-field-header">
      <slot v-if="!hasHeader">
        <div class="select-label-group">
          <label :class="{ required: required }" class="select-field-label">
            <span v-if="required" class="text-red-500">*</span>
            {{ $t(label ?? '') }}
          </label>

          <FieldHelpIcon v-if="helpText" :text="helpText" />
          <slot name="LabelHeader"></slot>

          <button
            v-if="enableReload"
            class="reload-icon"
            type="button"
            :aria-label="$t('reload')"
            @click="reloadData"
          >
            <span class="optional-text" v-if="optional">({{ $t('optional') }})</span>
            <IconBackStage />
          </button>
        </div>

        <div v-if="$slots.reloadHeader" class="select-mode-tools">
          <slot name="reloadHeader"></slot>
        </div>
      </slot>
      <slot v-else name="Header"></slot>
    </div>

    <slot v-if="!hascontent">
      <component
        :is="componentType"
        v-model="normalizedValue"
        :options="mergedOptions"
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
        :style="{ width: '50rem' }"
      >
        <slot name="Dialog"></slot>
      </Dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  background-color: transparent;
  border-radius: 24px;

  &:focus {
    border: 1px solid var(--brand-primary-100) !important;
  }
}

.updated-custom-select {
  display: flex;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  flex-direction: column;
  gap: 8px;
}

.select-field-header {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: 10px;
}

.select-label-group,
.select-mode-tools,
.select-mode-tools :deep(.flex) {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 7px;
}

.select-label-group {
  flex: 1 1 auto;
  flex-wrap: wrap;
}

.select-mode-tools {
  flex: 0 1 auto;
  justify-content: flex-end;
}

.select-field-label {
  width: auto !important;
  min-width: 0;
  margin: 0 !important;
  white-space: normal;
  text-align: start;
  overflow-wrap: anywhere;
}

.reload-icon {
  display: inline-flex;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9px;
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
  cursor: pointer;
}

.reload-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.optional-text {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.updated-custom-select :deep(.p-select-label),
.updated-custom-select :deep(.p-multiselect-label) {
  width: auto !important;
  min-width: 0 !important;
  flex: 1 1 auto;
}

.updated-custom-select :deep(.p-select-dropdown),
.updated-custom-select :deep(.p-multiselect-dropdown) {
  flex: 0 0 auto;
}

@media (max-width: 480px) {
  .select-field-header {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
  }

  .select-label-group,
  .select-mode-tools {
    width: 100%;
  }

  .select-mode-tools {
    justify-content: flex-start;
  }

  .select-mode-tools :deep(.flex) {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
