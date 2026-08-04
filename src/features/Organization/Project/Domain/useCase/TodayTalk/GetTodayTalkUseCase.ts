import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'
import GetTodayTalkRepo from '../../repositories/TodayTalk/GetTodayTalkRepo'

export default class GetTodayTalkUseCase implements UseCase<TodayTalkModel, Params> {
  async call(params: Params): Promise<DataState<TodayTalkModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () =>
        new DataSuccess({
          data: TodayTalkModel.example,
        }),
      onDev: () => GetTodayTalkRepo.getInstance().call(params),
      onProduction: () => GetTodayTalkRepo.getInstance().call(params),
    })
  }
}
