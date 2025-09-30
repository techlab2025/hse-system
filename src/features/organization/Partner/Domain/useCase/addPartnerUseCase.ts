import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PartnerModel from '../../Data/models/PartnerModel'
import { AddPartnerRepo } from '../repositories/addPartnerRepo'


export default class AddPartnerteUseCase implements UseCase<PartnerModel, Params> {
  async call(params: Params): Promise<DataState<PartnerModel>> {
    return AddPartnerRepo.getInstance().call(params)
  }
}
