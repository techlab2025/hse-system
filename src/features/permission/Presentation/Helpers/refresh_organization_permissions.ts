import { ApiNames } from '@/base/core/networkStructure/apiNames'
import NetworkService from '@/base/core/networkStructure/networking/network_service'
import { useUserStore } from '@/stores/user'

/** Revalidate only the current account. Never accept a target user from a caller. */
export async function refreshOrganizationPermissions(): Promise<boolean> {
  const store = useUserStore()
  const account = store.user
  if (!store.isAuth || !account) return false
  const id = account.id
  const token = account.apiToken
  const type = account.type
  store.permissionsLoading = true
  try {
    const response = await NetworkService.instance.postFormData({
      url: ApiNames.instance.ShowPermission,
      data: { type: account.type, type_id: id },
      isAuth: true,
    })
    if (
      store.user?.id !== id ||
      store.user?.apiToken !== token ||
      store.user?.type !== type ||
      !store.isAuth
    )
      return false
    const scoped = response.data?.data
    if (
      response.data?.status !== true ||
      !scoped ||
      Array.isArray(scoped) ||
      scoped.type_id !== id ||
      scoped.type !== account.type ||
      !Array.isArray(scoped.permissions)
    ) {
      throw new Error('Permission response is not scoped to the current account')
    }
    const permissions: unknown[] = scoped.permissions.map((assignment: unknown) =>
      typeof assignment === 'string'
        ? assignment
        : assignment && typeof assignment === 'object' && 'permission' in assignment
          ? assignment.permission
          : null,
    )
    if (!permissions.every((permission): permission is string => typeof permission === 'string'))
      throw new Error('Invalid permission response')
    store.setPermissions(permissions)
    return true
  } catch {
    if (store.user?.id === id && store.user?.apiToken === token && store.user?.type === type)
      store.invalidatePermissions()
    return false
  }
}
