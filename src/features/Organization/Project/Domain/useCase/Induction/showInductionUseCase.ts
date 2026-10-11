import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import InductionDetailsModel from '../../../Data/models/Induction/InductionDetailsModel'
import ShowInductionRepo from '../../repositories/Induction/showInductionRepo'

export default class ShowInductionUseCase implements UseCase<InductionDetailsModel, Params> {
  call(params: Params): Promise<DataState<InductionDetailsModel>> {
    return ShowInductionRepo.getInstance().call(params)
  }
}
