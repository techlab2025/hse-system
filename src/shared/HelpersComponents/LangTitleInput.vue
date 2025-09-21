<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  langs: { title: string; locale: string; icon?: any }[]
  modelValue?: { locale: string; title: string }[]
  defaultLang?: { locale: string; title: string }
}>()

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
const lang = ref(props.defaultLang?.locale || props.langs[0]?.locale || '')

// current title binding
const title = ref('')

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

// ✅ Sync with parent changes
watch(
  () => props.modelValue,
  (nv) => {
    if (nv) {
      titles.value = props.langs.map((l) => {
        const fromModel = nv.find((f) => f.locale === l.locale)
        return fromModel ? { ...fromModel } : { locale: l.locale, title: '' }
      })
      const current = titles.value.find((t) => t.locale === lang.value)
      if (current) title.value = current.title
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="input-wrapper">
    <div class="label-wrapper">
      <label>
        Title
        <span class="text-red-500">*</span>
      </label>



      <!-- Dynamic Languages -->
      <div class="languages">
        <div class="input-lang" v-for="(l, index) in langs" :key="index">
          <input type="radio" :id="l.locale" name="lang" :value="l.locale" v-model="lang" />
          <label class="icon-lng" :for="l.locale">
            <component :is="l.icon" />
          </label>
        </div>
      </div>
    </div>

    <!-- Title Input -->
    <input type="text" v-model="title" placeholder="Enter Title" />

    <!-- Selected Language Info -->
    <span class="select-lang">
      {{ lang ? lang.toUpperCase() : 'select language from the top' }}
    </span>
  </div>
</template>
