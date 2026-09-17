import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchProjectMeetingResultRepo } from '../../repositories/ProjectMeeting/FetchProjectMeetingResultRepo'
import type ProjectMeetingDetails from '../../../Data/models/ProjectMeeting/ProjectMeetingDetailsModel'


export default class FetchProjectMeetingResultUseCase implements UseCase<ProjectMeetingDetails, Params> {
  async call(params: Params): Promise<DataState<ProjectMeetingDetails>> {
    return FetchProjectMeetingResultRepo.getInstance().call(params)
  }
}
