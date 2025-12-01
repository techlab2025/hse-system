import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchMyZonesRepo } from '../repositories/FetchMyZonesRepo'
import type MyZonesModel from '../../Data/models/MyZonesModel'

export default class FetchMyZonesUseCase implements UseCase<MyZonesModel[], Params> {
  async call(params: Params): Promise<DataState<MyZonesModel[]>> {
    return FetchMyZonesRepo.getInstance().call(params)
  }
}
