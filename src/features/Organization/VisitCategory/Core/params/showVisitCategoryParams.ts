import type Params from '@/base/core/params/params'

export default class ShowVisitCategoryParams implements Params {
  constructor(public id: number) {}

  toMap(): Record<string, number> {
    return { leadership_category_id: this.id }
  }
}
