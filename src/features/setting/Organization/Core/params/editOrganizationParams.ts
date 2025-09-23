import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditOrganizationParams implements Params {
  id: number
  name: string
  phone: string
  email: string
  image: string
  website_link: string
  industry_id: number[]
  language_ids: number[]

  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    image: string,
    website_link: string,
    industry_id: number[],
    language_ids: number[],
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.image = image
    this.website_link = website_link
    this.industry_id = industry_id
    this.language_ids = language_ids
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['name'] = this.name
    data['phone'] = this.phone
    data['email'] = this.email
    data['image'] = this.image
    data['website_link'] = this.website_link
    data['industry_ids'] = this.industry_id
    data['language_ids'] = this.language_ids

    return data
  }
}
