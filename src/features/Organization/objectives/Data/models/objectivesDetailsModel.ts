import type TitleInterface from '@/base/Data/Models/title_interface'
import type {
  ObjectiveDirectionEnum,
  ObjectiveTargetTypeEnum,
} from '../../Core/enums/objectivesEnums'

export default class ObjectivesDetailsModel {
  constructor(
    public id: number,
    public year: string,
    public objective: string,
    public project: TitleInterface | null,
    public targetType: ObjectiveTargetTypeEnum,
    public direction: ObjectiveDirectionEnum | null,
    public department: TitleInterface | null,
    public followUpEmployee: TitleInterface | null,
    public target: number | null,
    public baseline: number | null,
    public unit: string | null,
    public frequency: number | null,
    public annualOccurrences: number | null,
  ) {}

  static fromMap(data: Record<string, unknown>): ObjectivesDetailsModel {
    return new ObjectivesDetailsModel(
      data.id as number,
      data.year as string,
      data.objective as string,
      data.project as TitleInterface | null,
      data.target_type as ObjectiveTargetTypeEnum,
      data.direction as ObjectiveDirectionEnum | null,
      data.department as TitleInterface | null,
      data.follow_up_employee as TitleInterface | null,
      data.target as number | null,
      data.baseline as number | null,
      data.unit as string | null,
      data.frequency as number | null,
      data.annual_occurrences as number | null,
    )
  }
}
