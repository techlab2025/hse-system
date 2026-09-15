import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteMangementChangeTopicTypeRepo } from '../repositories/deleteMangementChangeTopicTypeRepo'
import type MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'

export default class DeleteMangementChangeTopicTypeUseCase implements UseCase<MangementChangeTopicTypeModel, Params> {
  async call(params: Params): Promise<DataState<MangementChangeTopicTypeModel>> {
    return DeleteMangementChangeTopicTypeRepo.getInstance().call(params)
  }
}
