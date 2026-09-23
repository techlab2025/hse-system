import TitleInterface from '@/base/Data/Models/title_interface'
import {
  getObjectiveDirectionTitle,
  getObjectiveFrequencyTitle,
  getObjectiveTargetTypeTitle,
  ObjectiveDirectionEnum,
  ObjectiveTargetTypeEnum,
} from '../../Core/enums/objectivesEnums'

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  return Number(value)
}

const toRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const toText = (value: unknown): string => (value === null || value === undefined ? '' : String(value))

export default class ObjectivesModel extends TitleInterface {
  public id: number
  public year: string
  public objective: string
  public projectTitle: string
  public targetType: ObjectiveTargetTypeEnum | null
  public direction: ObjectiveDirectionEnum | null
  public target: number | null
  public frequency: number | null
  public targetTypeTitle: string
  public directionTitle: string
  public frequencyTitle: string

  constructor(
    id: number,
    year: string,
    objective: string,
    projectTitle: string,
    targetType: ObjectiveTargetTypeEnum | null,
    direction: ObjectiveDirectionEnum | null,
    target: number | null,
    frequency: number | null,
  ) {
    super({ id, title: objective })

    this.id = id
    this.year = year
    this.objective = objective
    this.projectTitle = projectTitle
    this.targetType = targetType
    this.direction = direction
    this.target = target
    this.frequency = frequency
    this.targetTypeTitle = getObjectiveTargetTypeTitle(targetType)
    this.directionTitle = getObjectiveDirectionTitle(direction)
    this.frequencyTitle = getObjectiveFrequencyTitle(frequency)
  }

  static fromMap(data: Record<string, unknown>): ObjectivesModel {
    const project = toRecord(data.project)
    const targetType = toNullableNumber(data.target_type ?? data.targetType) as
      | ObjectiveTargetTypeEnum
      | null
    const direction = toNullableNumber(data.direction) as ObjectiveDirectionEnum | null

    return new ObjectivesModel(
      Number(data.id),
      toText(data.year),
      toText(data.objective ?? data.title),
      toText(project?.title ?? project?.name ?? data.project_title),
      targetType,
      direction,
      toNullableNumber(data.target),
      toNullableNumber(data.frequency),
    )
  }
}
