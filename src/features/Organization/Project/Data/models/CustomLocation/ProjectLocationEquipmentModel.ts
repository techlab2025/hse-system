import TitleModel from '@/base/core/Models/title_model'
import type TitleInterface from '@/base/Data/Models/title_interface'
import EquipmentDetailsModel from '@/features/setting/Equipment/Data/models/equipmentDetailsModel'
import EquipmentImg from '@/assets/images/EquipmentImg.jpg'
import EquipmentTypeDetailsModel from '@/features/setting/Equipment/Data/models/EquipmentTypeDetails'

export default class ProjectLocationEquipmentModel extends TitleModel {
  public equipmentDescription: string
  public projectZoonEquipmentId: number
  public equipmenType: TitleInterface
  public projectZoonEquipments: EquipmentDetailsModel[]
  public equipment: EquipmentDetailsModel[]

  constructor(
    id: number,
    title: string,
    equipmentDescription: string,
    projectZoonEquipmentId: number,
    equipmenType: TitleInterface,
    projectZoonEquipments: EquipmentDetailsModel[],
    equipment: EquipmentDetailsModel[],
  ) {
    super(title, id)
    this.equipmentDescription = equipmentDescription
    this.projectZoonEquipmentId = projectZoonEquipmentId
    this.equipmenType = equipmenType
    this.projectZoonEquipments = projectZoonEquipments
    this.equipment = equipment
  }

  static fromMap(data: any): ProjectLocationEquipmentModel {
    return new ProjectLocationEquipmentModel(
      data.equipment_id || data.id,
      data.equipment_title || data.title,
      data.equipment_description,
      data.project_zoon_equipment_id,
      data.equipment_type,
      data.project_zoon_equipments?.map((item: any) => EquipmentDetailsModel.fromMap(item)),
      data.equipment,
    )
  }

  static example: ProjectLocationEquipmentModel = new ProjectLocationEquipmentModel(
    1,
    'equipment',
    'New Equipment Description',
    1,
    { id: 1, title: ' Equipment Type 1' },
    null,
    [
      new EquipmentDetailsModel(
        1,
        'New Equipment',
        'New Equipment Description',
        '10-10-2022',
        '10-10-2022',
        'New License Number',
        'New License Plate Number',
        'New Status',
        'New Title',
        1,
        1,
        EquipmentImg,
        [],
        1,
        new EquipmentTypeDetailsModel(
          1,
          'Equipment Type 1',
          'New Equipment Type Description',
          1,
          1,
          '',
          [],
          EquipmentImg,
          '',
          2,
          '',
        ),
        'New Rent Type',
        'New Rent Time',
        'New Start Date',
        'New Vehicle Km',
      ),
      new EquipmentDetailsModel(
        1,
        'New Equipment',
        'New Equipment Description',
        '10-10-2022',
        '10-10-2022',
        'New License Number',
        'New License Plate Number',
        'New Status',
        'New Title',
        1,
        1,
        EquipmentImg,
        [],
        1,
        new EquipmentTypeDetailsModel(
          1,
          'Equipment Type 2',
          'New Equipment Type Description',
          1,
          1,
          '',
          [],
          EquipmentImg,
          '',
          3,
          '',
        ),
        'New Rent Type',
        'New Rent Time',
        'New Start Date',
        'New Vehicle Km',
      ),
    ],
  )
}
