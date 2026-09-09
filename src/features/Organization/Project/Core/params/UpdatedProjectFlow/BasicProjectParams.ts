import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class BasicProjectParams implements Params {
  public readonly translation: TranslationsParams
  public readonly contractorIds: number[]
  public readonly locationIds: number[]
  public readonly zoonIds: number[]
  public readonly serial: string | undefined
  public readonly startDate: string | Date
  public readonly endDate: string | Date
  public readonly cost: string
  public readonly hasZoon: boolean
  public readonly projectId?: number
  public readonly isUpdate: boolean

  constructor(data: {
    translation: TranslationsParams
    contractorIds: number[]
    locationIds: number[]
    zoonIds: number[]
    serial: string | undefined
    startDate: string | Date
    endDate: string | Date
    cost: string
    hasZoon: boolean
    projectId?: number
    isUpdate: boolean
  }) {
    this.translation = data.translation
    this.contractorIds = data.contractorIds
    this.locationIds = data.locationIds
    this.zoonIds = data.zoonIds
    this.serial = data.serial
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.cost = data.cost
    this.hasZoon = data.hasZoon
    this.projectId = data.projectId
    this.isUpdate = data.isUpdate
  }

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      translation: this.translation.toMap(),
      contractors: this.contractorIds.map((contractor_id) => ({ contractor_id })),
      locations: this.locationIds.map((location_id) => ({ location_id })),
      ...(this.zoonIds.length > 0 && {
        zoons: this.zoonIds.map((zoon_id) => ({ zoon_id })),
      }),
      ...(this.serial ? { serial: this.serial } : {}),
      start_date: formatJoinDate(this.startDate),
      end_date: formatJoinDate(this.endDate),
      cost: this.cost,
      has_zoon: this.hasZoon,
    }
  }
}
