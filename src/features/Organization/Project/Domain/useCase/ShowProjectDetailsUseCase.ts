import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ShowProjectDetailsModel from '../../Data/models/ShowProjectDeatilsModel'
import { ShowProjectDetailsRepo } from '../repositories/ShowProjectDetailsRepo'

export default class ShowProjectDetailsUseCase implements UseCase<ShowProjectDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ShowProjectDetailsModel>> {
    return ShowProjectDetailsRepo.getInstance().call(params)
  }
}
