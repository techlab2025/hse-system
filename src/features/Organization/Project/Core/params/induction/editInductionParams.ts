import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type InductionTrainingTopicParams from './addInductionTrainingTopicParams'
import type InductionOrganisationEmployee from './InductionOrganisationEmployeeParams'

export default class EditInductionParams implements Params {
  constructor(
    public id: number,
    public instractor_id: number,
    public date: string | null,
    public image: string[] | null,
    public trainingTopic: InductionTrainingTopicParams[],
    public organisationEmployee: InductionOrganisationEmployee[],
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    id: { required: true },
    instractor_id: { required: true },
    date: { required: true },
    trainingTopic: { required: true },
    organisationEmployee: { required: true },
  })

  toMap(): Record<string, unknown> {
    return {
      Induction_id: this.id,
      date: this.date,
      image: this.image,
      trainingTopic: this.trainingTopic.map((item) => item.toMap()),
      organisationEmployee: this.organisationEmployee.map((item) => item.toMap()),
      instractor_id: this.instractor_id,
    }
  }

  validate() {
    return EditInductionParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditInductionParams.validation.validateOrThrow(this)
  }
}
