<script setup lang="ts">
import { LangsMap } from '@/constant/langs'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IconEgypt from '@/shared/icons/IconEgypt.vue'
import IconEnglish from '@/shared/icons/IconEnglish.vue'
import { useUserStore } from '@/stores/user'
import { markRaw, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Popover from 'primevue/popover'

/* ✅ مهم: global scope */
const { locale } = useI18n({ useScope: 'global' })
const { user } = useUserStore()

const lang = ref<string>('en')
const op = ref()
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

/* ===============================
   تغيير اللغة (User Action فقط)
================================ */
const changeLang = (langCode: string) => {
  if (locale.value === langCode) return

  lang.value = langCode
  locale.value = langCode

  document.documentElement.lang = langCode
  document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr'

  localStorage.setItem('lang', langCode)

  op.value?.hide()
}

/* ===============================
   تهيئة اللغة عند تحميل الصفحة
================================ */
const initializeLang = () => {
  const savedLang = localStorage.getItem('lang') || 'en'

  lang.value = savedLang
  locale.value = savedLang

  document.documentElement.lang = savedLang
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
}

/* ===============================
   Fetch languages
================================ */
const fetchLang = async () => {
  if (user?.languages?.length) {
    langDefault.value = user.languages.map((item: any) => ({
      locale: item.code,
      title: item.code.toUpperCase(),
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon || IconEnglish),
    }))
    return
  }

  const params = new IndexLangParams('', 1, 10, 0)
  const controller = await IndexLangController.getInstance().getData(params)
  const response = controller.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: item.code.toUpperCase(),
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon || IconEnglish),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: IconEnglish, title: 'English' },
      { locale: 'ar', icon: IconEgypt, title: 'العربية' },
    ]
  }
}

/* ===============================
   Popover toggle
================================ */
const toggle = (event: Event) => {
  op.value.toggle(event)
}

onMounted(async () => {
  initializeLang()
  await fetchLang()
})
</script>


<template>
  <div class="relative flex items-center justify-center">
    <button @click="toggle"
      class="w-[70%] h-full gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
      <component :is="langDefault.find(l => l.locale === lang)?.icon || IconEnglish" class="w-5 h-5" />
    </button>

    <Popover ref="op" class="w-32">
      <ul class="list-none p-3 m-0 flex flex-col gap-1">
        <li v-for="l in langDefault" :key="l.locale" @click="changeLang(l.locale)"
          class="flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-gray-100">
          <component :is="l.icon" class="w-5 h-5" />
          <span>{{ l.title }}</span>
        </li>
      </ul>
    </Popover>
  </div>
</template>
