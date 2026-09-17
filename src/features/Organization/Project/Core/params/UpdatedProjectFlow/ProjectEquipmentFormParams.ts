import type TitleInterface from '@/base/Data/Models/title_interface'
import type IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'

export type EquipmentZoneForm = {
  zone: TitleInterface | null
  equipments: TitleInterface[]
  equipmentParams: IndexEquipmentParams
}
