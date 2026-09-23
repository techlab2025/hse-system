import PPEMatrixDeliveryActivityModel from './PPEMatrixDeliveryActivityModel'
import PPEMatrixDeliveryEmployeeModel from './PPEMatrixDeliveryEmployeeModel'
import PPEMatrixDeliveryReferenceModel from './PPEMatrixDeliveryReferenceModel'

export default class PPEMatrixDeliveryModel {
  constructor(
    public employeeId: number,
    public employee: PPEMatrixDeliveryEmployeeModel,
    public type: string,
    public deliveryDate: string,
    public project: PPEMatrixDeliveryReferenceModel,
    public preparedBy: PPEMatrixDeliveryReferenceModel,
    public activity: PPEMatrixDeliveryActivityModel,
  ) {}

  static fromMap(data: Record<string, unknown>): PPEMatrixDeliveryModel {
    const employee = PPEMatrixDeliveryEmployeeModel.fromMap(data.employee ?? data)

    return new PPEMatrixDeliveryModel(
      Number(data.employee_id ?? employee.id),
      employee,
      String(data.type ?? 'Employee'),
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
