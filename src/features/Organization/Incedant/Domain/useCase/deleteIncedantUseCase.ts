import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IncedantModel from '../../Data/models/IncedantModel'
import { DeleteIncedantRepo } from '../repositories/deleteIncedantRepo'

export default class DeleteIncedantUseCase implements UseCase<IncedantModel, Params> {
  async call(params: Params): Promise<DataState<IncedantModel>> {
    return DeleteIncedantRepo.getInstance().call(params)
  }
}
