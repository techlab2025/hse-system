import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type InductionTrainingTopicParams from './addInductionTrainingTopicParams'
import type InductionOrganisationEmployee from './InductionOrganisationEmployeeParams'

export default class AddInductionParams implements Params {
  constructor(
    public instractor_id: number,
    public date: string | null,
    public image: string[] | null,
    public trainingTopic: InductionTrainingTopicParams[],
    public organisationEmployee: InductionOrganisationEmployee[],
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    instractor_id: { required: true },
    date: { required: true },
    trainingTopic: { required: true },
    organisationEmployee: { required: true },
  })

  toMap(): Record<string, unknown> {
    return {
      date: this.date,
      image: this.image,
      trainingTopic: this.trainingTopic.map((item) => item.toMap()),
      organisationEmployee: this.organisationEmployee.map((item) => item.toMap()),
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
