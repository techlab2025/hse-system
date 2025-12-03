import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowContractorRepo } from '../repositories/showContractorRepo'
import type ContractorDetailsModel from '../../Data/models/ContractorDetailsModel'

export default class ShowContractorUseCase implements UseCase<ContractorDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ContractorDetailsModel>> {
    return ShowContractorRepo.getInstance().call(params)
  }
}
