import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '../../Data/models/ProjectModel'
import { EditProjectRepo } from '../repositories/editProjectRepo'


export default class EditProjectUseCase implements UseCase<ProjectModel, Params> {
  async call(params: Params): Promise<DataState<ProjectModel>> {
    return EditProjectRepo.getInstance().call(params)
  }
}
