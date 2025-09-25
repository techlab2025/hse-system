import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import { DeleteHomeContactUsRepo } from '../repositories/deleteHomeContactUsRepo'


export default class DeleteHomeContactUsUseCase implements UseCase<HomeContactUsModel, Params> {
  async call(params: Params): Promise<DataState<HomeContactUsModel>> {
    return DeleteHomeContactUsRepo.getInstance().call(params)
  }
}
