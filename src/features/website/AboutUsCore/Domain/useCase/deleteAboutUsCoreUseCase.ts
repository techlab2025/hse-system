import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import { DeleteAboutUsCoreRepo } from '../repositories/deleteAboutUsCoreRepo'



export default class DeleteAboutUsCoreUseCase implements UseCase<AboutUsCoreModel, Params> {
  async call(params: Params): Promise<DataState<AboutUsCoreModel>> {
    return DeleteAboutUsCoreRepo.getInstance().call(params)
  }
}
