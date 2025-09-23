import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import { AddFactoryItemRepo } from '@/features/setting/FactoryItem/Domain/repositories/addFactoryItemRepo.ts'


export default class AddFactoryItemUseCase implements UseCase<FactoryItemModel, Params> {
  async call(params: Params): Promise<DataState<FactoryItemModel>> {
    return AddFactoryItemRepo.getInstance().call(params)
  }
}
