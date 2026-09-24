import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeletePPEActivityRepo } from '../repositories/deletePPEActivityRepo'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'

export default class DeletePPEActivityUseCase implements UseCase<PPEActivityModel, Params> {
  async call(params: Params): Promise<DataState<PPEActivityModel>> {
    return DeletePPEActivityRepo.getInstance().call(params)
  }
}
