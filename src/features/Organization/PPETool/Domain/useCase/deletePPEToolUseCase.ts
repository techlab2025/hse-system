import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeletePPEToolRepo } from '../repositories/deletePPEToolRepo'
import type PPEToolModel from '../../Data/models/PPEToolModel'

export default class DeletePPEToolUseCase implements UseCase<PPEToolModel, Params> {
  async call(params: Params): Promise<DataState<PPEToolModel>> {
    return DeletePPEToolRepo.getInstance().call(params)
  }
}
