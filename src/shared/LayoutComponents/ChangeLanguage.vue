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

const { locale } = useI18n()
const { user } = useUserStore()

const lang = ref<string>('en')
const op = ref()
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

const changeLang = (langCode: string) => {
  lang.value = langCode
  locale.value = langCode
  document.documentElement.lang = langCode
  document.dir = langCode === 'ar' ? 'rtl' : 'ltr'
  localStorage.setItem('lang', langCode)
  op.value.hide()
}

const initializeLang = (langCode: string) => {
  lang.value = langCode
  changeLang(langCode)
}

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
  const indexPartnerController = await IndexLangController.getInstance().getData(params)
  const response = indexPartnerController.value

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

const toggle = (event: Event) => {
  op.value.toggle(event)
}

onMounted(async () => {
  const savedLang = localStorage.getItem('lang') || 'en'
  initializeLang(savedLang)
  await fetchLang()
})
</script>

<template>
  <div class="relative text-left font-sans flex items-center justify-center !p-0">
    <button
      @click="toggle"
      class="w-[70%] h-full gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <span class="text-sm w-ful font-medium flex items-center gap-2">
        <component
          :is="langDefault.find((l) => l.locale === lang)?.icon || IconEnglish"
          class="w-5 h-5"
        />
      </span>
    </button>

    <Popover ref="op" class="w-32">
      <ul class="list-none p-3 m-0 justify-center flex flex-col">
        <li
          v-for="(l, index) in langDefault"
          :key="index"
          @click="changeLang(l.locale)"
          class="flex items-center gap-3 !p-1 border-gray-200 border-t hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-pointer rounded"
        >
          <component :is="l.icon" class="w-5 h-5" />
          <span>{{ l.title }}</span>
        </li>
      </ul>
    </Popover>
  </div>
</template>
