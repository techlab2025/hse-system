import type Params from '@/base/core/params/params'
export default class AddSystemBannerParams implements Params {
  link: string
  image: string

  constructor(link: string, image: string) {
    this.link = link
    this.image = image

  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['link'] = this.link
    data['image'] = this.image

    return data
  }
}
