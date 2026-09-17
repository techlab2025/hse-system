import type Params from '@/base/core/params/params'

export default class DeleteDocumentRefrenceParams implements Params {
  constructor(public id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['document_reference_id'] = this.id
    return data
  }
}
