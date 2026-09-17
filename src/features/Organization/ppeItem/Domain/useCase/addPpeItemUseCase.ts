import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddPpeItemRepo } from '../repositories/addPpeItemRepo'
import type PpeItemModel from '../../Data/models/PpeItemModel'


export default class AddPpeItemUseCase implements UseCase<PpeItemModel, Params> {
  async call(params: Params): Promise<DataState<PpeItemModel>> {
    return AddPpeItemRepo.getInstance().call(params)
  }
}
