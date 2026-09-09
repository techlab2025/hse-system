import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectFlowResponseModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowResponseModel'
import { BasicProjectRepo } from '../../repositories/UpdatedProjectFlow/BasicProjectRepo'

export default class BasicProjectUseCase implements UseCase<ProjectFlowResponseModel, Params> {
  call(params: Params): Promise<DataState<ProjectFlowResponseModel>> {
    return BasicProjectRepo.getInstance().call(params)
  }
}
