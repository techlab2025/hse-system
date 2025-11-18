import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IncedantDetailsModel from '../../Data/models/IncedantDetailsModel'
import { ShowIncedantRepo } from '../repositories/showIncedantRepo'

export default class ShowIncedantUseCase implements UseCase<IncedantDetailsModel, Params> {
  async call(params: Params): Promise<DataState<IncedantDetailsModel>> {
    return ShowIncedantRepo.getInstance().call(params)
  }
}
