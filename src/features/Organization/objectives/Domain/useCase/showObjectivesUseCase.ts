import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ObjectivesDetailsModel from '../../Data/models/objectivesDetailsModel'
import { ShowObjectivesRepo } from '../repositories/showObjectivesRepo'


export default class ShowObjectivesUseCase implements UseCase<ObjectivesDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ObjectivesDetailsModel>> {
    return ShowObjectivesRepo.getInstance().call(params)
  }
}
