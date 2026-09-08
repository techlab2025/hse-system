import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class BasicProjectParams implements Params {
  constructor(
    public readonly translation: TranslationsParams,
    public readonly contractorIds: number[],
    public readonly locationIds: number[],
    public readonly zoonIds: number[],
    public readonly serial: string | undefined,
    public readonly startDate: string | Date,
    public readonly endDate: string | Date,
    public readonly cost: string,
    public readonly hasZoon: boolean,
    public readonly projectId?: number,
    public readonly isUpdate: boolean = false,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      translation: this.translation.toMap(),
      contractors: this.contractorIds.map((contractor_id) => ({ contractor_id })),
      locations: this.locationIds.map((location_id) => ({ location_id })),
      zoons: this.zoonIds.map((zoon_id) => ({ zoon_id })),
      ...(this.serial ? { serial: this.serial } : {}),
      start_date: formatJoinDate(this.startDate),
      end_date: formatJoinDate(this.endDate),
      cost: this.cost,
      has_zoon: this.hasZoon,
    }
  }
}
