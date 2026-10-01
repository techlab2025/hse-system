export default class PPEMatrixDeliveryEmployeeModel {
  constructor(
    public id: number,
    public name: string,
    public phone: string,
    public email: string,
    public image: string | null,
  ) {}

  static fromMap(data: unknown): PPEMatrixDeliveryEmployeeModel {
    if (!data || typeof data !== 'object') {
      return new PPEMatrixDeliveryEmployeeModel(0, '', '', '', null)
    }

    const item = data as Record<string, unknown>
    return new PPEMatrixDeliveryEmployeeModel(
      Number(item.id ?? item.employee_id ?? 0),
      String(item.name ?? item.title ?? ''),
      String(item.phone ?? ''),
      String(item.email ?? ''),
      typeof item.image === 'string' ? item.image : null,
    )
  }
}
