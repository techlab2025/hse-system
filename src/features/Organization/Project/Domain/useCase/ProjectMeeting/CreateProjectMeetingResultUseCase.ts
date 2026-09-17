import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '../../../Data/models/ProjectModel'
import { CreateProjectMeetingResultRepo } from '../../repositories/ProjectMeeting/CreateProjectMeetingResultRepo'

export default class CreateProjectMeetingResultUseCase implements UseCase<ProjectModel, Params> {
  async call(params: Params): Promise<DataState<ProjectModel>> {
    return CreateProjectMeetingResultRepo.getInstance().call(params)
  }
}
