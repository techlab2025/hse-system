import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type LocationModel from '../../Data/models/LocationModel'
import { DeleteLocationRepo } from '../repositories/deleteLocationRepo'

export default class DeleteLocationUseCase implements UseCase<LocationModel, Params> {
  async call(params: Params): Promise<DataState<LocationModel>> {
    return DeleteLocationRepo.getInstance().call(params)
  }
}
