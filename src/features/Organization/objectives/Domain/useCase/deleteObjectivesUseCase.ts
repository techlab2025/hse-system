import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ObjectivesModel from '../../Data/models/objectivesModel'
import { DeleteObjectivesRepo } from '../repositories/deleteObjectivesRepo'


export default class DeleteObjectivesUseCase implements UseCase<ObjectivesModel, Params> {
  async call(params: Params): Promise<DataState<ObjectivesModel>> {
    return DeleteObjectivesRepo.getInstance().call(params)
  }
}
