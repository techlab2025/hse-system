<script setup lang="ts">
// import { label } from '@primeuix/themes/aura/metergroup'
// import { log } from 'console';
import { computed, nextTick, ref, watch } from 'vue'

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

// active language
const lang = ref(props.langs[0]?.locale || props.defaultLang?.locale || '')

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

// watch(
//   title,
//   (val) => {
//     console.log('Watch triggered with:', val)
//     console.log('Current titles:', titles.value)

//     const idx = titles.value.findIndex((t) => t.locale === lang.value)
//     if (idx !== -1) {
//       const updated = titles.value.map((t, i) =>
//         i === idx ? { ...t, title: val } : t
//       )

//       console.log('Before assignment:', titles.value)
//       titles.value = updated
//       console.log('After assignment:', titles.value)

//       emit("update:modelValue", updated)
//       console.log('Emitted:', updated)
//     }
//   },
//   { immediate: true }
// )



const updateTitle = (e: Event) => {
  const idx = titles.value.findIndex((t) => t.locale === lang.value)

  if (idx !== -1) {
    // remove the object at idx
    const updated = [
      ...titles.value.slice(0, idx),
      ...titles.value.slice(idx + 1)
    ]

    titles.value = updated
    emit("update:modelValue", updated)
  }
}




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
          </label>
        </div>
      </div>
    </div>

    <!-- Title Input -->

    <textarea v-if="isTextarea" v-model="title" :rows="rows" v-bind="inputAttrs"></textarea>

    <!-- Regular Input -->
    <input v-else type="text" v-model="title" v-bind="inputAttrs" required  @input="updateTitle"  />
    <!-- Selected Language Info -->
    <span class="select-lang">
      {{ lang ? lang.toUpperCase() : 'select language from the top' }}
    </span>
  </div>
</template>
