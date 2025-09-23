import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import { IndexFactoryItemRepo } from '@/features/setting/FactoryItem/Domain/repositories/indexFactoryItemRepo.ts'

export default class IndexFactoryItemUseCase implements UseCase<FactoryItemModel[], Params> {
  async call(params: Params): Promise<DataState<FactoryItemModel[]>> {
    return IndexFactoryItemRepo.getInstance().call(params)
  }
}
