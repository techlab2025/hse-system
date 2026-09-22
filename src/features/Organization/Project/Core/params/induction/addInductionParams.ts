import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type OrganisationEmployeenameParams from './addInductionOrganisationEmployeeParams'
import type InductionTrainingTopicParams from './addInductionTrainingTopicParams'

export interface InductionOrganisationEmployee {
  organisation_employee_id: number
  name?: OrganisationEmployeenameParams
}

export default class AddInductionParams implements Params {
  constructor(
    public instractor_id: number,
    public date: string | null,
    public image: string[] | null,
    public trainingTopic: InductionTrainingTopicParams[] ,
    public organisationEmployee: InductionOrganisationEmployee[] ,
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    date: { required: true },
  })

  toMap(): Record<string, unknown> {
    return {
      date: this.date,

      image: this.image,

      trainingTopic: this.trainingTopic.map((item) => ({
        training_Topic_id: item.training_Topic_id,
      })),

      organisationEmployee: this.organisationEmployee.map((item) => ({
        organisation_employee_id: item.organisation_employee_id,

        ...(item.name !== undefined
          ? {
              name: item.name.toMap(),
            }
          : {}),
      })),

      instractor_id: this.instractor_id,
    }
  }

  validate() {
    return AddInductionParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddInductionParams.validation.validateOrThrow(this)
  }
}