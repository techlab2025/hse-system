import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type LocationModel from '@/features/setting/Location/Data/models/LocationModel'

export default class EditPermissionParams implements Params {
  id: number
  type: OrganizationTypeEnum
  type_id: number
  permission: string[]

  constructor(
    id: number,
    type: OrganizationTypeEnum,
    type_id: number,
    permission: string[],
  ) {
    this.id = id
    this.type = type
    this.type_id = type_id
    this.permission = permission
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data['permission_id'] = this.id;
    data['type'] = this.type;
    data['type_id'] = this.type_id;
    data['permission'] = this.permission;
    return data;
  }
}
