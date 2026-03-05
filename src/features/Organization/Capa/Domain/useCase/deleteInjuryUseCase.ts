import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InjuryModel from '../../Data/models/InjuryModel'
import { DeleteInjuryRepo } from '../repositories/deleteInjuryRepo'

export default class DeleteInjuryUseCase implements UseCase<InjuryModel, Params> {
  async call(params: Params): Promise<DataState<InjuryModel>> {
    return DeleteInjuryRepo.getInstance().call(params)
  }
}
