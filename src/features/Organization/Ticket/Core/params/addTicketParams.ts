import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddTicketParams implements Params {
  images: string[]
  type: number
  title: string
  description: string
  organizationId?: number

  // public static readonly validation = new ClassValidation().setRules({
  //   type: { required: true },
  // })
  constructor(
    images: string[],
    type: number,
    title: string,
    description: string,
    organizationId?: number,
  ) {
    this.images = images
    this.type = type
    this.title = title
    this.description = description
    this.organizationId = organizationId
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | Record<string, string | number[] | number | Record<string, string>>
    | string[]
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
      | string[]
    > = {}

    data['files'] = this.images
    data['ticket_type_id'] = this.type
    data['title'] = this.title
    data['description'] = this.description
    if (this.organizationId) data['organization_id'] = this.organizationId
    return data
  }

  // validate() {
  //   return AddTicketParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return AddTicketParams.validation.validateOrThrow(this)
  // }
}
