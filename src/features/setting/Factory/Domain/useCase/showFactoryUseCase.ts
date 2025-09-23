import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryDetailsModel from '../../Data/models/FactoryDetailsModel'
import { ShowFactoryRepo } from '../repositories/showFactoryRepo'


export default class ShowFactoryUseCase
  implements UseCase<FactoryDetailsModel, Params> {
  async call(params: Params): Promise<DataState<FactoryDetailsModel>> {
    return ShowFactoryRepo.getInstance().call(params)
  }
}
