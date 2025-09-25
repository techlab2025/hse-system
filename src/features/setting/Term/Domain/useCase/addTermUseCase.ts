import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TermteModel from '../../Data/models/TermModel'
import { AddTermRepo } from '../repositories/addTermRepo'


export default class AddTermteUseCase implements UseCase<TermteModel, Params> {
  async call(params: Params): Promise<DataState<TermteModel>> {
    return AddTermRepo.getInstance().call(params)
  }
}
