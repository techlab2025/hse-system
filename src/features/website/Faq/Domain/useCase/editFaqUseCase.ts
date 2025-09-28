import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FaqModel from '../../Data/models/FaqModel'
import { EditFaqRepo } from '../repositories/editFaqRepo'


export default class EditFaqUseCase implements UseCase<FaqModel, Params> {
  async call(params: Params): Promise<DataState<FaqModel>> {
    return EditFaqRepo.getInstance().call(params)
  }
}
