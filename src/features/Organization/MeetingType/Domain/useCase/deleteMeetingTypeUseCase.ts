import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteMeetingTypeRepo } from '../repositories/deleteMeetingTypeRepo'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'

export default class DeleteMeetingTypeUseCase implements UseCase<MeetingTypeModel, Params> {
  async call(params: Params): Promise<DataState<MeetingTypeModel>> {
    return DeleteMeetingTypeRepo.getInstance().call(params)
  }
}
