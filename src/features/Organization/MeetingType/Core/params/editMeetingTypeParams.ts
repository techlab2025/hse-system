import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { MeetingTypePeriodicEnum } from '../constant/MeetingTypesEnum'

export default class EditMeetingTypeParams implements Params {
  public id: number
  public translation: TranslationsParams
  public type: MeetingTypePeriodicEnum
  public number_of_days?: number
  constructor(data: {
    id: number
    translation: TranslationsParams
    type: MeetingTypePeriodicEnum
    number_of_days?: number
  }) {
    this.id = data.id
    this.type = data.type
    this.translation = data.translation
    this.number_of_days = data.number_of_days
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
      | any
    > = {}

    data['meeting_type_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['type'] = this.type
    data['number_of_days'] = this.number_of_days

    return data
  }
}
