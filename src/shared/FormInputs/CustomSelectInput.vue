<script lang="ts" setup>
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import { computed, ref, watch, toRefs } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type { SelectControllerInterface } from '@/base/persention/Controller/select_controller_interface'
import type Params from '@/base/core/Params/params'
import ValidationService from '@/base/Presentation/utils/validationService'
import IconBackStage from '@/shared/icons/IconBackStage.vue'

export type ComponentType = 'select' | 'multiselect'

interface Props {
  label: string
  options?: TitleInterface[]
  staticOptions?: TitleInterface[] | null
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
}

const emit = defineEmits(['update:modelValue'])
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
const mergedOptions = computed(() => staticOptions?.value ?? dynamicOptions.value)
const multiselectProps = computed(() =>
  isMultiselect.value ? { display: 'chip', maxSelectedLabels: 3 } : {},
)

// Value handling
const normalizedValue = computed({
  get: () => localValue.value,
  set: (newValue) => {
    // console.log(newValue);
    localValue.value = isMultiselect.value ? ensureArray(newValue) : ensureSingle(newValue)
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
  // console.log(value);
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
  if (loading.value) return
  await fetchOptions()
  normalizedValue.value = isMultiselect.value ? [] : null
}
</script>

<template>
  <div class="input-label flex justify-between w-full">
    <span
      v-if="enableReload"
      class="reload-icon cursor-pointer flex items-center gap-sm me-2 w-full"
      @click="reloadData"
    >
      <span class="optional-text" v-if="optional">({{ $t('optional') }})</span>
      <IconBackStage />
    </span>
    <label :class="{ required: required }" class="input-label">
      {{ label }}
    </label>
  </div>

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
</template>

<style scoped lang="scss">
.input-select {
  width: 100%;
  background-color: transparent;
  border-radius: 24px;
  &:focus {
    border: 1px solid #d9dbe9 !important;
  }
}

.input-label {
  width: 100%;
  margin-left: auto;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  label {
    width: fit-content;
  }
  span {
    width: fit-content;
  }
}
</style>
