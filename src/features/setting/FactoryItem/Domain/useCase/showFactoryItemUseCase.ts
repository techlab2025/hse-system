import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryItemDetailsModel from '@/features/setting/FactoryItem/Data/models/factoryItemDetailsModel.ts'
import { ShowFactoryItemRepo } from '@/features/setting/FactoryItem/Domain/repositories/showFactoryItemRepo.ts'

export default class ShowFactoryItemUseCase implements UseCase<FactoryItemDetailsModel, Params> {
  async call(params: Params): Promise<DataState<FactoryItemDetailsModel>> {
    return ShowFactoryItemRepo.getInstance().call(params)
  }
}
