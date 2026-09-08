import type Params from '@/base/core/params/params'

export type ProjectZoonEquipment = {
  project_zoon_id: number
  equipments: { equipment_id: number }[]
}

export default class ProjectEquipmentsParams implements Params {
  constructor(
    public readonly zoons: ProjectZoonEquipment[],
    public readonly projectId: number,
    public readonly isUpdate: boolean = false,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      project_zoons: this.zoons,
    }
  }
}
