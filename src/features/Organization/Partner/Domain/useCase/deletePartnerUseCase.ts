import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PartnerModel from '../../Data/models/PartnerModel'
import { DeletePartnerRepo } from '../repositories/deletePartnerRepo'

export default class DeletePartnerUseCase implements UseCase<PartnerModel, Params> {
  async call(params: Params): Promise<DataState<PartnerModel>> {
    return DeletePartnerRepo.getInstance().call(params)
  }
}
