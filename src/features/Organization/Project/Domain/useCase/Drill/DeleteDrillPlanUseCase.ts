import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'
import DeleteDrillPlanRepo from '../../repositories/Drill/DeleteDrillPlanRepo'

export default class DeleteDrillPlanUseCase implements UseCase<DrillTimelineItemModel, Params> {
  call(params: Params): Promise<DataState<DrillTimelineItemModel>> {
    return DeleteDrillPlanRepo.getInstance().call(params)
  }
}
