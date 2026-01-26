import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowRootCausesRepo } from '@/features/setting/RootCauses/Domain/repositories/showRootCausesRepo'
import RootCausesDetailsModel from '@/features/setting/RootCauses/Data/models/RootCausesDetailsModel'

export default class ShowRootCausesUseCase implements UseCase<RootCausesDetailsModel, Params> {
  async call(params: Params): Promise<DataState<RootCausesDetailsModel>> {
    return ShowRootCausesRepo.getInstance().call(params)
  }
}
