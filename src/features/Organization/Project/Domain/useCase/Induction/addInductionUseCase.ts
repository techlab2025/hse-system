import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import InductionModel from '../../../Data/models/Induction/InductionModel'
import AddInductionRepo from '../../repositories/Induction/addInductionRepo'

export default class AddInductionUseCase implements UseCase<InductionModel, Params> {
  call(params: Params): Promise<DataState<InductionModel>> {
    return AddInductionRepo.getInstance().call(params)
  }
}
