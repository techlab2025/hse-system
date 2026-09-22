import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditPpeItemRepo } from '../repositories/editPpeItemRepo'
import type PpeItemModel from '../../Data/models/PpeItemModel'


export default class EditPpeItemUseCase implements UseCase<PpeItemModel, Params> {
  async call(params: Params): Promise<DataState<PpeItemModel>> {
    return EditPpeItemRepo.getInstance().call(params)
  }
}
