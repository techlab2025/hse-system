import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { CloneAllDataRepo } from '../repositories/CloneALlDataRepo'
import type PartnerModel from '../../Data/models/ProjectProgressDetailsModel'


export default class CloneAllDataUseCase implements UseCase<PartnerModel, Params> {
  async call(params: Params): Promise<DataState<PartnerModel>> {
    return CloneAllDataRepo.getInstance().call(params)
  }
}
