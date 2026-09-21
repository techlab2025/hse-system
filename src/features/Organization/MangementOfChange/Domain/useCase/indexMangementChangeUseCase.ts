import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import { IndexMangementChangeRepo } from '../repositories/indexMangementChangeRepo'

export default class IndexMangementChangeUseCase
  implements UseCase<MangementChangeModel[], Params> {
  async call(params: Params): Promise<DataState<MangementChangeModel[]>> {
    return IndexMangementChangeRepo.getInstance().call(params)
  }
}
