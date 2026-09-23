import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import InductionModel from '../../../Data/models/Induction/InductionModel'
import IndexInductionRepo from '../../repositories/Induction/indexInductionRepo'

export default class IndexInductionUseCase implements UseCase<InductionModel[], Params> {
  call(params: Params): Promise<DataState<InductionModel[]>> {
    return IndexInductionRepo.getInstance().call(params)
  }
}
