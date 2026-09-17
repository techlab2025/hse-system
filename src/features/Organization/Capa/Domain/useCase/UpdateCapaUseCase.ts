import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { UpdateCapaRepo } from '../repositories/UpdateCapaRepo'
import type ShowCapaDetailsModel from '../../Data/models/ShowCapaDetailsModel'

export default class UpdateCapaUseCase implements UseCase<ShowCapaDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ShowCapaDetailsModel>> {
    return UpdateCapaRepo.getInstance().call(params)
  }
}
