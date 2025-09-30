import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddProjectParams implements Params {
  translation: TranslationsParams
  partner_id: number
  organization_location_ids: number[]

  constructor(
    translation: TranslationsParams,
    partner_id: number,
    organization_location_ids: number[]
  ) {
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

    data['translations'] = this.translation.toMap()
    if (this.partner_id) data['partner_id'] = this.partner_id
    if (this.organization_location_ids?.length > 0) data['organization_location_ids'] = this.organization_location_ids.map((item) => item?.id)

    return data
  }
}
