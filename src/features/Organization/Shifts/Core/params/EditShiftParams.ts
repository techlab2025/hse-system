import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditShiftParams implements Params {
  id: number
  translation: TranslationsParams
  startTime: string
  endTime: string

  constructor(id: number, translation: TranslationsParams, startTime: string, endTime: string) {
    this.id = id
    this.translation = translation
    this.startTime = startTime
    this.endTime = endTime
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

    data['shift_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['start_time'] = this.startTime
    data['end_time'] = this.endTime

    return data
  }
}
