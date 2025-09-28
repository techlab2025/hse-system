import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { DeleteSystemRiskManagementRepo } from '../repositories/deleteSystemRiskManagementRepo'




export default class DeleteSystemRiskManagementUseCase implements UseCase<SystemRiskManagementModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskManagementModel>> {
    return DeleteSystemRiskManagementRepo.getInstance().call(params)
  }
}
