import type Params from '@/base/core/params/params'

export default class InvestigationAttachmentsParams implements Params {
  public title: string
  public files: string[]
  constructor(title: string, files: string[]) {
    this.title = title
    this.files = files
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['title'] = this.title
    data['files'] = this.files
    return data
  }
}
