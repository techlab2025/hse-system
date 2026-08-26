import type Params from '@/base/core/params/params'
import type { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class ProjectCustomLocationParams implements Params {
  id: number
  type: number[]
  projectLocationIds?: number[]
  equipmentTypeId?: EquipmentTypesEnum

  constructor(
    id: number,
    type: number[],
    projectLocationIds?: number[],
    equipmentTypeId?: EquipmentTypesEnum,
  ) {
    this.id = id
    this.type = type
    this.projectLocationIds = projectLocationIds
    this.equipmentTypeId = equipmentTypeId
  }

  toMap(): Record<string, number | number[]> {
    const data: Record<string, number | number[]> = {}
    if (this.id || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.id)
    data['type'] = this.type
    if (this.projectLocationIds) data['project_location_ids'] = this.projectLocationIds
    if (this.equipmentTypeId) data['equipment_type'] = this.equipmentTypeId
    return data
  }
}
