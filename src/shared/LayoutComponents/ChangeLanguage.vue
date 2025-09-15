<script setup lang="ts">
import IconEgypt from "@/shared/icons/IconEgypt.vue";
import IconEnglish from "@/shared/icons/IconEnglish.vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const changeLang = (lang: string) => {
  locale.value = lang;
  document.documentElement.lang = lang;
  document.dir = lang === "ar" ? "rtl" : "ltr";
  localStorage.setItem("lang", lang);
  location.reload();
};

const intionalizeLang = (lang: string) => {
  locale.value = lang;
  document.documentElement.lang = lang;
  document.dir = lang === "ar" ? "rtl" : "ltr";
};

onMounted(() => {
  const lang: string | null = localStorage.getItem("lang");
  if (lang) {
    intionalizeLang(lang);
  } else {
    intionalizeLang("en");
  }
});
</script>
<template>
  <div class="language cursor-pointer">
    <IconEgypt @click="changeLang('ar')" v-if="locale === 'en'" />
    <IconEnglish @click="changeLang('en')" v-else />
  </div>
</template>
