import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TermModel from '../../Data/models/TermModel'
import { EditTermRepo } from '../repositories/editTermRepo'


export default class EditTermUseCase implements UseCase<TermModel, Params> {
  async call(params: Params): Promise<DataState<TermModel>> {
    return EditTermRepo.getInstance().call(params)
  }
}
