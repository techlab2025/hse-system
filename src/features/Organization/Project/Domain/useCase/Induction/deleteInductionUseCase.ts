import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import InductionModel from '../../../Data/models/Induction/InductionModel'
import DeleteInductionRepo from '../../repositories/Induction/deleteInductionRepo'

export default class DeleteInductionUseCase implements UseCase<InductionModel, Params> {
  call(params: Params): Promise<DataState<InductionModel>> {
    return DeleteInductionRepo.getInstance().call(params)
  }
}
