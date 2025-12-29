import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import MeetingModel from '../../../Data/models/Meetings/MeetingModel'
import { IndexMeetingRepo } from '../../repositories/Meetings/IndexMeetingRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class IndexMeetingUseCase implements UseCase<MeetingModel[], Params> {
  async call(params: Params): Promise<DataState<MeetingModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: MeetingModel.example })
      },
      onDev: () => {
        return IndexMeetingRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexMeetingRepo.getInstance().call(params)
      },
    })
  }
}
