import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowVisitActivityRepo } from '../repositories/showVisitActivityRepo'
import type VisitActivityDetailsModel from '../../Data/models/VisitActivityDetailsModel'

export default class ShowVisitActivityUseCase
  implements UseCase<VisitActivityDetailsModel, Params> {
  async call(params: Params): Promise<DataState<VisitActivityDetailsModel>> {
    return ShowVisitActivityRepo.getInstance().call(params)
  }
}
