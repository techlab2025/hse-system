<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()

const activeIndex = ref(0)
const { locale, t } = useI18n()

// const locales = [
//   { code: 'en', language: 'English' },
//   { code: 'ar', language: 'العربية' },
// ]

// const switchLang = (lang: string) => {
//   locale.value = lang
//   router.push(`/${lang}`)
//   console.log(lang , 'Ew9');
// }

// const initLang = ref(useCookie("i18n_redirected"));

// onMounted(() => {
//   const current = locale.value || 'en'
//   document.documentElement.lang = current
//   document.documentElement.dir = current === 'ar' ? 'rtl' : 'ltr'
// })

// watch(
//   () => locale.value,
//   (newLocale) => {
//     document.documentElement.lang = newLocale
//     document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
//   },
// )

const navItems = computed(() => [
  { path: `/organization`, label: 'home' },
  { path: `/organization/equipment-mangement/all-observatin`, label: 'Operation' },
  { path: `/organization/equipments`, label: 'Equipment' },
  { path: `/organization/setting`, label: 'Setting' },
  // { path: `/${locale.value}/Contact`, label: 'contact' },
])

const normalize = (p: string) => (p.endsWith('/') && p !== '/' ? p.slice(0, -1) : p)

watch(
  () => route.path,
  (newPath) => {
    const currentPath = normalize(newPath)
    activeIndex.value = navItems.value.findIndex((item) => normalize(item.path) === currentPath)
  },
  { immediate: true },
)

const isLangOpen = ref(false)
const toggleLangMenu = () => (isLangOpen.value = !isLangOpen.value)

const otherLocale = computed(() => locales.value.find((l) => l.code !== locale.value))
</script>

<template>
  <div class="navigation">
    <ul>
      <li
        v-for="(item, index) in navItems"
        :key="index"
        :class="['list', { active: activeIndex === index }]"
      >
        <router-link
          :to="item.path"
          :aria-label="item.label"
          :class="['nav-link', { active: activeIndex === index }]"
        >
          <!-- <span class="icon"><component :is="item.icon" /></span> -->
          <span class="text">{{ t(item.label) }}</span>
        </router-link>
      </li>
      <!-- <div class="indicator" :style="indicatorStyle"></div> -->

      <!-- 🌍 Dropdown اللغات -->
      <!-- <div class="lang_sar">
        <button class="menu" type="button" @click="switchLang">
          <IconsArrowsWorld />
          <span>{{ locale }}</span>
          <IconsArrowsArrowdown />
        </button>

        <transition name="fade-slide">
          <div v-if="isLangOpen && otherLocale" class="menu-content">
            <div class="wrapper-content">
              <h4>{{ t('Another Lang') }}</h4>
              <hr />
              <ul class="lang-items">
                <li class="lang-item">
                  <NuxtLink :to="switchLang(otherLocale.code)" @click="isLangOpen = false">
                    {{ otherLocale.language }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div> -->
    </ul>
  </div>
</template>

<style scoped>
.lang_sar {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.menu {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  cursor: pointer;
}

/* 🌟 أنيميشن الانزلاق */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.menu-content {
  position: absolute;
  bottom: 120%;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  z-index: 99;
  width: 150px;
}

.lang-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lang-item {
  margin-top: 8px;
}

.lang-item a {
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}

.lang-item a:hover {
  color: #00c3f7;
}
</style>
