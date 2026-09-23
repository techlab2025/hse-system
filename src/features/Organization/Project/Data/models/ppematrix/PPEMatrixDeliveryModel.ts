import PPEMatrixDeliveryActivityModel from './PPEMatrixDeliveryActivityModel'
import PPEMatrixDeliveryReferenceModel from './PPEMatrixDeliveryReferenceModel'

export default class PPEMatrixDeliveryModel {
  constructor(
    public id: number,
    public title: string,
    public type: string,
    public deliveryDate: string,
    public project: PPEMatrixDeliveryReferenceModel,
    public preparedBy: PPEMatrixDeliveryReferenceModel,
    public activity: PPEMatrixDeliveryActivityModel,
  ) {}

  static fromMap(data: Record<string, unknown>): PPEMatrixDeliveryModel {
    const employee =
      data.employee && typeof data.employee === 'object'
        ? (data.employee as Record<string, unknown>)
        : data

    return new PPEMatrixDeliveryModel(
      Number(employee.id ?? data.employee_id ?? data.id ?? 0),
      String(
        employee.title ??
          employee.name ??
          data.employee_title ??
          data.employee_name ??
          data.title ??
          '',
      ),
      String(data.type ?? employee.type ?? 'Employee'),
      String(data.delivery_date ?? data.created_at ?? data.date ?? ''),
      PPEMatrixDeliveryReferenceModel.fromMap(
        data.project ?? { id: data.project_id, title: data.project_title },
      ),
      PPEMatrixDeliveryReferenceModel.fromMap(
        data.prepared_by ??
          data.creator ?? {
            id: data.prepared_by_id ?? data.created_by_id,
            title: data.prepared_by_name ?? data.created_by_name,
          },
      ),
      PPEMatrixDeliveryActivityModel.fromMap(data.activity ?? data.ppe_activity),
    )
  }
}
