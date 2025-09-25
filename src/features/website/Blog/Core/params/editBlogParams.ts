import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditBlogParams implements Params {
  id: number
  translation: TranslationsParams
  // hasBlog: number
  // allIndustries: number
  // industries: number[]
  // parentId: number
  image: string
  // imageId?: number
  alt: string
  hashtags?: number[]
  categories?: number[]

  constructor(
    id: number,
    translation: TranslationsParams,
    // hasBlog: number,
    // allIndustries: number,
    // industries: number[],
    // parentId: number,
    image: string,
    // imageId?: number,
    alt: string,
    hashtags?: number[],
    categories?: number[]
  ) {
    this.id = id
    this.translation = translation
    // this.hasBlog = hasBlog
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    this.image = image
    // this.imageId = imageId
    this.alt = alt
    this.hashtags = hashtags
    this.categories = categories
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

    data['blog_id'] = this.id
    data['translations'] = this.translation.toMap()
    // data['has_blog'] = this.hasBlog ? 1 : 0
    // data['all_industries'] = this.allIndustries ? 1 : 0
    // if (!this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId
    if (this.image) data['image'] = this.image
    // if (this.imageId) data['image_id'] = this.imageId
    if (this.alt) data['alt'] = this.alt
    if (this.hashtags && this.hashtags.length) data['hashtags'] = this.hashtags
    if (this.categories && this.categories.length) data['categories'] = this.categories

    return data
  }
}
