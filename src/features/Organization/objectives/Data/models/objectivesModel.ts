import TitleInterface from '@/base/Data/Models/title_interface'
import type {
  ObjectiveDirectionEnum,
  ObjectiveTargetTypeEnum,
} from '../../Core/enums/objectivesEnums'

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
    targetTypeTitle: string,
    directionTitle: string,
    frequencyTitle: string,
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
    this.targetTypeTitle = targetTypeTitle
    this.directionTitle = directionTitle
    this.frequencyTitle = frequencyTitle
  }

  static fromMap(data: Record<string, unknown>): ObjectivesModel {
    return new ObjectivesModel(
      data.id as number,
      data.year as string,
      data.objective as string,
      data.project_title as string,
      data.target_type as ObjectiveTargetTypeEnum | null,
      data.direction as ObjectiveDirectionEnum | null,
      data.target as number | null,
      data.frequency as number | null,
      data.target_type_title as string,
      data.direction_title as string,
      data.frequency_title as string,
    )
  }
}
