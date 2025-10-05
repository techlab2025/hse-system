import type Params from '@/base/core/params/params'
import type { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export default class ShowPermissionParams implements Params {
  type: OrganizationTypeEnum
  type_id: number

  constructor(type: OrganizationTypeEnum,
    type_id: number) {
    this.type = type
    this.type_id = type_id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['type'] = this.type
    data['type_id'] = this.type_id
    return data
  }
}
