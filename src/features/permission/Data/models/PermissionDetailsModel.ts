export interface AssignedPermission {
  id: number
  permission: string
}

export default class PermissionDetailsModel {
  constructor(
    public permission: AssignedPermission[],
    public typeId: number | null = null,
    public type: number | null = null,
  ) {}

  static getLocale(): string {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
  }

  /** A global catalogue cannot be interpreted as one account's assigned grants. */
  static fromMap(data: unknown): PermissionDetailsModel {
    if (!data || typeof data !== 'object' || Array.isArray(data))
      return new PermissionDetailsModel([])
    const record = data as Record<string, unknown>
    if (
      !Array.isArray(record.permissions) ||
      !Number.isInteger(record.type_id) ||
      !Number.isInteger(record.type)
    )
      return new PermissionDetailsModel([])
    const permissions = record.permissions.flatMap((item: unknown) => {
      if (typeof item === 'string') return [{ id: 0, permission: item }]
      if (
        item &&
        typeof item === 'object' &&
        'permission' in item &&
        typeof item.permission === 'string'
      )
        return [{ id: 'id' in item ? Number(item.id) : 0, permission: item.permission }]
      return []
    })
    if (permissions.length !== record.permissions.length) return new PermissionDetailsModel([])
    return new PermissionDetailsModel(permissions, Number(record.type_id), Number(record.type))
  }

  isScopedTo(type: number, id: number): boolean {
    return this.type === type && this.typeId === id
  }
}
