import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PowerFullModel from '../../Data/models/PowerFullModel'
import { DeletePowerFullRepo } from '../repositories/deletePowerFullRepo'



export default class DeletePowerFullUseCase implements UseCase<PowerFullModel, Params> {
  async call(params: Params): Promise<DataState<PowerFullModel>> {
    return DeletePowerFullRepo.getInstance().call(params)
  }
}
