import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PPEActivityToolsModel from '../../../Data/models/ppematrix/PPEActivityToolsModel'
import CreatePPEActivityToolRepo from '../../repositories/ppematrix/CreatePPEActivityToolRepo'

export default class CreatePPEActivityToolUseCase implements UseCase<PPEActivityToolsModel, Params> {
  call(params: Params): Promise<DataState<PPEActivityToolsModel>> {
    return CreatePPEActivityToolRepo.getInstance().call(params)
  }
}
