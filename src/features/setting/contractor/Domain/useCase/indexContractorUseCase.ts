import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexContractorRepo } from '../repositories/indexContractorRepo'
import type ContractorModel from '../../Data/models/ContractorModel'

export default class IndexContractorUseCase implements UseCase<ContractorModel[], Params> {
  async call(params: Params): Promise<DataState<ContractorModel[]>> {
    return IndexContractorRepo.getInstance().call(params)
  }
}
