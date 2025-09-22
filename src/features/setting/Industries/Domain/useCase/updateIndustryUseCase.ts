import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IndustryModel from '../../Data/Models/IndustryModel'
import { UpdateIndustryRepo } from '../repositories/updateIndustryRepo'

export default class UpdateIndustryUseCase implements UseCase<IndustryModel, Params> {
  async call(params: Params): Promise<DataState<IndustryModel>> {
    return UpdateIndustryRepo.getInstance().call(params)
  }
}
