import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import { DeleteAboutUsFeatureRepo } from '../repositories/deleteAboutUsFeatureRepo'




export default class DeleteAboutUsFeatureUseCase implements UseCase<AboutUsFeatureModel, Params> {
  async call(params: Params): Promise<DataState<AboutUsFeatureModel>> {
    return DeleteAboutUsFeatureRepo.getInstance().call(params)
  }
}
