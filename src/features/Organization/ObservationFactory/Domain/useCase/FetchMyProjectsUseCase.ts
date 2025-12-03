import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { FetchMyProjectsRepo } from '../repositories/FetchMyProjectRepo'

export default class FetchMyProjectsUseCase implements UseCase<ProjectModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectModel[]>> {
    return FetchMyProjectsRepo.getInstance().call(params)
  }
}
