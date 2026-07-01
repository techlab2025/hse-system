import type Params from '@/base/core/params/params'

export default class SimilarObservatioParams implements Params {
  public observationId: number
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  constructor(data: {
    observationId: number
    word?: string
    withPage?: number
    perPage?: number
    pageNumber?: number
  }) {
    this.observationId = data.observationId
    this.word = data.word ?? ''
    this.withPage = data.withPage ?? 1
    this.perPage = data.perPage ?? 10
    this.pageNumber = data.pageNumber ?? 10
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['observation_id'] = this.observationId
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    return data
  }
}
