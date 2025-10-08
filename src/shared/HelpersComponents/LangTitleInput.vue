<script setup lang="ts">
// import { label } from '@primeuix/themes/aura/metergroup'
// import { log } from 'console';
import { computed, nextTick, ref, watch } from 'vue'

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
    required: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: { locale: string; title: string }[]): void
}>()

// ✅ Build titles for all langs (from modelValue, defaultLang, or empty)
const titles = ref<{ locale: string; title: string }[]>(
  props.langs.map((l) => {
    const fromModel = props.modelValue?.find((f) => f.locale === l.locale)
    if (fromModel) return { ...fromModel }
    if (props.defaultLang?.locale === l.locale) {
      return { locale: l.locale, title: props.defaultLang.title } // ✅ FIXED
    }
    return { locale: l.locale, title: '' } // ✅ FIXED
  }),
)

// تحديد اللغة النشطة بناءً على القيم الممررة
const initialLang = computed(() => {
  // 1️⃣ ابحث عن أول لغة تحتوي على عنوان فعلي (title) في modelValue
  const langWithTitle = props.langs.find((lang) =>
    props.modelValue?.some((item) => item.locale === lang.locale && item.title?.trim().length > 0),
  )

  // 2️⃣ لو مش موجودة، استخدم اللغة الافتراضية (defaultLang)
  if (langWithTitle) return langWithTitle.locale

  if (props.defaultLang && props.langs.some((l) => l.locale === props.defaultLang.locale)) {
    return props.defaultLang.locale
  }

  // 3️⃣ fallback → أول لغة متاحة أو "en"
  return props.langs[0]?.locale || 'en'
})

// اللغة النشطة القابلة للتغيير
const lang = ref(props.modelValue?.length ? props.modelValue[0]?.locale : initialLang.value)

watch(
  () => props.modelValue,
  (newVal) => {
    // في حال تغيّر modelValue، حدث اللغة النشطة
    const found = newVal?.find((i) => i.locale === lang.value)
    if (!found) {
      lang.value = initialLang.value
    }
  },
  { immediate: true, deep: true },
)

// console.log('Model Value:', props.modelValue)
// console.log('Initial Lang:', initialLang.value)
// console.log('Active Lang:', lang.value)

// current title binding
const title = ref('')

const isTextarea = computed(() => props.type === 'textarea')

// ✅ Sync active title when lang changes
watch(
  lang,
  (newLang) => {
    const found = titles.value.find((t) => t.locale === newLang)
    title.value = found ? found.title : ''
  },
  { immediate: true },
)

// ✅ Update titles when input changes
watch(title, (val) => {
  const idx = titles.value.findIndex((t) => t.locale === lang.value)
  if (idx !== -1) {
    titles.value[idx].title = val
  }
  emit('update:modelValue', [...titles.value])
})

// const updateTitle = (e: Event) => {
//   const idx = titles.value.findIndex((t) => t.locale === lang.value)

//   if (idx !== -1) {
//     // remove the object at idx
//     const updated = [
//       ...titles.value.slice(0, idx),
//       ...titles.value.slice(idx + 1)
//     ]

//     titles.value = updated
//     emit("update:modelValue", updated)
//   }
// }

const placeholderText = computed(() => {
  return props.placeholder || props.label || 'Enter text...'
})
const inputAttrs = computed(() => ({
  placeholder: placeholderText.value,
  maxlength: props.maxlength,
  required: props.required,
  disabled: props.disabled,
  class: isTextarea.value ? 'textarea-input' : 'text-input',
}))
// ✅ Sync with parent changes
watch(
  () => props.modelValue,
  (nv) => {
    if (nv) {
      titles.value = props.langs.map((l) => {
        const fromModel = nv.find((f) => f.locale === l.locale)
        return fromModel ? { ...fromModel } : { locale: l.locale, title: '' }
      })

      // console.log(titles.value, 'titles')
      const current = titles.value.find((t) => t.locale === lang.value)
      if (current)
        title.value =
          current.title ??
          current.description ??
          current.subtitle ??
          current.button_title ??
          current.answer ??
          current.question
    }
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="input-wrapper">
    <div class="label-wrapper">
      <label>
        {{ label }}
        <span class="text-red-500">*</span>
      </label>

      <!--      <pre>-->
      <!--        {{ langs }}-->
      <!--      </pre>-->
      <!-- Dynamic Languages -->
      <div class="languages">
        <div
          class="input-lang"
          v-for="(l, index) in langs"
          :key="index"
          :class="{ active: l.locale === lang }"
        >
          <input
            type="radio"
            :id="`${label}-${l.locale}`"
            :name="label"
            :value="l.locale"
            v-model="lang"
          />
          <label class="icon-lng" :for="`${label}-${l.locale}`">
            <component :is="l.icon" />
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
    <input v-else type="text" v-model="title" v-bind="inputAttrs" required />
    <!-- Selected Language Info -->
    <span class="select-lang">
      {{ lang ? lang.toUpperCase() : 'select language from the top' }}
    </span>
  </div>
</template>
