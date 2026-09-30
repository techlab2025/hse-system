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
    public activities: PPEMatrixDeliveryActivityModel[],
  ) {}

  /**
   * Backward-compatible access for consumers that still expect one activity.
   */
  get activity(): PPEMatrixDeliveryActivityModel {
    return this.activities[0] ?? new PPEMatrixDeliveryActivityModel(0, '', [])
  }

  static fromMap(data: Record<string, unknown>): PPEMatrixDeliveryModel {
    const employee = PPEMatrixDeliveryEmployeeModel.fromMap(data.employee ?? data)
    const activityData = data.ppe_activity ?? data.activities ?? data.activity
    const activities = Array.isArray(activityData)
      ? activityData.map(PPEMatrixDeliveryActivityModel.fromMap)
      : activityData
        ? [PPEMatrixDeliveryActivityModel.fromMap(activityData)]
        : []

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
      activities,
    )
  }
}
