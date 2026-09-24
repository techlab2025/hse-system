import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type InductionTrainingTopicParams from './addInductionTrainingTopicParams'
import type InductionOrganisationEmployee from './InductionOrganisationEmployeeParams'

export default class EditInductionParams implements Params {
  constructor(
    public id: number,
    public instractor_id: number,
    public projectId: number | null,
    public projectLocationId: number | null,
    public projectZoonId: number | null,
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
    const data: Record<string, unknown> = {
      Induction_id: this.id,
      date: this.date,
      attachments: this.image ?? [],
      training_topic_ids: this.trainingTopic.map((item) => item.training_Topic_id),
      attendees: this.organisationEmployee.map((item) => item.toMap()),
      instructor_employee_id: this.instractor_id,
    }

    if (this.projectId !== null) {
      data.project_id = this.projectId
    }
    if (this.projectLocationId !== null) {
      data.project_location_id = this.projectLocationId
    }
    if (this.projectZoonId !== null) {
      data.project_location_zone_id = this.projectZoonId
    }

    return data
  }

  validate() {
    return EditInductionParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditInductionParams.validation.validateOrThrow(this)
  }
}
