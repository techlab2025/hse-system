import type Params from '@/base/core/params/params'
import type { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export default class AddPermissionParams implements Params {
  type: OrganizationTypeEnum
  type_id: number
  permission:  string[]
  constructor(
    type: OrganizationTypeEnum,
    type_id: number,
    permission: string[],

  ) {
    this.type = type
    this.type_id = type_id
    this.permission = permission

  }


  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data['type'] = this.type;
    data['type_id'] = this.type_id;
    data['permissions'] = this.permission;
    return data;
  }
}
