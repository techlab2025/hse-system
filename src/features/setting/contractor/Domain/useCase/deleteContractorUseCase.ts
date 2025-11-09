import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteContractorRepo } from '../repositories/deleteContractorRepo'
import type ContractorModel from '../../Data/models/ContractorModel'

export default class DeleteContractorUseCase implements UseCase<ContractorModel, Params> {
  async call(params: Params): Promise<DataState<ContractorModel>> {
    return DeleteContractorRepo.getInstance().call(params)
  }
}
