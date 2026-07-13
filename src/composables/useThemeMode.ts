import { computed, ref } from 'vue'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'hse-theme-mode'
const THEME_USER_SELECTED_KEY = 'hse-theme-mode-user-selected'
const isDarkMode = ref(false)

const getPreferredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light'

  const hasUserSelectedTheme = localStorage.getItem(THEME_USER_SELECTED_KEY) === 'true'
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (hasUserSelectedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme
  }

  return 'light'
}

const applyThemeMode = (mode: ThemeMode, userSelected = false) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  isDarkMode.value = mode === 'dark'
  document.documentElement.dataset.theme = mode
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
  document.documentElement.style.colorScheme = mode
  localStorage.setItem(THEME_STORAGE_KEY, mode)
  if (userSelected) {
    localStorage.setItem(THEME_USER_SELECTED_KEY, 'true')
  }
}

export const useThemeMode = () => {
  const themeMode = computed<ThemeMode>(() => (isDarkMode.value ? 'dark' : 'light'))
  const initThemeMode = () => applyThemeMode(getPreferredThemeMode())
  const setThemeMode = (mode: ThemeMode) => applyThemeMode(mode, true)
  const toggleThemeMode = () => applyThemeMode(isDarkMode.value ? 'light' : 'dark', true)

  return {
    isDarkMode,
    themeMode,
    initThemeMode,
    setThemeMode,
    toggleThemeMode,
  }
}
