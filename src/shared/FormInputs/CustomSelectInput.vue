<script lang="ts" setup>
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import { computed, ref, watch, toRefs, type Component } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type Params from '@/base/core/params/params'
import ValidationService from '@/base/Presentation/utils/validationService'
import IconBackStage from '@/shared/icons/IconBackStage.vue'
import StarRequiredInput from '../icons/StarRequiredInput.vue'
import FieldHelpIcon from './FieldHelpIcon.vue'

export type ComponentType = 'select' | 'multiselect'

defineOptions({ inheritAttrs: false })

interface Props {
  label?: string
  options?: TitleInterface[]
  staticOptions?: TitleInterface[] | null
  modelValue: TitleInterface | TitleInterface[] | null
  placeholder: string
  controller?: SelectControllerInterface<unknown>
  params?: Params
  type?: ComponentType | number
  required?: boolean
  id?: string
  autoFill?: boolean
  reload?: boolean
  optional?: boolean
  component?: Component
  onclick?: () => void
  helpText?: string
  showSelectAllOption?: boolean
}

const emit = defineEmits(['update:modelValue', 'update:slot', 'update:reload'])
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
const selectAllOption = Object.assign(new TitleInterface({ id: -1, title: 'Select All' }), {
  __selectAllOption: true,
})

// Computed properties
const isMultiselect = computed(() => Number(type.value) === 2)
const componentType = computed(() => (isMultiselect.value ? MultiSelect : Select))
const mergedOptions = computed(() => staticOptions?.value ?? dynamicOptions.value)
const displayedOptions = computed(() =>
  props.showSelectAllOption ? [selectAllOption, ...mergedOptions.value] : mergedOptions.value,
)
const multiselectProps = computed(() =>
  isMultiselect.value
    ? {
        display: 'chip',
        maxSelectedLabels: 6,
        showToggleAll: !props.showSelectAllOption,
      }
    : {},
)

const allOptionsSelected = computed(() => {
  if (!isMultiselect.value || !mergedOptions.value.length) return false

  const selectedIds = new Set(ensureArray(modelValue.value).map((option) => option.id))
  return mergedOptions.value.every((option) => selectedIds.has(option.id))
})

// Value handling
const normalizedValue = computed({
  get: () => modelValue.value,
  set: (newValue) => {
    if (isMultiselect.value) {
      const selectedOptions = ensureArray(newValue)

      if (selectedOptions.some(isSelectAllOption)) {
        emitUpdate(allOptionsSelected.value ? [] : [...mergedOptions.value])
        return
      }

      emitUpdate(selectedOptions)
      return
    }

    const normalized = ensureSingle(newValue)
    emitUpdate(normalized)
  },
})

// Watchers
watch([params, controller], handleOptionUpdates, { immediate: true })

// Methods
function ensureArray(value: unknown): TitleInterface[] {
  return Array.isArray(value) ? value : []
}

function ensureSingle(value: unknown): TitleInterface | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  // PrimeVue can return a reactive proxy or a plain API object, so instanceof is not reliable here.
  const option = value as Partial<TitleInterface>
  return option.id !== undefined && option.id !== null ? (value as TitleInterface) : null
}

function isSelectAllOption(option: TitleInterface): boolean {
  return Boolean((option as TitleInterface & { __selectAllOption?: boolean }).__selectAllOption)
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

const updateSlot = (data: unknown) => {
  emit('update:slot', data)
}
</script>

<template>
  <div
    class="input-label flex justify-between w-full"
    :class="{ full: !onclick, fullReload: enableReload && !onclick }"
  >
    <span
      v-if="enableReload"
      class="reload-icon cursor-pointer flex items-center w-full"
      @click="reloadData"
    >
      <span>
        <component @update:data="updateSlot" v-if="component" :is="component" />
      </span>
      <span class="optional-text" v-if="optional">({{ $t('optional') }})</span>
      <IconBackStage />
    </span>

    <div class="label-container flex justify-center items-center gap-2">
      <label :class="{ required: required }" class="input-label flex items-center gap-2">
        <span v-if="required" class="text-red-500">
          <StarRequiredInput />
        </span>
        {{ label ? $t(label) : '' }}
      </label>

      <FieldHelpIcon v-if="helpText" :text="helpText" />

      <span v-if="onclick" @click="onclick" class="add-dialog">
        {{ $t('new') }}
      </span>
    </div>
  </div>
  <component
    :is="componentType"
    :model-value="normalizedValue"
    @update:model-value="normalizedValue = $event"
    :options="displayedOptions"
    data-key="id"
    :placeholder="placeholder"
    class="input-select w-full"
    option-label="title"
    v-bind="{ ...multiselectProps, ...$attrs }"
    filter
    :loading="loading"
    :empty-message="message"
  >
    <template v-if="showSelectAllOption && isMultiselect" #option="{ option }">
      <span v-if="isSelectAllOption(option)" class="select-all-option">
        {{ $t('select_all') }}
      </span>
      <span v-else>{{ option?.title }}</span>
    </template>
  </component>
  <input type="text" class="hidden w-full" :value="normalizedValue" :id="id" />

  <!-- <template v-else>
    <slot :onUpdate="updateSlot" />
  </template> -->
</template>

<style scoped lang="scss">
.add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;
  color: var(--brand-primary-500);
  text-decoration: underline;
  font-family: 'Regular';

  svg {
    width: 18px;
    height: 18px;
  }
}

.input-select {
  width: 100%;
  background-color: transparent;
  border-radius: 24px;
  // padding: 16px 0;

  &:focus {
    border: 1px solid var(--brand-primary-100) !important;
  }
}

.select-all-option {
  color: var(--PrimaryColor);
  font-weight: 800;
}

:deep(.p-multiselect-option:first-child) {
  border-bottom: 1px solid var(--main-border);
  color: var(--PrimaryColor);
  font-weight: 800;
}
</style>
