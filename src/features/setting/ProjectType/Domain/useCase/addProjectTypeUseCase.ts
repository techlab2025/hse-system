import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddProjectTypeRepo } from '@/features/setting/ProjectType/Domain/repositories/addProjectTypeRepo.ts'
import type ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel'

export default class AddProjectTypeUseCase implements UseCase<ProjectTypeModel, Params> {
  async call(params: Params): Promise<DataState<ProjectTypeModel>> {
    return AddProjectTypeRepo.getInstance().call(params)
  }
}
