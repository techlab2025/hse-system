import type Params from '@/base/core/params/params'

export default class DeleteVisitThemeParams implements Params {
  constructor(public id: number) {}

  toMap(): Record<string, number> {
    return { visit_theme_id: this.id }
  }
}
