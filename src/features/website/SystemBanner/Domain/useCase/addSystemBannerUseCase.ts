import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemBannerModel from '../../Data/models/SystemBannerModel'
import { AddSystemBannerRepo } from '../repositories/addSystemBannerRepo'

export default class AddSystemBannerUseCase implements UseCase<SystemBannerModel, Params> {
  async call(params: Params): Promise<DataState<SystemBannerModel>> {
    return AddSystemBannerRepo.getInstance().call(params)
  }
}
