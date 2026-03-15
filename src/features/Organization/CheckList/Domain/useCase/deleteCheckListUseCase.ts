import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteCheckListRepo } from '../repositories/deleteCheckListRepo'
import type CheckListDetailsModel from '../../Data/models/CheckListModel'

export default class DeleteCheckListUseCase implements UseCase<CheckListDetailsModel, Params> {
  async call(params: Params): Promise<DataState<CheckListDetailsModel>> {
    return DeleteCheckListRepo.getInstance().call(params)
  }
}
