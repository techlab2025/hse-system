import type Params from '@/base/core/params/params'
import type ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel.ts'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteProjectTypeRepo } from '@/features/setting/ProjectType/Domain/repositories/deleteProjectTypeRepo'

export default class DeleteProjectTypeUseCase implements UseCase<ProjectTypeModel, Params> {
  async call(params: Params): Promise<DataState<ProjectTypeModel>> {
    return DeleteProjectTypeRepo.getInstance().call(params)
  }
}
