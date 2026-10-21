import type Params from '@/base/core/params/params'

export interface FactoryItemExcelRow {
  title: string
  factory_id: number
}

export default class AddFactoryItemExcelParams implements Params {
  constructor(public data: FactoryItemExcelRow[]) {}
  toMap(): { data: FactoryItemExcelRow[] } {
    return {
      data: this.data.map((row) => ({ title: row.title.trim(), factory_id: row.factory_id })),
    }
  }
}
