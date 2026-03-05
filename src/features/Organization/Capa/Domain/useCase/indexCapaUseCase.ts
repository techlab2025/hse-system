import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexCapaRepo } from '../repositories/indexCapaRepo'
import type CapaModel from '../../Data/models/CapaModel'
import type HazardModel from '@/features/Organization/ObservationFactory/Data/models/hazardModel'

export default class IndexCapaUseCase implements UseCase<HazardModel[], Params> {
  async call(params: Params): Promise<DataState<HazardModel[]>> {
    return IndexCapaRepo.getInstance().call(params)
  }
}
