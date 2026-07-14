import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddIncidentCategoryParams implements Params {
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
    incidentTypeId: { required: true },
  })

  constructor(
    public translation: TranslationsParams,
    public incidentTypeId: number,
  ) {}

  toMap(): Record<string, any> {
    return {
      translations: this.translation.toMap(),
      incident_type_id: this.incidentTypeId,
    }
  }

  validate() {
    return AddIncidentCategoryParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddIncidentCategoryParams.validation.validateOrThrow(this)
  }
}
