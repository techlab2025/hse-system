import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddVisitActivityRepo } from '../repositories/addVisitActivityRepo'
import type VisitActivityModel from '../../Data/models/VisitActivityModel'

export default class AddVisitActivityUseCase implements UseCase<VisitActivityModel, Params> {
  async call(params: Params): Promise<DataState<VisitActivityModel>> {
    return AddVisitActivityRepo.getInstance().call(params)
  }
}
