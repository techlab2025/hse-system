import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditCheckListRepo } from '../repositories/editCheckListRepo'
import type CheckListDetailsModel from '../../Data/models/CheckListModel'


export default class EditCheckListUseCase implements UseCase<CheckListDetailsModel, Params> {
  async call(params: Params): Promise<DataState<CheckListDetailsModel>> {
    return EditCheckListRepo.getInstance().call(params)
  }
}
