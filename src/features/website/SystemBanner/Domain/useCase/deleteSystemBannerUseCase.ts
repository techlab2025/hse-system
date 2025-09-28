import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteSystemBannerRepo } from '../repositories/deleteSystemBannerRepo'
import type SystemBannerModel from '../../Data/models/SystemBannerModel'

export default class DeleteSystemBannerUseCase implements UseCase<SystemBannerModel, Params> {
  async call(params: Params): Promise<DataState<SystemBannerModel>> {
    return DeleteSystemBannerRepo.getInstance().call(params)
  }
}
