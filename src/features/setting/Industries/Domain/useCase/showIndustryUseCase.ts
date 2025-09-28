import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowIndustryRepo } from '../repositories/showIndustrRepo'
import IndustryDetailsModel from '@/features/setting/Industries/Data/Models/IndustryDetailsModel.ts'

export default class ShowIndustryUseCase implements UseCase<IndustryDetailsModel, Params> {
  async call(params: Params): Promise<DataState<IndustryDetailsModel>> {
    return ShowIndustryRepo.getInstance().call(params)
  }
}
