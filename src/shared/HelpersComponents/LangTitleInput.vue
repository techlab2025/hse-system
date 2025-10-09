<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Editor from 'primevue/editor'

const props = withDefaults(
  defineProps<{
    langs: { title: string; locale: string; icon?: any }[]
    modelValue?: { locale: string; title: string }[]
    defaultLang?: { locale: string; title: string }
    label?: string
    type?: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'url'
    placeholder?: string
    rows?: number
    maxlength?: number
    required?: boolean
    disabled?: boolean
  }>(),
  {
    langs: () => [],
    modelValue: () => [],
    defaultLang: () => ({ locale: 'en', title: '' }),
    label: 'Title',
    type: 'text',
    placeholder: '',
    rows: 4,
    maxlength: undefined,
    required: true,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: { locale: string; title: string }[]): void
  (e: 'validate', isValid: boolean): void
}>()

// Build titles for all langs
const titles = ref<{ locale: string; title: string }[]>(
  props.langs.map((l) => {
    const fromModel = props.modelValue?.find((f) => f.locale === l.locale)
    if (fromModel) return { ...fromModel }
    if (props.defaultLang?.locale === l.locale) {
      return { locale: l.locale, title: props.defaultLang.title }
    }
    return { locale: l.locale, title: '' }
  }),
)

// Active language
const lang = ref(titles.value.find((t) => t.title)?.locale || props.defaultLang?.locale || '')

// console.log('Initial titles:', props.modelValue)
// Current title binding
const title = ref('')

// Validation error
const validationError = ref('')

const isTextarea = computed(() => props.type === 'textarea')

// Check if at least one language has a title
const hasAtLeastOneTitle = computed(() => {
  return titles.value.some((t) => t.title && t.title.trim().length > 0)
})

// console.log(titles.value.find((t) => t.title)?.locale, 'title')
// Validate and emit validation status
const validateTitles = () => {
  if (props.required && !hasAtLeastOneTitle.value) {
    validationError.value = 'At least one language title is required'
    emit('validate', false)
    return false
  }
  validationError.value = ''
  emit('validate', true)
  return true
}

// Expose validate method for parent component
defineExpose({
  validate: validateTitles,
  isValid: hasAtLeastOneTitle,
})

// Sync active title when lang changes
watch(
  lang,
  (newLang) => {
    const found = titles.value.find((t) => t.locale === newLang)
    title.value = found ? found.title : ''
  },
  { immediate: true },
)

// Update titles when input changes
watch(title, (val) => {
  const idx = titles.value.findIndex((t) => t.locale === lang.value)
  if (idx !== -1) {
    titles.value[idx].title = val
  }
  emit('update:modelValue', [...titles.value])

  // Clear validation error when user starts typing
  if (val && val.trim().length > 0) {
    validationError.value = ''
  }
})

const placeholderText = computed(() => {
  return props.placeholder || props.label || 'Enter text...'
})

const inputAttrs = computed(() => ({
  placeholder: placeholderText.value,
  maxlength: props.maxlength,
  disabled: props.disabled,
  class: isTextarea.value ? 'textarea-input' : 'text-input',
}))

// Sync with parent changes
watch(
  () => props.modelValue,
  (nv) => {
    if (nv) {
      titles.value = props.langs.map((l) => {
        const fromModel = nv.find((f) => f.locale === l.locale)
        return fromModel ? { ...fromModel } : { locale: l.locale, title: '' }
      })

      const current = titles.value.find((t) => t.locale === lang.value)
      if (current) {
        title.value =
          current.title ??
          current.description ??
          current.subtitle ??
          current.button_title ??
          current.answer ??
          current.question
      }
    }
  },
  { deep: true, immediate: true },
)

// Watch for validation changes
watch(hasAtLeastOneTitle, (isValid) => {
  emit('validate', isValid)
})
</script>

<template>
  <div class="input-wrapper">
    <div class="label-wrapper">
      <label>
        {{ label }}
        <span class="text-red-500" v-if="required">*</span>
      </label>

      <!-- Dynamic Languages -->
      <div class="languages">
        <div class="input-lang" v-for="(l, index) in langs" :key="index">
          <input
            type="radio"
            :id="`${label}-${l.locale}`"
            :name="label"
            :value="l.locale"
            v-model="lang"
          />
          <label class="icon-lng" :for="`${label}-${l.locale}`">
            <component :is="l.icon" />
            <!-- Visual indicator if this language has content -->
            <span
              v-if="titles.find((t) => t.locale === l.locale)?.title"
              class="lang-indicator"
              :title="`${l.locale.toUpperCase()} has content`"
            >
              ✓
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- Title Input -->
    <Editor
      v-if="isTextarea"
      v-model="title"
      :rows="rows"
      v-bind="inputAttrs"
      editorStyle="height: 320px"
    />

    <!-- Regular Input -->
    <input v-else :type="type" v-model="title" v-bind="inputAttrs" />

    <!-- Selected Language Info -->
    <span class="select-lang">
      {{ lang ? lang.toUpperCase() : 'select language from the top' }}
    </span>

    <!-- Required Field Info -->
  </div>
</template>

<style scoped>
.lang-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.icon-lng {
  position: relative;
  display: inline-block;
}
</style>
