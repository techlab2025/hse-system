import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { AddMeetingRepo } from '../../repositories/Meetings/AddMeetingRepo'
import type MeetingModel from '../../../Data/models/Meetings/MeetingModel'

export default class AddMeetingUseCase implements UseCase<MeetingModel, Params> {
  async call(params: Params): Promise<DataState<MeetingModel>> {
    return AddMeetingRepo.getInstance().call(params)
  }
}
