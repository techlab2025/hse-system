import type Params from '@/base/core/params/params'

export default class ShowVisitThemeParams implements Params {
  constructor(public id: number) {}

  toMap(): Record<string, number> {
    return { leadership_theme_id: this.id }
  }
}
