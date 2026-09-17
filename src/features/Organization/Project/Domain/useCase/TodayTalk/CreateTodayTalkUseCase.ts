import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'
import CreateTodayTalkRepo from '../../repositories/TodayTalk/CreateTodayTalkRepo'

export default class CreateTodayTalkUseCase implements UseCase<TodayTalkModel, Params> {
  call(params: Params): Promise<DataState<TodayTalkModel>> {
    return CreateTodayTalkRepo.getInstance().call(params)
  }
}
