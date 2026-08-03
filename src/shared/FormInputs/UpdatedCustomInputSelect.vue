<script lang="ts" setup>
import { computed, ref, watch, useAttrs } from 'vue'

import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'

import TitleInterface from '@/base/Data/Models/title_interface'
import type { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type Params from '@/base/core/Params/params'

import ValidationService from '@/base/Presentation/utils/validationService'
import IconBackStage from '@/shared/icons/IconBackStage.vue'

export type ComponentType = 'select' | 'multiselect'

defineOptions({ inheritAttrs: false })

interface Props {
  label?: string

  options?: TitleInterface[]
  staticOptions?: TitleInterface[] | null

  /*
   * modelValue is optional because the parent may initially send undefined.
   * It will be converted to null through withDefaults.
   */
  modelValue?: TitleInterface | TitleInterface[] | null

  placeholder?: string

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
}

const attrs = useAttrs()

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: '',
  type: 1,
  required: false,
  autoFill: false,
  id: 'custom-select-input',
  reload: true,
  staticOptions: null,
  optional: false,
  hascontent: false,
  hasHeader: false,
  isDialog: false,
  dialogVisible: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: TitleInterface | TitleInterface[] | null): void

  (event: 'update:slot', value: unknown): void
  (event: 'update:dialogVisible', value: boolean): void
  (event: 'close', value: boolean): void
  (event: 'reload-data', value: unknown): void
}>()

// -----------------------------------------------------------------------------
// Reactive state
// -----------------------------------------------------------------------------

const loading = ref(false)
const message = ref('No Data Found')
const dynamicOptions = ref<TitleInterface[]>([])

// Prevent an older request from replacing the latest request result.
let currentRequestId = 0

// -----------------------------------------------------------------------------
// Computed properties
// -----------------------------------------------------------------------------

const isMultiselect = computed<boolean>(() => {
  return props.type === 'multiselect' || Number(props.type) === 2
})

const componentType = computed(() => {
  return isMultiselect.value ? MultiSelect : Select
})

const mergedOptions = computed<TitleInterface[]>(() => {
  /*
   * Priority:
   * 1. staticOptions
   * 2. options
   * 3. fetched dynamic options
   */
  if (props.staticOptions !== null) {
    return props.staticOptions ?? []
  }

  if (props.options) {
    return props.options
  }

  return dynamicOptions.value
})

const multiselectProps = computed(() => {
  if (!isMultiselect.value) {
    return {}
  }

  return {
    display: 'chip',
    maxSelectedLabels: 6,
  }
})

/*
 * Store the selection locally so PrimeVue updates its label immediately.
 * Parent model changes are synchronized below.
 */
const localValue = ref<TitleInterface | TitleInterface[] | null>(normalizeValue(props.modelValue))

const normalizedValue = computed<TitleInterface | TitleInterface[] | null>({
  get: () => localValue.value,
  set: (newValue) => {
    const normalized = normalizeValue(newValue)
    localValue.value = normalized
    emit('update:modelValue', normalized)
    ValidationService.clearError(props.id)
  },
})

const dialogVisibleModel = computed<boolean>({
  get() {
    return props.dialogVisible ?? false
  },

  set(value) {
    emit('update:dialogVisible', value)
  },
})

const hiddenInputValue = computed<string>(() => {
  const value = normalizedValue.value

  if (Array.isArray(value)) {
    return value
      .map((item) => getOptionKey(item))
      .filter(Boolean)
      .join(',')
  }

  if (value && typeof value === 'object') {
    return getOptionKey(value)
  }

  return ''
})

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

watch(
  () => props.modelValue,
  (value) => {
    localValue.value = normalizeValue(value)
  },
  { deep: true },
)

watch(
  () => props.params,
  () => {
    void handleOptionUpdates()
  },
  {
    immediate: true,
    deep: true,
  },
)

watch(
  () => props.controller,
  () => {
    void handleOptionUpdates()
  },
)

watch(
  () => props.staticOptions,
  (options) => {
    if (options !== null) {
      handleAutoFill(options ?? [])
    }
  },
  {
    deep: true,
  },
)

watch(
  () => props.options,
  (options) => {
    if (props.staticOptions === null) {
      handleAutoFill(options ?? [])
    }
  },
  {
    deep: true,
  },
)

watch(
  () => props.dialogVisible,
  (isVisible, wasVisible) => {
    if (wasVisible && !isVisible) {
      void refetchOptions()
    }
  },
)

// -----------------------------------------------------------------------------
// Value methods
// -----------------------------------------------------------------------------

function normalizeValue(value: unknown): TitleInterface | TitleInterface[] | null {
  if (isMultiselect.value) {
    return ensureArray(value)
  }

  return ensureSingle(value)
}

function ensureArray(value: unknown): TitleInterface[] {
  return Array.isArray(value) ? (value as TitleInterface[]) : []
}

function ensureSingle(value: unknown): TitleInterface | null {
  /*
   * Do not use:
   *
   * value instanceof TitleInterface
   *
   * because objects returned from the API are plain JavaScript objects.
   */
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as TitleInterface
  }

  return null
}

function getOptionKey(option: TitleInterface): string {
  const item = option as TitleInterface & {
    id?: string | number
    uuid?: string
  }

  if (item.id !== undefined && item.id !== null) {
    return String(item.id)
  }

  if (item.uuid) {
    return item.uuid
  }

  return ''
}

// -----------------------------------------------------------------------------
// Options methods
// -----------------------------------------------------------------------------

async function handleOptionUpdates(): Promise<void> {
  if (props.controller && props.params) {
    await fetchOptions()
    return
  }

  dynamicOptions.value = props.staticOptions ?? props.options ?? []
}

async function fetchOptions(): Promise<void> {
  if (!props.controller || !props.params) {
    return
  }

  const requestId = ++currentRequestId

  try {
    loading.value = true
    message.value = 'Loading Data'

    const response = await props.controller.fetch(props.params)

    /*
     * Ignore the result when a newer request has already started.
     */
    if (requestId !== currentRequestId) {
      return
    }

    dynamicOptions.value = Array.isArray(response) ? response : []

    updateControllerState()
    handleAutoFill(dynamicOptions.value)
  } catch (error) {
    if (requestId !== currentRequestId) {
      return
    }

    handleFetchError(error)
  } finally {
    if (requestId === currentRequestId) {
      loading.value = false
    }
  }
}

function updateControllerState(): void {
  if (!props.controller) {
    return
  }

  if (props.controller.isDataFailed()) {
    message.value = 'An Error Occurred'
    return
  }

  if (props.controller.isDataSuccess()) {
    message.value = 'No Data Found'
  }
}

function handleAutoFill(options: TitleInterface[]): void {
  if (!props.autoFill || options.length !== 1) {
    return
  }

  const option = options[0]

  if (!option) {
    return
  }

  normalizedValue.value = isMultiselect.value ? [option] : option
}

function handleFetchError(error: unknown): void {
  console.error('Fetch error:', error)

  message.value = 'Failed to load data'
  dynamicOptions.value = []
}

async function reloadData(): Promise<void> {
  if (loading.value) {
    return
  }

  /*
   * Clear the selected value before fetching.
   * This allows autoFill to select the only available option afterward.
   */
  normalizedValue.value = isMultiselect.value ? [] : null

  if (props.controller && props.params) {
    await fetchOptions()
    return
  }

  dynamicOptions.value = props.staticOptions ?? props.options ?? []
  emit('reload-data')
}

async function refetchOptions(): Promise<void> {
  if (props.controller && props.params) {
    await fetchOptions()
    return
  }

  dynamicOptions.value = props.staticOptions ?? props.options ?? []
  emit('reload-data')
}

function closeDialog(): void {
  emit('close', false)
}
// const sselee = ref()
// const UpdateSelctedValue = (event) => {
//   sselee.value = event.value
//   console.log(event.value, 'eee')
// }
</script>

<template>
  <div v-bind="attrs" class="updated-custom-input-select">
    <div class="input-label flex w-full justify-between">
      <slot v-if="!hasHeader">
        <div class="flex items-center">
          <slot name="reloadHeader" />

          <span
            v-if="reload"
            class="reload-icon me-2 flex w-full cursor-pointer items-center gap-sm"
            @click="reloadData"
          >
            <span v-if="optional" class="optional-text"> ({{ $t('optional') }}) </span>

            <IconBackStage />
          </span>
        </div>

        <div class="flex items-center gap-2">
          <label class="input-label" :class="{ required }">
            <span v-if="required" class="text-red-500"> * </span>

            {{ $t(label ?? '') }}
          </label>

          <slot name="LabelHeader" />
        </div>
      </slot>

      <slot v-else name="Header" />
    </div>

    <slot v-if="!hascontent">
      <component
        :is="componentType"
        v-model="normalizedValue"
        :options="mergedOptions"
        :placeholder="placeholder"
        :loading="loading"
        :empty-message="message"
        :data-key="'id'"
        class="input-select w-full"
        option-label="title"
        filter
        v-bind="multiselectProps"
      />

      <input :id="id" :value="hiddenInputValue" type="text" class="hidden w-full" />
    </slot>

    <slot v-else name="content" />

    <div v-if="isDialog">
      <Dialog
        v-model:visible="dialogVisibleModel"
        modal
        :dismissable-mask="true"
        :style="{ width: '50rem' }"
        @hide="closeDialog"
      >
        <slot name="Dialog" />
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
  width: 100%;
  background-color: transparent;
  border-radius: 24px;

  &:focus {
    border: 1px solid #d9dbe9 !important;
  }
}
</style>
