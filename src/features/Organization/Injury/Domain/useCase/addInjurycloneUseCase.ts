import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddInjuryRepo } from '../repositories/addInjuryRepo'
import type InjuryModel from '../../Data/models/InjuryModel'
import { AddInjuryclonesRepo } from '../repositories/addInjurycloneRepo'


export default class AddInjuryclonesUseCase implements UseCase<InjuryModel, Params> {
  async call(params: Params): Promise<DataState<InjuryModel>> {
    return AddInjuryclonesRepo.getInstance().call(params)
  }
}
