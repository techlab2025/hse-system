import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PrivacyModel from '../../Data/models/PrivacyModel'
import { EditPrivacyRepo } from '../repositories/editPrivacyRepo'


export default class EditPrivacyUseCase implements UseCase<PrivacyModel, Params> {
  async call(params: Params): Promise<DataState<PrivacyModel>> {
    return EditPrivacyRepo.getInstance().call(params)
  }
}
