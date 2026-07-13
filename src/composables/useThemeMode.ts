import { computed, ref } from 'vue'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'hse-theme-mode'
const isDarkMode = ref(false)

const getPreferredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light'

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyThemeMode = (mode: ThemeMode) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  isDarkMode.value = mode === 'dark'
  document.documentElement.dataset.theme = mode
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
  document.documentElement.style.colorScheme = mode
  localStorage.setItem(THEME_STORAGE_KEY, mode)
}

export const useThemeMode = () => {
  const themeMode = computed<ThemeMode>(() => (isDarkMode.value ? 'dark' : 'light'))
  const initThemeMode = () => applyThemeMode(getPreferredThemeMode())
  const setThemeMode = (mode: ThemeMode) => applyThemeMode(mode)
  const toggleThemeMode = () => applyThemeMode(isDarkMode.value ? 'light' : 'dark')

  return {
    isDarkMode,
    themeMode,
    initThemeMode,
    setThemeMode,
    toggleThemeMode,
  }
}
