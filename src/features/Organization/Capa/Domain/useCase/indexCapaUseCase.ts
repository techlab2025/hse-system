import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexCapaRepo } from '../repositories/indexCapaRepo'
import type IndexCapaModel from '../../Data/models/IndexCapaModel'

export default class IndexCapaUseCase implements UseCase<IndexCapaModel[], Params> {
  async call(params: Params): Promise<DataState<IndexCapaModel[]>> {
    return IndexCapaRepo.getInstance().call(params)
  }
}
