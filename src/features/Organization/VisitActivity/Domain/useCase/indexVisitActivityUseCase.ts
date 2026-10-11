import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexVisitActivityRepo } from '../repositories/indexVisitActivityRepo'
import type VisitActivityModel from '../../Data/models/VisitActivityModel'

export default class IndexVisitActivityUseCase
  implements UseCase<VisitActivityModel[], Params> {
  async call(params: Params): Promise<DataState<VisitActivityModel[]>> {
    return IndexVisitActivityRepo.getInstance().call(params)
  }
}
