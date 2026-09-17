import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditIncidentCategoryParams implements Params {
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
    incidentTypeId: { required: true, min: 1 },
  })

  constructor(
    public id: number,
    public translation: TranslationsParams,
    public incidentTypeId: number,
  ) {}

  toMap(): Record<string, any> {
    return {
      incident_category_id: this.id,
      translations: this.translation.toMap(),
      incident_type_id: this.incidentTypeId,
    }
  }

  validate() {
    return EditIncidentCategoryParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditIncidentCategoryParams.validation.validateOrThrow(this)
  }
}
