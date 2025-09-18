<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  langs: { code: string; icon: any }[];
  modelValue?: { lang: string; title: string }[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: { lang: string; title: string }[]): void;
}>();

// build local state from props.modelValue or create empty titles
const titles = ref<{ lang: string; title: string }[]>(
  props.modelValue && props.modelValue.length
    ? props.modelValue.map((f) => ({ ...f }))
    : props.langs.map((l) => ({ lang: l.code, title: "" }))
);

// active language (default first)
const lang = ref(props.langs[0]?.code || "");

// compute current title binding
const title = ref("");

// sync active title when lang changes
watch(
  lang,
  (newLang) => {
    const found = titles.value.find((t) => t.lang === newLang);
    title.value = found ? found.title : "";
  },
  { immediate: true }
);

// when input changes, update titles list
watch(title, (val) => {
  const idx = titles.value.findIndex((t) => t.lang === lang.value);
  if (idx !== -1) {
    titles.value[idx].title = val;
  }
  emit("update:modelValue", titles.value);
});

// sync if parent updates modelValue
watch(
  () => props.modelValue,
  (nv) => {
    if (nv) {
      titles.value = nv.map((f) => ({ ...f }));
      const current = titles.value.find((t) => t.lang === lang.value);
      if (current) title.value = current.title;
    }
  },
  { deep: true }
);
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
        <div
          class="input-lang"
          v-for="(l, index) in langs"
          :key="index"
        >
          <input
            type="radio"
            :id="l.code"
            name="lang"
            :value="l.code"
            v-model="lang"
          />
          <label class="icon-lng" :for="l.code">
            <component :is="l.icon" />
          </label>
        </div>
      </div>
    </div>

    <!-- Title Input -->
    <input type="text" v-model="title" placeholder="Enter Title" />

    <!-- Selected Language Info -->
    <span class="select-lang">
      {{ lang ? lang.toUpperCase() : "select language from the top" }}
    </span>
  </div>
</template>
