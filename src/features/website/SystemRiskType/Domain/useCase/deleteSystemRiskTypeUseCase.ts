import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import { DeleteSystemRiskTypeRepo } from '../repositories/deleteSystemRiskTypeRepo'

export default class DeleteSystemRiskTypeUseCase implements UseCase<SystemRiskTypeModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskTypeModel>> {
    return DeleteSystemRiskTypeRepo.getInstance().call(params)
  }
}
