import type Params from '@/base/core/params/params'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type UseCase from '@/base/Domain/UseCase/use_case'
import DrillModel from '../../../Data/models/Drill/DrillModel'
import AddDrillPlanningRepo from '../../repositories/Drill/AddDrillPlanningRepo'

export default class AddDrillPlanningUseCase implements UseCase<DrillModel, Params> {
  call(params: Params): Promise<DataState<DrillModel>> { return AddDrillPlanningRepo.getInstance().call(params) }
}
