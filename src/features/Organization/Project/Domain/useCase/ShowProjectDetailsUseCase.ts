import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import ShowProjectDetailsModel from '../../Data/models/ShowProjectDeatilsModel'
import { ShowProjectDetailsRepo } from '../repositories/ShowProjectDetailsRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class ShowProjectDetailsUseCase implements UseCase<ShowProjectDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ShowProjectDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({
          data: ShowProjectDetailsModel.example,
        })
      },
      onDev: () => {
        return ShowProjectDetailsRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ShowProjectDetailsRepo.getInstance().call(params)
      },
    })
    // return ShowProjectDetailsRepo.getInstance().call(params)
  }
}
