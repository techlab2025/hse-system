import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import { DeleteClientOpinionRepo } from '../repositories/deleteClientOpinionRepo'

export default class DeleteClientOpinionUseCase implements UseCase<ClientOpinionModel, Params> {
  async call(params: Params): Promise<DataState<ClientOpinionModel>> {
    return DeleteClientOpinionRepo.getInstance().call(params)
  }
}
