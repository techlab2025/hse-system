import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditContractorRepo } from '../repositories/editContractorRepo'
import type ContractorModel from '../../Data/models/ContractorModel'

export default class EditContractorUseCase implements UseCase<ContractorModel, Params> {
  async call(params: Params): Promise<DataState<ContractorModel>> {
    return EditContractorRepo.getInstance().call(params)
  }
}
