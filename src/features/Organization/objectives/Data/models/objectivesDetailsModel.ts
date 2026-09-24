import TitleInterface from '@/base/Data/Models/title_interface'

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

  static fromMap(data: Record<string, any>): ObjectivesDetailsModel {
    return new ObjectivesDetailsModel(
      data.id,

      data.year,

      data.objective,

      data.project
        ? new TitleInterface({
            id: data.project.id,
            title:
              data.project.titles?.find(
                (item: any) => item.locale === 'en',
              )?.title ??
              data.project.titles?.[0]?.title ??
              '',
          })
        : null,

      data.target_type,

      data.direction,

      data.department
        ? new TitleInterface({
            id: data.department.id,
            title:
              data.department.titles?.find(
                (item: any) => item.locale === 'en',
              )?.title ??
              data.department.titles?.[0]?.title ??
              '',
          })
        : null,

      data.follow_up_employee
        ? new TitleInterface({
            id: data.follow_up_employee.id,
            title: data.follow_up_employee.name ?? '',
          })
        : null,

      data.target,

      data.baseline,

      data.unit,

      data.frequency,

      data.annual_occurrences,
    )
  }
}