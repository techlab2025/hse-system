import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectFlowResponseModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowResponseModel'
import { ProjectHolidaysRepo } from '../../repositories/UpdatedProjectFlow/ProjectHolidaysRepo'

export default class ProjectHolidaysUseCase implements UseCase<ProjectFlowResponseModel, Params> {
  call(params: Params): Promise<DataState<ProjectFlowResponseModel>> {
    return ProjectHolidaysRepo.getInstance().call(params)
  }
}
