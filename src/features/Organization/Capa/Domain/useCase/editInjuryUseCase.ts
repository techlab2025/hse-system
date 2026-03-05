import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditInjuryRepo } from '../repositories/editInjuryRepo'
import type InjuryModel from '../../Data/models/InjuryModel'


export default class EditInjuryUseCase implements UseCase<InjuryModel, Params> {
  async call(params: Params): Promise<DataState<InjuryModel>> {
    return EditInjuryRepo.getInstance().call(params)
  }
}
