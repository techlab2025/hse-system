/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowEquipmentModel {
  constructor(
    public readonly projectZoonId: number,
    public readonly equipmentId: number,
    public readonly equipmentTitle: string,
  ) {}
  static fromMap(data: Record<string, any>) {
    return new ProjectFlowEquipmentModel(
      data.project_zoon_id,
      data.equipment_id,
      data.equipment_title ?? data.title ?? '',
    )
  }
}
