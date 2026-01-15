import type Params from '@/base/core/params/params'

export default class ShowEquipmentParams implements Params {
  id: number
  isLang?: boolean

  constructor(id: number, isLang?: boolean) {
    this.id = id
    this.isLang = isLang
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['equipment_id'] = this.id
    return data
  }
}
