import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditProjectParams implements Params {
  id: number
  translation: TranslationsParams
  partner_id: number
  organization_location_ids: number[]

  constructor(
    id: number,
    translation: TranslationsParams,
    partner_id: number,
    organization_location_ids: number[]
  ) {
    this.id = id
    this.translation = translation
    this.partner_id = partner_id
    this.organization_location_ids = organization_location_ids

  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['project_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.partner_id) data['partner_id'] = this.partner_id
    if (this.organization_location_ids?.length > 0) data['organization_location_ids'] = this.organization_location_ids

    return data
  }
}
