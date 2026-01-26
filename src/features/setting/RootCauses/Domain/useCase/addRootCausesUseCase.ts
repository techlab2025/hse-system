import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddRootCausesRepo } from '@/features/setting/RootCauses/Domain/repositories/addRootCausesRepo.ts'
import type RootCausesModel from '@/features/setting/RootCauses/Data/models/RootCausesModel'

export default class AddRootCausesUseCase implements UseCase<RootCausesModel, Params> {
  async call(params: Params): Promise<DataState<RootCausesModel>> {
    return AddRootCausesRepo.getInstance().call(params)
  }
}
