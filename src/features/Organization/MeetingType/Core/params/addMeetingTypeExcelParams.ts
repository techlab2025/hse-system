import type Params from '@/base/core/params/params'
import type { PeriodicTypeEnum } from '../Enum/periodic_type_enum'

export interface MeetingTypeExcelRow {
  title: string
  description: string
  periodic_type: PeriodicTypeEnum
  number_of_days: number | null
}

export default class AddMeetingTypeExcelParams implements Params {
  public data: MeetingTypeExcelRow[]

  constructor(data: { data: MeetingTypeExcelRow[] }) {
    this.data = data.data
  }

  toMap(): Record<string, any> {
    return { data: this.data }
  }
}
