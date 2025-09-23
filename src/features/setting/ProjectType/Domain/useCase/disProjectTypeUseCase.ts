import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveProjectTypeRepo } from '@/features/setting/ProjectType/Domain/repositories/disActiveProjectTypeRepo'
import type ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel.ts'

export default class DisProjectTypeUseCase implements UseCase<ProjectTypeModel, Params> {
  async call(params: Params): Promise<DataState<ProjectTypeModel>> {
    return DisActiveProjectTypeRepo.getInstance().call(params)
  }
}
