import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type ProjectMeetingModel from '../../../Data/models/ProjectMeeting/ProjectMeetingModel'
import FetchProjectMeetingsRepo from '../../repositories/ProjectMeeting/FetchProjectMeetingsRepo'

export default class FetchProjectMeetingsUseCase implements UseCase<ProjectMeetingModel[], Params> {
  call(params: Params): Promise<DataState<ProjectMeetingModel[]>> {
    return FetchProjectMeetingsRepo.getInstance().call(params)
  }
}
