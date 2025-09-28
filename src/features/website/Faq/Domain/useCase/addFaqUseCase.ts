import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FaqteModel from '../../Data/models/FaqModel'
import { AddFaqRepo } from '../repositories/addFaqRepo'


export default class AddFaqteUseCase implements UseCase<FaqteModel, Params> {
  async call(params: Params): Promise<DataState<FaqteModel>> {
    return AddFaqRepo.getInstance().call(params)
  }
}
