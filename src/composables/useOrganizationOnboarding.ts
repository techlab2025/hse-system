import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

export function useOrganizationOnboarding(step: 'visited' | 'ProjectProgressVisited') {
  const userStore = useUserStore()
  const storageKey = computed(() => {
    const organizationId = userStore.user?.organizationId ?? userStore.user?.id
    return organizationId ? `${step}:organization:${organizationId}` : null
  })
  const visited = ref(false)

  watch(
    storageKey,
    (key) => {
      visited.value = key !== null && localStorage.getItem(key) === 'true'
    },
    { immediate: true, flush: 'sync' },
  )

  const setVisited = () => {
    if (!storageKey.value) return
    localStorage.setItem(storageKey.value, 'true')
    visited.value = true
  }

  return { visited, setVisited }
}
