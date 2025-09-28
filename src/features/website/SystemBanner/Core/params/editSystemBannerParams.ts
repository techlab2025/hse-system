import type Params from '@/base/core/params/params.ts'
export default class EditSystemBannerParams implements Params {
  id: number
  link: string
  image: string

  constructor(id: number, link: string, image: string) {
    this.id = id
    this.link = link
    this.image = image
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['our_system_banner_id'] = this.id
    data['link'] = this.link
    data['image'] = this.image

    return data
  }
}
