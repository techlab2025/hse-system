import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InspectionDetailsModel from '../../Data/models/InspectionDetailsModel'
import { ShowInspectionRepo } from '../repositories/showInspectionRepo'

export default class ShowInspectionUseCase implements UseCase<InspectionDetailsModel, Params> {
  async call(params: Params): Promise<DataState<InspectionDetailsModel>> {
    return ShowInspectionRepo.getInstance().call(params)
  }
}
