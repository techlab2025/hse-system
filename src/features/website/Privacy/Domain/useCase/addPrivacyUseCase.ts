import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PrivacyteModel from '../../Data/models/PrivacyModel'
import { AddPrivacyRepo } from '../repositories/addPrivacyRepo'


export default class AddPrivacyteUseCase implements UseCase<PrivacyteModel, Params> {
  async call(params: Params): Promise<DataState<PrivacyteModel>> {
    return AddPrivacyRepo.getInstance().call(params)
  }
}
