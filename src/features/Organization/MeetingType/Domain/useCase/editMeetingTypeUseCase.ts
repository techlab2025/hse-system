import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditMeetingTypeRepo } from '../repositories/editMeetingTypeRepo'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'


export default class EditMeetingTypeUseCase implements UseCase<MeetingTypeModel, Params> {
  async call(params: Params): Promise<DataState<MeetingTypeModel>> {
    return EditMeetingTypeRepo.getInstance().call(params)
  }
}
