import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import { DeleteHomeAboutUsRepo } from '../repositories/deleteHomeAboutUsRepo'


export default class DeleteHomeAboutUsUseCase implements UseCase<HomeAboutUsModel, Params> {
  async call(params: Params): Promise<DataState<HomeAboutUsModel>> {
    return DeleteHomeAboutUsRepo.getInstance().call(params)
  }
}
