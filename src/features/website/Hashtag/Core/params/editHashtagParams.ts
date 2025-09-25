import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditHashtagParams implements Params {
  id: number
  translation: TranslationsParams
  // hasHashtag: number
  // allIndustries: number
  // industries: number[]
  // parentId: number
  image: string
  // imageId?: number
  alt: string

  constructor(
    id: number,
    translation: TranslationsParams,
    // hasHashtag: number,
    // allIndustries: number,
    // industries: number[],
    // parentId: number,
    image: string,
    // imageId?: number,
    alt: string,
  ) {
    this.id = id
    this.translation = translation
    // this.hasHashtag = hasHashtag
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    this.image = image
    // this.imageId = imageId
    this.alt = alt
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

    data['hashtag_id'] = this.id
    data['translations'] = this.translation.toMap()
    // data['has_hashtag'] = this.hasHashtag ? 1 : 0
    // data['all_industries'] = this.allIndustries ? 1 : 0
    // if (!this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId
    if (this.image) data['image'] = this.image
    // if (this.imageId) data['image_id'] = this.imageId
    if (this.alt) data['alt'] = this.alt

    return data
  }
}
