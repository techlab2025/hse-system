import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowCheckListRepo } from '../repositories/showCheckListRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import CheckListDetailsModel from '../../Data/models/CheckListModel'

export default class ShowCheckListUseCase
  implements UseCase<CheckListDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<CheckListDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: CheckListDetailsModel.example })
      },
      onDev: () => {
        return ShowCheckListRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ShowCheckListRepo.getInstance().call(params)
      },
    })
  }
}
