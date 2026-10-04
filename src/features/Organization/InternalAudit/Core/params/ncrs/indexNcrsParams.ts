import type Params from '@/base/core/params/params'

export default class IndexNcrsParams implements Params {
  constructor(
    public word: string = '',
    public pageNumber: number = 1,
    public perPage: number = 10,
    public withPage: number = 1,
  ) {}

  toMap() {
    return {
      ...(this.word ? { word: this.word } : {}),
      paginate: this.withPage,
      page: this.pageNumber,
      limit: this.perPage,
    }
  }
}
