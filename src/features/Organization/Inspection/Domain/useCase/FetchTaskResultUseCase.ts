import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchTaskResultRepo } from '../repositories/FetchTaskResultRepo'
import type TaskFullResponseModel from '../../Data/models/FetchTaskResultModels/FullTaskResultModel'

export default class FetchTaskResultUseCase implements UseCase<TaskFullResponseModel, Params> {
  async call(params: Params): Promise<DataState<TaskFullResponseModel>> {
    return FetchTaskResultRepo.getInstance().call(params)
  }
}
