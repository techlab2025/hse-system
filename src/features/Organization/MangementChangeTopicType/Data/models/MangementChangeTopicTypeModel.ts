import TitleInterface from '@/base/Data/Models/title_interface'
import { MangementChangeTopicTypeEnum } from '../../Core/Core/MangementChangeTopicTypeEnum'

export default class MangementChangeTopicTypeModel extends TitleInterface {
  constructor(id: number, title: string , public status: MangementChangeTopicTypeEnum ) {
    super({ id, title })
  }

  static fromMap(data: any): MangementChangeTopicTypeModel {
    return new MangementChangeTopicTypeModel(data.id, data.title , data.status)
  }

  static example: MangementChangeTopicTypeModel[] = [
    new MangementChangeTopicTypeModel(1, 'Safety helmet', MangementChangeTopicTypeEnum.employee),
    new MangementChangeTopicTypeModel(2, 'Safety gloves', MangementChangeTopicTypeEnum.employee),
  ]

  static transformData(data: string[][]): MangementChangeTopicTypeModel[] {
    return data.map((row, index) => new MangementChangeTopicTypeModel(index + 1, row[0] || '', MangementChangeTopicTypeEnum.employee))
  }
}
