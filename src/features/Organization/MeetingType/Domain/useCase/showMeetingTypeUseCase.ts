import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowMeetingTypeRepo } from '../repositories/showMeetingTypeRepo'
import MeetingTypeDetailsModel from '../../Data/models/MeetingTypeDetailsModel'

export default class ShowMeetingTypeUseCase
  implements UseCase<MeetingTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<MeetingTypeDetailsModel>> {
    return ShowMeetingTypeRepo.getInstance().call(params)
  }
}
