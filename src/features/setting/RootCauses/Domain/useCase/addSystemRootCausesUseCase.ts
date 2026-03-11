import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddSystemRootCausesRepo } from '@/features/setting/RootCauses/Domain/repositories/addSystemRootCausesRepo.ts'
import type RootCausesModel from '@/features/setting/RootCauses/Data/models/RootCausesModel'

export default class AddSystemRootCausesUseCase implements UseCase<RootCausesModel, Params> {
  async call(params: Params): Promise<DataState<RootCausesModel>> {
    return AddSystemRootCausesRepo.getInstance().call(params)
  }
}
