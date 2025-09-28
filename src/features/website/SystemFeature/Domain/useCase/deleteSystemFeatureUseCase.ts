import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import { DeleteSystemFeatureRepo } from '../repositories/deleteSystemFeatureRepo'

export default class DeleteSystemFeatureUseCase implements UseCase<SystemFeatureModel, Params> {
  async call(params: Params): Promise<DataState<SystemFeatureModel>> {
    return DeleteSystemFeatureRepo.getInstance().call(params)
  }
}
