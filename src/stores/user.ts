import { defineStore } from 'pinia'
import { ref } from 'vue'
import type UserModel from '@/features/auth/Data/models/user_model'
import { useProjectSelectStore } from './ProjectSelect'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<UserModel | null>(null)
    const isAuth = ref(false)
    const expiresAt = ref<number | null>(null)
    const permissionsLoading = ref(false)
    const permissionsInvalidated = ref(false)
    let logoutTimer: ReturnType<typeof setTimeout> | undefined

    function clearProjectContext() {
      const projects = useProjectSelectStore()
      projects.clearProject()
      projects.setAllProjects([])
    }

    function setUser(newUser: UserModel) {
      if (
        user.value?.id !== newUser.id ||
        user.value?.type !== newUser.type ||
        user.value?.apiToken !== newUser.apiToken
      ) {
        if (user.value) user.value.permission = []
        clearProjectContext()
      }
      user.value = newUser
      isAuth.value = true
      permissionsLoading.value = false
      permissionsInvalidated.value = false
      expiresAt.value = Date.now() + 24 * 60 * 60 * 1000
      setAutoLogout()
    }

    function setPermissions(permissions: string[]) {
      if (
        !user.value ||
        !Array.isArray(permissions) ||
        permissions.some((code) => typeof code !== 'string')
      ) {
        invalidatePermissions()
        return
      }
      user.value.permission = [...new Set(permissions)]
      user.value.permissionsLoaded = true
      permissionsLoading.value = false
      permissionsInvalidated.value = false
    }

    function invalidatePermissions() {
      permissionsInvalidated.value = true
      permissionsLoading.value = false
      if (user.value) user.value.permission = []
    }

    async function logout() {
      if (logoutTimer) clearTimeout(logoutTimer)
      invalidatePermissions()
      user.value = null
      isAuth.value = false
      expiresAt.value = null
      clearProjectContext()
      localStorage.removeItem('token')
    }

    function setAutoLogout() {
      if (logoutTimer) clearTimeout(logoutTimer)
      if (expiresAt.value) {
        const timeout = expiresAt.value - Date.now()
        if (timeout > 0) logoutTimer = setTimeout(() => void logout(), timeout)
        else void logout()
      }
    }

    return {
      user,
      isAuth,
      expiresAt,
      permissionsLoading,
      permissionsInvalidated,
      setUser,
      setPermissions,
      invalidatePermissions,
      logout,
      setAutoLogout,
    }
  },
  {
    persist: { pick: ['user', 'isAuth', 'expiresAt'] },
  },
)
