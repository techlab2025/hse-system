import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddLocationParams implements Params {
  title: TranslationsParams
  code: string
  public type: number
  ParentId?: number

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
    type: { required: true },
    // code: { required: true, minLength: 1, maxLength: 5 },
  })

  constructor(title: TranslationsParams, code: string, type: number, ParentId?: number) {
    this.title = title
    this.code = code
    this.type = type
    this.ParentId = ParentId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['translations'] = this.title.toMap()
    data['code'] = this.code
    data['type'] = this.type
    if (this.ParentId) data['parent_id'] = this.ParentId
    return data
  }

  validate() {
    return AddLocationParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddLocationParams.validation.validateOrThrow(this)
  }
  // validate() {
  //   // Use dynamic validation based on type
  //   const validation = new ClassValidation().setRules({
  //     title: { required: true, minLength: 2, maxLength: 100 },
  //     ParentId: {
  //       // required: [2, 3, 4].includes(this.type),
  //       custom: (value: any) => {
  //         if ([2].includes(this.type) && (value === null || value === undefined)) {
  //           return 'Country ID is required for this location type'
  //         }
  //         if ([3].includes(this.type) && (value === null || value === undefined)) {
  //           return 'State is required for this location type'
  //         }
  //         if ([4].includes(this.type) && (value === null || value === undefined)) {
  //           return 'Location is required for this location type'
  //         }
  //         return true
  //       },
  //     },
  //   })

  //   return validation.validate(this)
  // }

  // validateOrThrow() {
  //   // Use dynamic validation based on type
  //   const validation = new ClassValidation().setRules({
  //     title: { required: true, minLength: 2, maxLength: 100 },
  //     ParentId: {
  //       // required: [2, 3, 4].includes(this.type),
  //       custom: (value: any) => {
  //         if ([2].includes(this.type) && (value === null || value === undefined)) {
  //           return 'Country ID is required for this location type'
  //         }
  //         if ([3].includes(this.type) && (value === null || value === undefined)) {
  //           return 'State is required for this location type'
  //         }
  //         if ([4].includes(this.type) && (value === null || value === undefined)) {
  //           return 'Location is required for this location type'
  //         }
  //         return true
  //       },
  //     },
  //   })

  //   return validation.validateOrThrow(this)
  // }
}
