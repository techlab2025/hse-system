import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type { ProgressDraft } from '../utils/objectiveProgress'

export default class EditObjectiveProgressParams implements Params {
  constructor(
    public objectiveId: number,
    public progressId: number,
    public draft: ProgressDraft,
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    objectiveId: { required: true, min: 1 },
    progressId: { required: true, min: 1 },
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
      objective_progress_id: this.progressId,
      period: this.draft.period,
      actual_result: this.draft.actualResult,
      retained_attachment_ids: this.draft.retainedAttachmentIds,
    }

    if (this.draft.notes.trim()) data['notes'] = this.draft.notes.trim()
    if (this.draft.attachments.length) data['attachments'] = this.draft.attachments
    return data
  }

  validate() {
    return EditObjectiveProgressParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditObjectiveProgressParams.validation.validateOrThrow(this)
  }
}
