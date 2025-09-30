import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HerikalyModel from '../../Data/models/HerikalyModel'
import { DeleteHerikalyRepo } from '../repositories/deleteHerikalyRepo'




export default class DeleteHerikalyUseCase implements UseCase<HerikalyModel, Params> {
  async call(params: Params): Promise<DataState<HerikalyModel>> {
    return DeleteHerikalyRepo.getInstance().call(params)
  }
}
