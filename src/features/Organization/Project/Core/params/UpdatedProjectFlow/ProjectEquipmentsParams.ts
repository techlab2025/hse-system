import type Params from '@/base/core/params/params'
import type { ProjectZoonEquipment } from './ProjectZoonEquipmentParams'

export default class ProjectEquipmentsParams implements Params {
  public readonly zoons: ProjectZoonEquipment[]
  public readonly projectId: number
  public readonly isUpdate: boolean
  constructor(data: { zoons: ProjectZoonEquipment[]; projectId: number; isUpdate: boolean }) {
    this.zoons = data.zoons
    this.projectId = data.projectId
    this.isUpdate = data.isUpdate
  }

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      zoons: this.zoons,
    }
  }
}
