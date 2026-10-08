import AttachmentMatrixGroupModel from './AttachmentMatrixGroupModel'

export default class AttachmentMatrixModel {
  constructor(
    public hse_policy: AttachmentMatrixGroupModel,
    public sos: AttachmentMatrixGroupModel,
    public standerd_policy: AttachmentMatrixGroupModel,
  ) {}

  static fromMap(data: Record<string, unknown>): AttachmentMatrixModel {
    const nestedData = data.data
    const payload =
      nestedData && typeof nestedData === 'object' && !Array.isArray(nestedData)
        ? (nestedData as Record<string, unknown>)
        : data

    return new AttachmentMatrixModel(
      AttachmentMatrixGroupModel.fromMap(payload.hse_policy ?? payload.x),
      AttachmentMatrixGroupModel.fromMap(payload.sos ?? payload.y),
      AttachmentMatrixGroupModel.fromMap(payload.standerd_policy ?? payload.z),
    )
  }

  static empty = new AttachmentMatrixModel(
    AttachmentMatrixGroupModel.empty,
    AttachmentMatrixGroupModel.empty,
    AttachmentMatrixGroupModel.empty,
  )
}
