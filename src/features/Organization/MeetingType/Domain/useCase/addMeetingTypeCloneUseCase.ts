import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import { AddMeetingTypeCloneRepo } from '../repositories/AddMeetingTypeCloneRepo'

export default class AddMeetingTypeCloneUseCase implements UseCase<MeetingTypeModel, Params> {
  async call(params: Params): Promise<DataState<MeetingTypeModel>> {
    return AddMeetingTypeCloneRepo.getInstance().call(params)
  }
}
