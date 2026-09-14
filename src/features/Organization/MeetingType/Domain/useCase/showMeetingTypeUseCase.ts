import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MeetingTypeDetailsModel from '../../Data/models/MeetingTypeDetailsModel'
import { ShowMeetingTypeRepo } from '../repositories/showMeetingTypeRepo'

export default class ShowMeetingTypeUseCase implements UseCase<MeetingTypeDetailsModel, Params> {
  async call(params: Params): Promise<DataState<MeetingTypeDetailsModel>> {
    return ShowMeetingTypeRepo.getInstance().call(params)
  }
}
