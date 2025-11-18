import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddHazardParams implements Params {
  // translation: TranslationsParams

  text: string | null = null
  date: string | null = null
  zoonIds: number[] | null = null
  hazardId: number | null = null
  machineId: number | null = null
  image: string | null = null
  desciption: string | null = null

  constructor(
    // translation: TranslationsParams,
    text: string | null = null,
    date: string | null = null,
    zoonIds: number[] | null = null,
    hazardId: number | null = null,
    machineId: number | null = null,
    image: string | null = null,
    desciption: string | null = null,
  ) {
    // this.translation = translation
    this.text = text
    this.date = date
    this.zoonIds = zoonIds
    this.hazardId = hazardId
    this.machineId = machineId
    this.image = image
    this.desciption = desciption
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

    // data['translations'] = this.translation.toMap()
    if (this.text != null) data['text'] = this.text
    if (this.date != null) data['date'] = this.date
    if (!this.zoonIds) data['zoon_ids'] = this.zoonIds
    if (!this.hazardId) data['hazard_id'] = this.hazardId
    if (!this.machineId) data['machine_id'] = this.machineId
    if (!this.image) data['image'] = this.image
    if (!this.desciption) data['desciption'] = this.desciption

    return data
  }
}
