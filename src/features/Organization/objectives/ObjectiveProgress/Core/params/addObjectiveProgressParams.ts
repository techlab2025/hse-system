import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type { ProgressDraft } from '../utils/objectiveProgress'

export default class AddObjectiveProgressParams implements Params {
  constructor(
    public objectiveId: number,
    public draft: ProgressDraft,
  ) {}

  public static readonly validation = new ClassValidation("Organization/objectives/ObjectiveProgress/Core/params/addObjectiveProgressParams").setRules({
    objectiveId: { required: true, min: 1 },
    draft: {
      required: true,
      custom: (value) => {
        const draft = value as ProgressDraft | undefined
        return Boolean(
          draft?.period &&
            draft.actualResult !== null &&
            Number.isFinite(Number(draft.actualResult)) &&
            Number(draft.actualResult) >= 0,
        )
      },
    },
  })

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      objective_id: this.objectiveId,
      period: this.draft.period,
      actual_result: this.draft.actualResult,
    }

    if (this.draft.notes.trim()) data['notes'] = this.draft.notes.trim()
    if (this.draft.attachments.length) data['attachments'] = this.draft.attachments
    return data
  }

  validate() {
    return AddObjectiveProgressParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddObjectiveProgressParams.validation.validateOrThrow(this)
  }
}
