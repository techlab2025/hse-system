import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type { HolidayDaysEnum } from '../../Enums/UpdatedProjectFlow/HolidayDaysEnum'

abstract class ProjectFlowParams implements Params {
  constructor(public readonly projectId?: number) {}

  protected withProjectId(data: Record<string, unknown>): Record<string, unknown> {
    return this.projectId ? { ...data, project_id: this.projectId } : data
  }

  abstract toMap(): Record<string, unknown>
}

export class ProjectFlowDetailsParams implements Params {
  constructor(public readonly projectId: number) {}
  toMap(): Record<string, number> { return { project_id: this.projectId } }
}

export class BasicProjectParams extends ProjectFlowParams {
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
    projectId?: number,
  ) {
    super(projectId)
  }

  toMap(): Record<string, unknown> {
    return this.withProjectId({
      translation: this.translation.toMap(),
      contractor_ids: this.contractorIds.map((contractor_id) => ({ contractor_id })),
      location_ids: this.locationIds.map((location_id) => ({ location_id })),
      zoon_ids: this.zoonIds.map((zoon_id) => ({ zoon_id })),
      ...(this.serial ? { serial: this.serial } : {}),
      start_date: formatJoinDate(this.startDate),
      end_date: formatJoinDate(this.endDate),
      cost: this.cost,
      has_zoon: this.hasZoon,
    })
  }
}

export type CustomHolidayDay = {
  holiday_title: string
  holidays_dates: string[]
}

export class ProjectHolidaysParams extends ProjectFlowParams {
  constructor(
    public readonly basicHolidayDays: HolidayDaysEnum[],
    public readonly hasCustomHolidayDays: boolean,
    public readonly customHolidayDays: CustomHolidayDay[],
    projectId?: number,
  ) {
    super(projectId)
  }

  toMap(): Record<string, unknown> {
    return this.withProjectId({
      basic_holiday_days: this.basicHolidayDays,
      has_custom_holiday_days: this.hasCustomHolidayDays,
      custom_holiday_days: this.customHolidayDays,
    })
  }
}

export type ProjectLocationHierarchy = {
  project_location_id: number
  heirarchys: {
    heirarchy_id: number
    organizaion_employees: { organizaion_employee_id: number }[]
  }[]
}

export class ProjectLocationPositionEmployeesParams extends ProjectFlowParams {
  constructor(public readonly locations: ProjectLocationHierarchy[], projectId?: number) {
    super(projectId)
  }

  toMap(): Record<string, unknown> {
    return this.withProjectId({ project_locations: this.locations })
  }
}

export type ProjectLocationTeam = {
  project_location_id: number
  project_teams: {
    team_id: number
    organizaion_employees: { organizaion_employee_id: number }[]
  }[]
}

export class ProjectTeamsParams extends ProjectFlowParams {
  constructor(public readonly locations: ProjectLocationTeam[], projectId?: number) {
    super(projectId)
  }

  toMap(): Record<string, unknown> {
    return this.withProjectId({ project_locations: this.locations })
  }
}

export type ProjectZoonEquipment = {
  project_zoon_id: number
  equipments: { equipment_id: number }[]
}

export class ProjectEquipmentsParams extends ProjectFlowParams {
  constructor(public readonly zoons: ProjectZoonEquipment[], projectId?: number) {
    super(projectId)
  }

  toMap(): Record<string, unknown> {
    return this.withProjectId({ project_zoons: this.zoons })
  }
}
