export default class MangementChangeModel {
  constructor(
    public id?: number,
    public changer_request_id?: number,
    public status?: number,
  ) {}

  static fromMap(data: Record<string, unknown>): MangementChangeModel {
    const id = typeof data.id === 'number' ? data.id : undefined
    const changerRequestId =
      typeof data.changer_request_id === 'number' ? data.changer_request_id : undefined
    const status = typeof data.status === 'number' ? data.status : undefined
    return new MangementChangeModel(id, changerRequestId, status)
  }
}