import { computed } from 'vue'

export const moduleCheckedState = computed(() => {
  const map = new Map()

  permissionRoots.value.permissions.forEach((module: any) => {
    const full = module.permissions?.every((group: any) =>
      group.permissions?.every((perm: any) => perm.checked),
    )

    map.set(module.code, full)
  })

  return map
})
