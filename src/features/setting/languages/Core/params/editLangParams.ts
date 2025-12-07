import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditLangParams implements Params {
  public id: number
  public translation: TranslationsParams
  public code: string
  public status?: number
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
    code: { required: true },
  })

  constructor(id: number, translation: TranslationsParams, code: string, status?: number) {
    this.id = id
    this.translation = translation
    this.code = code
    this.status = status
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    data['language_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['code'] = this.code
    if (this.status) data['status'] = this.status
    return data
  }
  validate() {
    return EditLangParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditLangParams.validation.validateOrThrow(this)
  }
}
