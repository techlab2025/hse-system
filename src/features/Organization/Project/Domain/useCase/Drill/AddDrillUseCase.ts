import type Params from '@/base/core/params/params'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type UseCase from '@/base/Domain/UseCase/use_case'
import DrillModel from '../../../Data/models/Drill/DrillModel'
import AddDrillRepo from '../../repositories/Drill/AddDrillRepo'

export default class AddDrillUseCase implements UseCase<DrillModel, Params> {
  call(params: Params): Promise<DataState<DrillModel>> { return AddDrillRepo.getInstance().call(params) }
}
