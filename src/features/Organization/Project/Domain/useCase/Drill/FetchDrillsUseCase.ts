import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type DrillModel from '../../../Data/models/Drill/DrillModel'
import FetchDrillsRepo from '../../repositories/Drill/FetchDrillsRepo'

export default class FetchDrillsUseCase implements UseCase<DrillModel[], Params> {
  call(params: Params): Promise<DataState<DrillModel[]>> {
    return FetchDrillsRepo.getInstance().call(params)
  }
}
